"use client";
import {
  archivePersonnel,
  reactivatePersonnel,
  removeProfilePic,
} from "@/actions/adminActions";
import { uploadFirstSignature } from "@/actions/userActions";
import Base64FileEncoder from "@/components/(camera)/Base64FileEncoder";
import Base64ImageEncoder from "@/components/(camera)/Base64ImageEncoder";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { NModals } from "@/components/(reusable)/newmodals";
import Signature from "@/components/(reusable)/signature";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Employee, EmployeeContactInfo, UserProfile } from "@/lib/types";
import { useState } from "react";

type ModalProps = {
  initialEmployeeProfile: UserProfile | null;
  initialEmployeeContactInfo: EmployeeContactInfo;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen2: boolean;
  setIsOpen2: React.Dispatch<React.SetStateAction<boolean>>;
  setUserStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  setSignatureBase64String: React.Dispatch<React.SetStateAction<string>>;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  user: string;
  reloadEmployeeData: () => void;
  reloadSignature: () => void;
  setPersonalSignature: React.Dispatch<React.SetStateAction<boolean>>;
  personalSignature: boolean;
  signatureBase64String: string;
  setEditedData: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setEditedData1: React.Dispatch<
    React.SetStateAction<EmployeeContactInfo | null>
  >;
  setIsProfilePic: React.Dispatch<React.SetStateAction<boolean>>;
  isProfilePic: boolean;
  isPersonalProfile: boolean;
  setIsPersonalProfile: React.Dispatch<React.SetStateAction<boolean>>;
};
export const ModalsPage = ({
  user,
  setIsOpen,
  setUserStatus,
  setImage,
  setSignatureBase64String,
  setIsOpen2,
  isOpen2,
  reloadEmployeeData,
  reloadSignature,
  initialEmployeeProfile,
  signatureBase64String,
  isOpen,
  personalSignature,
  setPersonalSignature,
  setIsProfilePic,
  isProfilePic,
  isPersonalProfile,
  setIsPersonalProfile,
}: ModalProps) => {
  const [base64String, setBase64String] = useState<string>("");
  const [uploadProfilePic, setUploadProfilePic] = useState(false); // update profile pic modal
  const [uploadProfilePicWithCamera, setUploadProfilePicWithCamera] =
    useState(false);

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
    <>
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
                    reloadSignature();
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
                  employee={initialEmployeeProfile as Employee}
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
                  employee={initialEmployeeProfile as Employee}
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
    </>
  );
};
