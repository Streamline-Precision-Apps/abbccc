"use client";
import {
  archivePersonnel,
  editPersonnelInfo,
  reactivatePersonnel,
  removeProfilePic,
} from "@/actions/adminActions";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Modals } from "@/components/(reusable)/modals";
import { Options } from "@/components/(reusable)/options";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Permission } from "@/lib/types";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import EmptyView from "../../../_pages/EmptyView";
import Spinner from "@/components/(animations)/spinner";

type Data = {
  DOB: string;
  activeEmployee: boolean;
  email: string;
  firstName: string;
  id: string;
  image: string;
  laborView: boolean;
  lastName: string;
  mechanicView: boolean;
  permission: Permission;
  signature: string;
  startDate: string;
  tascoView: boolean;
  terminationDate: string;
  truckView: boolean;
  username: string;
};

type Data1 = {
  id: number;
  employeeId: string;
  phoneNumber: string;
  emergencyContact: string | null;
  emergencyContactNumber: string | null;
};

export default function Employee({ params }: { params: { employee: string } }) {
  const { data: session } = useSession();
  const permission = session?.user.permission;
  const userId = session?.user.id;
  const pathname = usePathname();
  const [user, setUser] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const formRef = useRef<HTMLFormElement>(null);

  // modal
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isProfilePic, setIsProfilePic] = useState(false); // profile modal
  const [isPersonalProfile, setIsPersonalProfile] = useState(false); // profile modal

  const handleSubmitClick = () => {
    formRef.current?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
  };

  const [restrictions, setRestrictions] = useState<boolean>(false);
  const [userStatus, setUserStatus] = useState<boolean>(false);
  // this is for the employee info
  const [renderedData, setRenderedData] = useState<Data | null>(null);
  const [editedData, setEditedData] = useState<Data | null>(null);

  // this is for the contact info
  const [renderedData1, setRenderedData1] = useState<Data1 | null>(null);
  const [editedData1, setEditedData1] = useState<Data1 | null>(null);

  useEffect(() => {
    const fetchEmployeeInfo = async () => {
      try {
        const response = await fetch(`/api/employeeInfo/${params.employee}`);
        const data = await response.json();
        console.log(data);
        setUser(data.id);
        console.log("permissions", data.permission);
        setUserStatus(data.activeEmployee);
        setRenderedData(data);
        setEditedData(data);

        setImage(data.image);
        setFirstName(data.firstName);
        setLastName(data.lastName);
      } catch (error) {
        console.error("Failed to fetch employee info:", error);
      }
    };

    fetchEmployeeInfo();
  }, [params.employee, pathname]);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch(`/api/contactInfo/${params.employee}`);
        const data = await response.json();
        console.log(data);

        setRenderedData1(data);
        setEditedData1(data);
      } catch (error) {
        console.error("Failed to fetch employee info:", error);
      }
    };

    fetchContactInfo();
  }, [params.employee, pathname]);

  // this is for the restrictions on what the user can do when they want to edit there own info
  useEffect(() => {
    if (userId === user && permission !== "SUPERADMIN") {
      setRestrictions(true);
    } else if (permission === "SUPERADMIN" || permission === "ADMIN") {
      setRestrictions(false);
    } else {
      setRestrictions(true);
    }
  }, [userId, user, permission]);

  // Handle changes in form inputs
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null
    );
  };

  const handleInputChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData1((prevData) =>
      prevData ? { ...prevData, [name]: value } : null
    );
  };

  const handleSubmitEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData(formRef.current!);
      console.log(formData);
      const res = await editPersonnelInfo(formData);
      if (res) {
        console.log("Employee info updated successfully.");
        setRenderedData(editedData);
        setRenderedData1(editedData1);
      } else {
        console.log("Failed to update employee info.");
      }
    } catch (error) {
      console.error("Failed to update employee info:", error);
    }
  };
  const handleReinstate = async () => {
    const formData = new FormData();
    formData.append("userId", user);
    formData.append("active", "true");

    const res = await reactivatePersonnel(formData);
    if (res === true) {
      console.log("Employee info updated successfully.");
      setUserStatus(true);
    } else {
      console.log("Failed to update employee info.");
    }
  };

  const handleTerminate = async () => {
    const formData = new FormData();
    formData.append("userId", user);
    formData.append("active", "false");
    const res = await archivePersonnel(formData);
    if (res === true) {
      console.log("Employee info updated successfully.");
      setUserStatus(false);
    } else {
      console.log("Failed to update employee info.");
    }
  };

  const handleRemoveProfilePic = async () => {
    const formData = new FormData();
    formData.append("userId", user);
    formData.append("image", "");
    const res = await removeProfilePic(formData);
    if (res === null) {
      setImage("");
    }
  };

  const revertField = (field: keyof Data) => {
    setEditedData((prevData) =>
      prevData && renderedData
        ? { ...prevData, [field]: renderedData[field] }
        : prevData
    );
  };

  const revertField1 = (field: keyof Data1) => {
    setEditedData1((prevData) =>
      prevData && renderedData1
        ? { ...prevData, [field]: renderedData1[field] }
        : prevData
    );
  };

  // Utility function to check if a specific field has been modified
  const isFieldChanged = (field: keyof Data) => {
    return (
      editedData && renderedData && editedData[field] !== renderedData[field]
    );
  };

  const isFieldChanged1 = (field: keyof Data1) => {
    return (
      editedData1 &&
      renderedData1 &&
      editedData1[field] !== renderedData1[field]
    );
  };

  if (!renderedData || !renderedData1) {
    return <EmptyView Children={<Spinner size={350} />} />;
  }

  return (
    <Holds className="w-full h-full">
      <Grids rows="10" gap="5">
        <Holds position="row" className="row-span-2 h-full w-full">
          <Grids rows="3" cols={"8"} className="w-full">
            {/* --------------------------------------------------------------------------------------------------------------------*/}
            {/* -----------------------------------------------  Image section  ----------------------------------------------------*/}
            {/* --------------------------------------------------------------------------------------------------------------------*/}
            <Holds
              position="left"
              className="row-start-1 row-end-2 col-start-1 col-end-3 h-full"
              onClick={
                userId !== user
                  ? () => setIsProfilePic(true)
                  : () => setIsPersonalProfile(true)
              }
            >
              <Images
                titleImg={image || "/person.svg"}
                titleImgAlt="personnel"
                className="rounded-full my-auto p-4"
                size="70"
              />
            </Holds>

            <Holds className="row-start-2 row-end-3 col-start-3 col-end-5 h-full">
              <Holds position="right">
                {userId !== user ? (
                  <Titles size="h2" position="left">
                    {firstName} {lastName}
                  </Titles>
                ) : (
                  <Titles size="h2" position="left">
                    Your Profile
                  </Titles>
                )}
              </Holds>
              <Holds>
                <Texts
                  position="left"
                  size="p6"
                  text={userStatus ? "green" : "red"}
                >
                  {userStatus ? "Active" : "Terminated"}
                </Texts>
              </Holds>
            </Holds>
            {/* --------------------------------------------------------------------------------------------------------------------*/}
            {/* -----------------------------------------------  Buttons Section   -------------------------------------------------*/}
            {/* --------------------------------------------------------------------------------------------------------------------*/}
            <Holds className="row-start-1 row-end-2 col-start-6 col-end-9 h-full w-full p-3">
              <Holds position="row" className=" w-full justify-end flex gap-4 ">
                <Holds>
                  <Buttons
                    background="green"
                    type="button"
                    onClick={handleSubmitClick}
                    className="py-2"
                  >
                    <Titles size="h5">Submit Edit</Titles>
                  </Buttons>
                </Holds>
                {userId !== user || permission === "SUPERADMIN" ? (
                  <>
                    {userStatus === true ? (
                      <Holds>
                        <Buttons
                          className="py-2"
                          background="red"
                          onClick={() => setIsOpen(true)}
                        >
                          <Titles size="h5">Terminate Employee</Titles>
                        </Buttons>
                      </Holds>
                    ) : (
                      <Holds>
                        <Buttons
                          background="lightBlue"
                          onClick={() => setIsOpen2(true)}
                        >
                          <Titles size="h5">Activate Employee</Titles>
                        </Buttons>
                      </Holds>
                    )}
                  </>
                ) : null}
              </Holds>
            </Holds>
          </Grids>
        </Holds>
        {/* --------------------------------------------------------------------------------------------------------------------*/}
        {/* -----------------------------------------------  Modal Section  ----------------------------------------------------*/}
        {/* --------------------------------------------------------------------------------------------------------------------*/}
        {/* This is the modal for reinstating  -- #update needed */}
        <Modals
          isOpen={isOpen}
          type="decision"
          handleSubmit={() => {
            handleTerminate();
            setIsOpen(false);
          }}
          handleClose={() => setIsOpen(false)}
        >
          <Texts size="p3">
            Are you sure you want to terminate this employee?
          </Texts>
        </Modals>
        {/* This is the modal for reinstating  -- #update needed */}
        <Modals
          isOpen={isOpen2}
          type="decision"
          handleSubmit={() => {
            handleReinstate();
            setIsOpen2(false);
          }}
          handleClose={() => setIsOpen2(false)}
        >
          <Texts size="p3">
            Are you sure you want to reinstate this employee?
          </Texts>
        </Modals>

        {/* This is the modal for employee profiles to allow user to upload theres -- #update needed */}
        <Modals
          isOpen={isProfilePic}
          type="decision"
          handleSubmit={() => {
            handleRemoveProfilePic();
            setIsProfilePic(false);
          }}
          handleClose={() => setIsProfilePic(false)}
        >
          <Texts size="p3">Remove Profile Photo</Texts>
        </Modals>

        {/* This is the modal for multiple different profile picture upload decisions -- #update needed */}
        <Modals
          isOpen={isPersonalProfile}
          type="decision"
          handleSubmit={() => {
            setIsPersonalProfile(false);
          }}
          handleClose={() => setIsPersonalProfile(false)}
        >
          <Texts size="p3">Remove Profile Photo</Texts>
        </Modals>
        {/* --------------------------------------------------------------------------------------------------------------------*/}
        {/* -----------------------------------------------  Form Section  -----------------------------------------------------*/}
        {/* --------------------------------------------------------------------------------------------------------------------*/}
        <form
          ref={formRef}
          onSubmit={handleSubmitEdits}
          className="row-span-8 h-full"
        >
          {/* --------------------------------------------------------------------------------------------------------------------*/}
          {/* -----------------------------------------------  Employee Info  ----------------------------------------------------*/}
          {/* --------------------------------------------------------------------------------------------------------------------*/}
          <Inputs type="hidden" name="id" value={editedData?.id || ""} />
          <Holds position="row" className="w-full h-full p-4">
            <Holds className="w-2/3 h-full ">
              {userId === user ? (
                <Titles size={"h3"}>Your Information</Titles>
              ) : (
                <Titles size={"h3"}>Employee Information</Titles>
              )}
              <Holds position={"row"} className="gap-16 h-full ">
                <Holds className="w-1/2 h-full my-10 ">
                  <Labels size={"p6"}>First Name</Labels>
                  <Holds
                    position={"row"}
                    className="gap-2 h-10 border-[3px] rounded-[10px] border-black"
                  >
                    <Inputs
                      className="h-full w-5/6 border-2 border-none focus:outline-none my-auto "
                      type="text"
                      name="firstName"
                      value={editedData?.firstName || ""}
                      onChange={handleInputChange}
                    />
                    {isFieldChanged("firstName") && (
                      <Buttons
                        background={"none"}
                        type="button"
                        className="w-1/6"
                        title="Revert changes"
                        onClick={() => revertField("firstName")}
                      >
                        <Holds>
                          <Images
                            titleImg={"/turnBack.svg"}
                            titleImgAlt={"revert"}
                            size={"70"}
                          />
                        </Holds>
                      </Buttons>
                    )}
                  </Holds>
                  <Labels size={"p6"}>Last Name</Labels>
                  <Holds
                    position={"row"}
                    className="gap-2 h-10  border-[3px] rounded-[10px] border-black"
                  >
                    <Inputs
                      className="h-full w-5/6 border-2 border-none focus:outline-none my-auto "
                      type="text"
                      name="lastName"
                      value={editedData?.lastName || ""}
                      onChange={handleInputChange}
                    />
                    {isFieldChanged("lastName") && (
                      <Buttons
                        background={"none"}
                        type="button"
                        className="w-1/6"
                        title="Revert changes"
                        onClick={() => revertField("lastName")}
                      >
                        <Holds>
                          <Images
                            titleImg={"/turnBack.svg"}
                            titleImgAlt={"revert"}
                            size={"70"}
                          />
                        </Holds>
                      </Buttons>
                    )}
                  </Holds>

                  <Labels size={"p6"}>
                    Username
                    <Inputs
                      className="h-10"
                      type="text"
                      name="userName"
                      value={editedData?.username || ""}
                      onChange={handleInputChange}
                      disabled
                    />
                  </Labels>
                  <Labels size={"p6"}>Email </Labels>
                  <Holds
                    position={"row"}
                    className="gap-2 h-10  border-[3px] rounded-[10px] border-black"
                  >
                    <Inputs
                      className="h-full w-5/6 border-2 border-none focus:outline-none my-auto "
                      type="text"
                      name="email"
                      value={editedData?.email || ""}
                      onChange={handleInputChange}
                    />
                    {isFieldChanged("email") && (
                      <Buttons
                        background={"none"}
                        type="button"
                        className="w-1/6"
                        title="Revert changes"
                        onClick={() => revertField("firstName")}
                      >
                        <Holds>
                          <Images
                            titleImg={"/turnBack.svg"}
                            titleImgAlt={"revert"}
                            size={"70"}
                          />
                        </Holds>
                      </Buttons>
                    )}
                  </Holds>

                  <Labels size={"p6"}>Date of Birth </Labels>
                  <Holds
                    position={"row"}
                    className="gap-2 h-10  border-[3px] rounded-[10px] border-black"
                  >
                    <Inputs
                      className="h-full w-5/6 border-2 border-none focus:outline-none my-auto "
                      type="date"
                      name="DOB"
                      value={
                        new Date(editedData?.DOB || "")
                          .toISOString()
                          .split("T")[0]
                      }
                      onChange={handleInputChange}
                    />
                    {isFieldChanged("DOB") && (
                      <Buttons
                        background={"none"}
                        type="button"
                        className="w-1/6"
                        title="Revert changes"
                        onClick={() => revertField("DOB")}
                      >
                        <Holds>
                          <Images
                            titleImg={"/turnBack.svg"}
                            titleImgAlt={"revert"}
                            size={"70"}
                          />
                        </Holds>
                      </Buttons>
                    )}
                  </Holds>

                  <Labels size={"p6"}>Phone Number </Labels>
                  <Holds
                    position={"row"}
                    className="gap-2 h-10 border-[3px] rounded-[10px] border-black"
                  >
                    <Inputs
                      className="h-full w-5/6 border-2 border-none focus:outline-none my-auto "
                      type="tel"
                      name="phoneNumber"
                      value={editedData1?.phoneNumber || ""}
                      onChange={handleInputChange1}
                    />
                    {isFieldChanged1("phoneNumber") && (
                      <Buttons
                        title="Revert changes"
                        type="button"
                        className="w-1/6"
                        background={"none"}
                        onClick={() => revertField1("phoneNumber")}
                      >
                        <Holds>
                          <Images
                            titleImg={"/turnBack.svg"}
                            titleImgAlt={"revert"}
                            size={"70"}
                          />
                        </Holds>
                      </Buttons>
                    )}
                  </Holds>
                </Holds>
                <Holds className="w-1/2 h-full">
                  <Holds className="h-full  mb-20 ">
                    <Holds className="h-full flex justify-start">
                      <Labels size={"p6"}>Emergency Contact</Labels>
                      <Holds
                        position={"row"}
                        className="gap-2 h-10  border-[3px] rounded-[10px] border-black"
                      >
                        <Inputs
                          className="h-full w-5/6 border-2 border-none focus:outline-none my-auto "
                          type="text"
                          name="emergencyContact"
                          value={editedData1?.emergencyContact || ""}
                          onChange={handleInputChange1}
                        />
                        {isFieldChanged1("emergencyContact") && (
                          <Buttons
                            type="button"
                            background={"none"}
                            className="w-1/6"
                            title="Revert changes"
                            onClick={() => revertField1("emergencyContact")}
                          >
                            <Holds>
                              <Images
                                titleImg={"/turnBack.svg"}
                                titleImgAlt={"revert"}
                                size={"70"}
                              />
                            </Holds>
                          </Buttons>
                        )}
                      </Holds>
                      <Labels size={"p6"}>Emergency Contact Number</Labels>
                      <Holds
                        position={"row"}
                        className="gap-2 h-10  border-[3px] rounded-[10px] border-black"
                      >
                        <Inputs
                          className="h-full w-5/6 border-2 border-none focus:outline-none my-auto "
                          type="tel"
                          name="emergencyContactNumber"
                          value={editedData1?.emergencyContactNumber || ""}
                          onChange={handleInputChange1}
                        />
                        {isFieldChanged1("emergencyContactNumber") && (
                          <Buttons
                            type="button"
                            background={"none"}
                            className="w-1/6"
                            title="Revert changes"
                            onClick={() =>
                              revertField1("emergencyContactNumber")
                            }
                          >
                            <Holds>
                              <Images
                                titleImg={"/turnBack.svg"}
                                titleImgAlt={"revert"}
                                size={"70"}
                              />
                            </Holds>
                          </Buttons>
                        )}
                      </Holds>
                    </Holds>
                    <Labels size={"p6"}>Signature</Labels>
                    <Holds className="justify-end w-full h-[200px] border-[3px] rounded-[10px] border-black">
                      {!editedData?.signature ? (
                        <Holds className="w-full h-full justify-center">
                          <Texts size={"p4"}>No Signature</Texts>
                        </Holds>
                      ) : (
                        <Images
                          titleImg={editedData?.signature || ""}
                          titleImgAlt="personnel"
                          className="rounded-full my-auto p-4"
                          size="70"
                        />
                      )}
                    </Holds>
                  </Holds>
                </Holds>
              </Holds>
            </Holds>
            {/* --------------------------------------------------------------------------------------------------------------------*/}
            {/* ----------------------------------------------   Employee Permissions  ---------------------------------------------*/}
            {/* --------------------------------------------------------------------------------------------------------------------*/}

            <Holds className="w-[2px] h-full bg-black mx-5 border-none"></Holds>
            <Holds className="w-1/3 h-full">
              {/* This section is for the permission level to display, the user will be able to change the permission level differently based on roles*/}
              {/*Super admin can change the permission level of anyone */}
              <Titles size={"h3"}>Employee Permissions</Titles>
              {permission === "SUPERADMIN" || permission === "ADMIN" ? (
                <Labels size={"p6"}>
                  Permission Level
                  <Selects
                    value={editedData?.permission || "USER"} // Set default to "USER" if no value
                    onChange={(e) =>
                      setEditedData((prevData) =>
                        prevData
                          ? {
                              ...prevData,
                              permission: e.target.value as Permission,
                            }
                          : null
                      )
                    }
                    name="permission"
                    disabled={restrictions}
                  >
                    <Options
                      value="SUPERADMIN"
                      disabled={editedData?.permission === "SUPERADMIN"}
                    >
                      Super Admin
                    </Options>
                    <Options value="ADMIN">Admin</Options>
                    <Options value="MANAGER">Manager</Options>
                    <Options value="USER"> User</Options>
                  </Selects>
                </Labels>
              ) : (
                //the other cannot change the permission level
                <Labels size={"p6"}>
                  Permission Level
                  <Selects
                    value={editedData?.permission}
                    onChange={handleInputChange}
                    name="permission"
                  >
                    <Options value="SUPERADMIN">Super Admin</Options>
                    <Options value="ADMIN">Admin</Options>
                    <Options value="MANAGER">Manager</Options>
                    <Options value="USER"> User</Options>
                  </Selects>
                </Labels>
              )}

              {/* Individual views with separate state bindings */}
              <Labels size={"p6"}>
                Truck View
                <Selects
                  name="truckView"
                  value={editedData?.truckView ? "true" : "false"}
                  onChange={(e) =>
                    setEditedData((prevData) =>
                      prevData
                        ? {
                            ...prevData,
                            truckView: e.target.value === "true", // Convert back to boolean
                          }
                        : null
                    )
                  }
                >
                  <Options value="true">True</Options>
                  <Options value="false">False</Options>
                </Selects>
              </Labels>

              <Labels size={"p6"}>
                Tasco View
                <Selects
                  name="tascoView"
                  value={editedData?.truckView ? "true" : "false"}
                  onChange={(e) =>
                    setEditedData((prevData) =>
                      prevData
                        ? {
                            ...prevData,
                            tascoView: e.target.value === "true",
                          }
                        : null
                    )
                  }
                >
                  <Options value="true">True</Options>
                  <Options value="false">False</Options>
                </Selects>
              </Labels>

              <Labels size={"p6"}>
                Labor View
                <Selects
                  name="laborView"
                  value={editedData?.laborView ? "true" : "false"}
                  onChange={(e) =>
                    setEditedData((prevData) =>
                      prevData
                        ? {
                            ...prevData,
                            laborView: e.target.value === "true",
                          }
                        : null
                    )
                  }
                >
                  <Options value="true">True</Options>
                  <Options value="false">False</Options>
                </Selects>
              </Labels>

              <Labels size={"p6"}>
                Mechanic View
                <Selects
                  name="mechanicView"
                  value={editedData?.mechanicView ? "true" : "false"}
                  onChange={(e) =>
                    setEditedData((prevData) =>
                      prevData
                        ? {
                            ...prevData,
                            mechanicView: e.target.value === "true",
                          }
                        : null
                    )
                  }
                >
                  <Options value="true">True</Options>
                  <Options value="false">False</Options>
                </Selects>
              </Labels>
            </Holds>
          </Holds>
        </form>
      </Grids>
    </Holds>
  );
}
