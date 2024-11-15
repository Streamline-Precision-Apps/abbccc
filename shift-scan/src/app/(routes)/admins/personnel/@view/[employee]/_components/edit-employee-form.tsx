"use client";
import { editPersonnelInfo } from "@/actions/adminActions";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Options } from "@/components/(reusable)/options";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { EmployeeContactInfo, Permission, UserProfile } from "@/lib/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  formRef: React.RefObject<HTMLFormElement>;
  user: string;
  userId: string | undefined;
  editedData: UserProfile | null;
  setEditedData: Dispatch<SetStateAction<UserProfile | null>>;
  editedData1: EmployeeContactInfo | null;
  setEditedData1: Dispatch<SetStateAction<EmployeeContactInfo | null>>;
  initialEmployeeProfile: UserProfile | null;
  initialEmployeeContactInfo: EmployeeContactInfo | null;
  setRenderedData: Dispatch<SetStateAction<UserProfile | null>>;
  setRenderedData1: Dispatch<SetStateAction<EmployeeContactInfo | null>>;
  permission: Permission;
  setPersonalSignature: Dispatch<SetStateAction<boolean>>;
  signatureBase64String: string;
};

export const EditEmployeeForm = ({
  formRef,
  user,
  editedData,
  setEditedData,
  editedData1,
  setEditedData1,
  initialEmployeeProfile,
  initialEmployeeContactInfo,
  setRenderedData,
  setRenderedData1,
  userId,
  permission,
  setPersonalSignature,
  signatureBase64String,
}: Props) => {
  const [restrictions, setRestrictions] = useState<boolean>(false);

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

  const revertField = (field: keyof UserProfile) => {
    setEditedData((prevData) =>
      prevData && initialEmployeeProfile
        ? { ...prevData, [field]: initialEmployeeProfile[field] }
        : prevData
    );
  };

  const revertField1 = (field: keyof EmployeeContactInfo) => {
    setEditedData1((prevData) =>
      prevData && initialEmployeeContactInfo
        ? { ...prevData, [field]: initialEmployeeContactInfo[field] }
        : prevData
    );
  };

  // Utility function to check if a specific field has been modified
  const isFieldChanged = (field: keyof UserProfile) => {
    return (
      editedData &&
      initialEmployeeProfile &&
      editedData[field] !== initialEmployeeProfile[field]
    );
  };

  const isFieldChanged1 = (field: keyof EmployeeContactInfo) => {
    return (
      editedData1 &&
      initialEmployeeContactInfo &&
      editedData1[field] !== initialEmployeeContactInfo[field]
    );
  };

  return (
    <Holds className="row-span-8 my-auto h-full">
      <form
        ref={formRef}
        onSubmit={handleSubmitEdits}
        className="w-full h-full"
      >
        {/* --------------------------------------------------------------------------------------------------------------------*/}
        {/* -----------------------------------------------  Employee Info  ----------------------------------------------------*/}
        {/* --------------------------------------------------------------------------------------------------------------------*/}
        <Grids rows={"1"} className="w-full h-full p-5 ">
          <Holds position="row" className="w-full h-full row-span-1 ">
            <Holds className="w-2/3 h-full ">
              <Inputs type="hidden" name="id" value={editedData?.id || ""} />
              <Holds>
                {userId === user ? (
                  <Titles size={"h5"}>Your Information</Titles>
                ) : (
                  <Titles size={"h5"}>Employee Information</Titles>
                )}
              </Holds>
              <Holds className=" w-full flex-wrap h-full  ">
                <Holds className="w-[50%] px-2">
                  <Labels size={"p6"} className="">
                    First Name
                  </Labels>
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
                </Holds>
                <Holds className="w-[50%] px-2">
                  <Labels size={"p6"}>Last Name</Labels>
                  <Holds
                    position={"row"}
                    className="gap-2  h-10  border-[3px] rounded-[10px] border-black"
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
                </Holds>
                <Holds className="w-[50%] px-2">
                  <Labels size={"p6"}>Username</Labels>
                  <Inputs
                    className="h-10"
                    type="text"
                    name="userName"
                    value={editedData?.username || ""}
                    onChange={handleInputChange}
                    disabled
                  />
                </Holds>
                <Holds className="w-[50%] px-2">
                  <Labels size={"p6"}>Email </Labels>
                  <Holds
                    position={"row"}
                    className="gap-2  h-10  border-[3px] rounded-[10px] border-black"
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
                </Holds>
                <Holds className="w-[50%] px-2">
                  <Labels size={"p6"}>Date of Birth </Labels>
                  <Holds
                    position={"row"}
                    className="gap-2  h-10  border-[3px] rounded-[10px] border-black"
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
                </Holds>
                <Holds className="w-[50%] px-2">
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

                <Holds className="w-[50%] px-2">
                  <Labels size={"p6"}>Emergency Contact</Labels>
                  <Holds
                    position={"row"}
                    className="gap-2  h-10  border-[3px] rounded-[10px] border-black"
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
                </Holds>
                <Holds className="w-[50%] px-2">
                  <Labels size={"p6"}>Emergency Contact Number</Labels>
                  <Holds
                    position={"row"}
                    className="gap-2 border-[3px] rounded-[10px] border-black"
                  >
                    <Inputs
                      className="h-10 w-5/6 border-2 border-none focus:outline-none my-auto "
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
                        onClick={() => revertField1("emergencyContactNumber")}
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
                <Holds className="w-[50%] px-2">
                  <Labels size={"p6"}>Signature</Labels>
                  <Holds
                    title="Edit Signature"
                    className=" border-[3px] rounded-[10px] border-black cursor-pointer"
                    onClick={() => setPersonalSignature(true)}
                  >
                    {!signatureBase64String ? (
                      <Holds className="w-full h-full justify-center">
                        <Texts size={"p4"}>No Signature</Texts>
                      </Holds>
                    ) : (
                      <Images
                        titleImg={signatureBase64String || ""}
                        titleImgAlt="personnel"
                        className="rounded-full my-auto m-auto"
                        size="70"
                      />
                    )}
                  </Holds>
                </Holds>
              </Holds>
            </Holds>
            {/* --------------------------------------------------------------------------------------------------------------------*/}
            {/* ----------------------------------------------   Employee Permissions  ---------------------------------------------*/}
            {/* --------------------------------------------------------------------------------------------------------------------*/}

            <Holds className="w-[2px] h-full bg-black mx-5 border-none"></Holds>
            <Grids className="w-1/3 h-full">
              {/* This section is for the permission level to display, the user will be able to change the permission level differently based on roles*/}
              {/*Super admin can change the permission level of anyone */}
              <Holds>
                <Titles size={"h5"}>Employee Permissions</Titles>
              </Holds>
              {permission === "SUPERADMIN" || permission === "ADMIN" ? (
                <>
                  <Labels size={"p6"}>Permission Level</Labels>
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
                    className="h-10"
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
                </>
              ) : (
                //the other cannot change the permission level
                <>
                  <Labels size={"p6"}>Permission Level</Labels>
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
                </>
              )}

              {/* Individual views with separate state bindings */}
              <Labels size={"p6"}>Truck View</Labels>
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

              <Labels size={"p6"}>Tasco View</Labels>
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

              <Labels size={"p6"}>Labor View</Labels>
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

              <Labels size={"p6"}>Mechanic View</Labels>
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
            </Grids>
          </Holds>
        </Grids>
      </form>
    </Holds>
  );
};
