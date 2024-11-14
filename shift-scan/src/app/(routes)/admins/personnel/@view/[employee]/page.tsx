"use client";
import {
  archivePersonnel,
  reactivatePersonnel,
  removeProfilePic,
} from "@/actions/adminActions";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { NModals } from "@/components/(reusable)/newmodals";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Permission } from "@/lib/types";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import EmptyView from "../../../_pages/EmptyView";
import Spinner from "@/components/(animations)/spinner";
import { EditEmployeeForm } from "./_components/edit-employee-form";
import { Contents } from "@/components/(reusable)/contents";
import Base64FileEncoder from "@/components/(camera)/Base64FileEncoder";
import Base64ImageEncoder from "@/components/(camera)/Base64ImageEncoder";
import Signature from "@/components/(reusable)/signature";
import { uploadFirstSignature } from "@/actions/userActions";

type UserProfile = {
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

type EmployeeContactInfo = {
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
  const [editedData, setEditedData] = useState<UserProfile | null>(null);
  const [editedData1, setEditedData1] = useState<EmployeeContactInfo | null>(
    null
  );
  // modal
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isProfilePic, setIsProfilePic] = useState(false); // profile modal
  const [isPersonalProfile, setIsPersonalProfile] = useState(false); // profile modal

  const [uploadProfilePic, setUploadProfilePic] = useState(false); // update profile pic modal
  const [uploadProfilePicWithCamera, setUploadProfilePicWithCamera] =
    useState(false);
  const [personalSignature, setPersonalSignature] = useState(false);
  const [signatureBase64String, setSignatureBase64String] =
    useState<string>("");
  const [base64String, setBase64String] = useState<string>("");
  const handleSubmitClick = () => {
    formRef.current?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
  };

  const [userStatus, setUserStatus] = useState<boolean>(false);
  // this is for the employee info
  const [initialEmployeeProfile, setRenderedData] =
    useState<UserProfile | null>(null);
  // this is for the contact info
  const [initialEmployeeContactInfo, setRenderedData1] =
    useState<EmployeeContactInfo | null>(null);

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
        setSignatureBase64String(data.signature);
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

  const reloadEmployeeData = async () => {
    try {
      const response = await fetch(`/api/employeeInfo/${params.employee}`);
      const data = await response.json();
      setImage(data.image);
      setSignatureBase64String(data.signature);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      // other data updates if needed
    } catch (error) {
      console.error("Failed to fetch employee info:", error);
    }
  };

  if (!initialEmployeeProfile || !initialEmployeeContactInfo) {
    return <EmptyView Children={<Spinner size={350} />} />;
  }

  const handleSignature = async () => {
    const formData = new FormData();
    formData.append("id", user);
    // add error handling to ensure that base64String is a string
    if (typeof signatureBase64String === "object") {
      formData.append("signature", JSON.stringify(signatureBase64String));
    } else {
      formData.append("signature", signatureBase64String);
    }
    console.log(formData);

    try {
      await uploadFirstSignature(formData);
    } catch (error) {
      console.error("Error uploading signature:", error);
    }
  };

  return (
    <Holds className="w-full h-full">
      <Grids rows="10" gap="5">
        <Holds position="row" className="row-span-2 w-full h-full">
          <Grids rows="3" cols={"8"} className="w-full h-full">
            {/* --------------------------------------------------------------------------------------------------------------------*/}
            {/* -----------------------------------------------  Image section  ----------------------------------------------------*/}
            {/* --------------------------------------------------------------------------------------------------------------------*/}
            <Holds
              position="left"
              className="row-start-1 row-end-2 col-start-1 col-end-3 h-full cursor-pointer"
              title="Change Profile Picture"
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
        {/* -----------------------------------------------  Form Section  -----------------------------------------------------*/}
        {/* --------------------------------------------------------------------------------------------------------------------*/}
        <EditEmployeeForm
          initialEmployeeProfile={initialEmployeeProfile}
          setRenderedData={setRenderedData}
          initialEmployeeContactInfo={initialEmployeeContactInfo}
          editedData={editedData}
          editedData1={editedData1}
          setEditedData={setEditedData}
          setEditedData1={setEditedData1}
          formRef={formRef}
          user={""}
          setRenderedData1={setRenderedData1}
          userId={user}
          permission={"USER"}
          signatureBase64String={signatureBase64String}
          setPersonalSignature={() => setPersonalSignature(true)}
        />
      </Grids>
      {/* --------------------------------------------------------------------------------------------------------------------*/}
      {/* -----------------------------------------------  Modal Section  ----------------------------------------------------*/}
      {/* --------------------------------------------------------------------------------------------------------------------*/}
      {/* This is the modal for reinstating  -- #update needed */}
      <NModals isOpen={isOpen} handleClose={() => setIsOpen(false)}>
        <Holds className="mb-5">
          <Texts size={"p4"}>
            Are you sure you want to terminate this employee?
          </Texts>
        </Holds>
        <Holds className="h-full my-5">
          <Contents width={"section"}>
            <Holds className="flex gap-4">
              <Buttons
                background="red"
                type="button"
                onClick={() => {
                  handleTerminate();
                  setIsOpen(false);
                }}
                className="px-4 py-2"
              >
                <Titles size="h4"> Yes, terminate</Titles>
              </Buttons>
              <Buttons
                background="lightBlue"
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2"
              >
                <Titles size="h4">Cancel</Titles>
              </Buttons>
            </Holds>
          </Contents>
        </Holds>
      </NModals>
      {/* This is the modal for signature  -- #update needed */}
      <NModals
        size={"lg"}
        isOpen={personalSignature}
        handleClose={() => setPersonalSignature(false)}
      >
        <Holds className="mb-5">
          <Texts size={"p4"}>Change Signature</Texts>
        </Holds>
        <Holds className="h-full my-5">
          <Contents width={"section"}>
            <Holds>
              <Signature setBase64String={setSignatureBase64String} />
              <Holds position={"row"} className="flex gap-4">
                <Buttons
                  background="green"
                  type="button"
                  onClick={() => {
                    handleSignature();
                    setPersonalSignature(false);
                    reloadEmployeeData();
                  }}
                  className="px-4 py-2"
                >
                  <Titles size="h4">Save</Titles>
                </Buttons>
                <Buttons
                  background="lightBlue"
                  type="button"
                  onClick={() => setPersonalSignature(false)}
                  className="px-4 py-2"
                >
                  <Titles size="h4">Cancel</Titles>
                </Buttons>
              </Holds>
            </Holds>
          </Contents>
        </Holds>
      </NModals>

      {/* This is the modal for reinstating  -- #update needed */}
      <NModals isOpen={isOpen2} handleClose={() => setIsOpen2(false)}>
        <Holds className="mb-5">
          <Texts size={"p4"}>
            Are you sure you want to reinstate this employee?
          </Texts>
        </Holds>
        <Holds className="h-full my-5">
          <Contents width={"section"}>
            <Holds className="flex gap-4">
              <Buttons
                background="green"
                type="button"
                onClick={() => {
                  handleReinstate();
                  setIsOpen2(false);
                }}
                className="px-4 py-2"
              >
                <Titles size="h4">Reinstate</Titles>
              </Buttons>
              <Buttons
                background="lightBlue"
                type="button"
                onClick={() => setIsOpen2(false)}
                className="px-4 py-2"
              >
                <Titles size="h4">Cancel</Titles>
              </Buttons>
            </Holds>
          </Contents>
        </Holds>
      </NModals>

      {/* This is the modal for employee profiles to allow user to upload theres -- #update needed */}
      <NModals isOpen={isProfilePic} handleClose={() => setIsProfilePic(false)}>
        <Holds className="mb-5">
          <Texts size={"p4"}>Change Profile Photo</Texts>
        </Holds>
        <Holds className="h-full my-5">
          <Contents width={"section"}>
            <Holds className="flex gap-4">
              <Buttons
                background="red"
                type="button"
                onClick={() => {
                  handleRemoveProfilePic();
                  setIsProfilePic(false);
                }}
                className="px-4 py-2"
              >
                <Titles size="h4">Remove Profile Photo</Titles>
              </Buttons>
              <Buttons
                background="lightBlue"
                type="button"
                onClick={() => setIsProfilePic(false)}
                className="px-4 py-2"
              >
                <Titles size="h4">Cancel</Titles>
              </Buttons>
            </Holds>
          </Contents>
        </Holds>
      </NModals>

      {/* This is the modal for multiple different profile picture upload decisions -- #update needed */}
      <NModals
        isOpen={isPersonalProfile}
        handleClose={() => setIsPersonalProfile(false)}
        size={"lg"}
      >
        <Holds className="mb-5">
          <Texts size={"p4"}>Change Profile Photo</Texts>
        </Holds>
        <Holds className="h-full my-5">
          <Contents width={"section"}>
            <Holds className="flex gap-4">
              <Buttons
                background="green"
                type="button"
                onClick={() => {
                  setUploadProfilePic(true);
                  setIsPersonalProfile(false);
                }}
                className="px-4 py-2"
              >
                <Titles size="h4">Upload Photo</Titles>
              </Buttons>
              <Buttons
                background="green"
                type="button"
                onClick={() => {
                  setUploadProfilePicWithCamera(true);
                  setIsPersonalProfile(false);
                }}
                className="px-4 py-2"
              >
                <Titles size="h4">Use Camera</Titles>
              </Buttons>

              <Buttons
                background="red"
                type="button"
                onClick={() => {
                  setIsPersonalProfile(false);
                }}
                className="px-4 py-2"
              >
                <Titles size="h4">Remove Profile Photo</Titles>
              </Buttons>
              <Buttons
                background="lightBlue"
                type="button"
                onClick={() => setIsPersonalProfile(false)}
                className="px-4 py-2"
              >
                <Titles size="h4">Cancel</Titles>
              </Buttons>
            </Holds>
          </Contents>
        </Holds>
      </NModals>

      {/* Modal for Uploading Profile Picture */}
      <NModals
        isOpen={uploadProfilePic}
        handleClose={() => setUploadProfilePic(false)}
        size={"xl"}
      >
        <Holds className="h-full w-full">
          <Holds className="mb-5 ">
            <Texts size={"p4"}>Change Profile Photo</Texts>
          </Holds>

          <Holds className="flex gap-4 h-full w-[70%]">
            <Grids rows={"4"} gap={"5"}>
              <Holds className="h-full row-span-3">
                <Base64FileEncoder
                  employee={initialEmployeeProfile}
                  base64String={base64String}
                  setBase64String={setBase64String}
                  setIsOpen={setUploadProfilePic} // Close modal on success
                  reloadEmployeeData={reloadEmployeeData}
                />
                <Holds className="row-span-1 h-full">
                  <Buttons
                    background="lightBlue"
                    type="button"
                    onClick={() => setUploadProfilePic(false)}
                    className="px-4 py-2  "
                  >
                    <Titles size="h4">Cancel</Titles>
                  </Buttons>
                </Holds>
              </Holds>
            </Grids>
          </Holds>
        </Holds>
      </NModals>

      {/* Modal for Uploading Profile Picture via camera */}
      <NModals
        isOpen={uploadProfilePicWithCamera}
        handleClose={() => setUploadProfilePicWithCamera(false)}
        size={"xl"}
      >
        <Holds className="h-full w-full">
          <Holds className="mb-5 ">
            <Texts size={"p4"}>Change Profile Photo</Texts>
          </Holds>

          <Holds className="flex gap-4 h-full w-[70%]">
            <Grids rows={"4"} gap={"5"}>
              <Holds className="h-full row-span-3">
                <Base64ImageEncoder
                  employee={initialEmployeeProfile}
                  base64String={base64String}
                  setBase64String={setBase64String}
                  setIsOpen={setUploadProfilePicWithCamera} // Close modal on success
                  reloadEmployeeData={reloadEmployeeData}
                />
                <Holds className="row-span-1 h-full">
                  <Contents width={"section"}>
                    <Buttons
                      background="lightBlue"
                      type="button"
                      size={"40"}
                      onClick={() => setUploadProfilePicWithCamera(false)}
                      className="px-4 py-2  "
                    >
                      <Titles size="h4">Cancel</Titles>
                    </Buttons>
                  </Contents>
                </Holds>
              </Holds>
            </Grids>
          </Holds>
        </Holds>
      </NModals>
    </Holds>
  );
}
