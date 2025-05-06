"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Texts } from "@/components/(reusable)/texts";
import { UserProfile, EmployeeContactInfo } from "@/lib/types";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

export function EditEmployeeMainLeft({
  initialEmployeeProfile,
  initialEmployeeContactInfo,
  editedData,
  editedData1,
  setEditedData,
  setEditedData1,
  formRef,
  signatureBase64String,
  setPersonalSignature,
}: {
  initialEmployeeProfile: UserProfile | null;
  setRenderedData: Dispatch<SetStateAction<UserProfile | null>>;
  initialEmployeeContactInfo: EmployeeContactInfo | null;
  editedData: UserProfile | null;
  editedData1: EmployeeContactInfo | null;
  setEditedData: Dispatch<SetStateAction<UserProfile | null>>;
  setEditedData1: Dispatch<SetStateAction<EmployeeContactInfo | null>>;
  formRef: React.RefObject<HTMLFormElement>;
  user: string;
  setRenderedData1: Dispatch<SetStateAction<EmployeeContactInfo | null>>;
  userId: string | undefined;
  signatureBase64String: string;
  setPersonalSignature: Dispatch<SetStateAction<boolean>>;
  reloadEmployeeData: () => void;
  reloadSignature: () => void;
}) {
  const t = useTranslations("Admins");
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
    <Holds
      background={"white"}
      className=" col-span-4 my-auto h-full w-full overflow-y-scroll no-scrollbar"
    >
      <form
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}
        className="w-full h-full my-10"
      >
        {/* --------------------------------------------------------------------------------------------------------------------*/}
        {/* -----------------------------------------------  Employee Info  ----------------------------------------------------*/}
        {/* --------------------------------------------------------------------------------------------------------------------*/}

        <Holds className="flex-row w-full h-full flex-wrap">
          <Inputs type="hidden" name="id" value={editedData?.id || ""} />

          <Holds className="w-[50%] p-2">
            <Labels size={"p4"}>{t("Username")}</Labels>
            <Inputs
              className="h-[50px]"
              type="text"
              name="userName"
              value={editedData?.username || ""}
              onChange={handleInputChange}
              disabled
            />
          </Holds>
          <Holds className="w-[50%] px-2">
            <Labels size={"p4"} className="">
              {t("FirstName")}
            </Labels>
            <Holds
              position={"row"}
              className="gap-2 h-[50px] border-[3px] rounded-[10px] border-black"
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
                      titleImg={"/arrowBack.svg"}
                      titleImgAlt={"revert"}
                      size={"70"}
                    />
                  </Holds>
                </Buttons>
              )}
            </Holds>
          </Holds>
          <Holds className="w-[50%] px-2">
            <Labels size={"p4"}>{t("LastName")}</Labels>
            <Holds
              position={"row"}
              className="gap-2  h-[50px]  border-[3px] rounded-[10px] border-black"
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
                      titleImg={"/arrowBack.svg"}
                      titleImgAlt={"revert"}
                      size={"70"}
                    />
                  </Holds>
                </Buttons>
              )}
            </Holds>
          </Holds>

          <Holds className="w-[50%] px-2">
            <Labels size={"p4"}>{t("Email")}</Labels>
            <Holds
              position={"row"}
              className="gap-2  h-[50px]  border-[3px] rounded-[10px] border-black"
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
                      titleImg={"/arrowBack.svg"}
                      titleImgAlt={"revert"}
                      size={"70"}
                    />
                  </Holds>
                </Buttons>
              )}
            </Holds>
          </Holds>
          <Holds className="w-[50%] px-2">
            <Labels size={"p4"}>{t("DateOfBirth")}</Labels>
            <Holds
              position={"row"}
              className="gap-2  h-[50px]  border-[3px] rounded-[10px] border-black"
            >
              <Inputs
                className="h-full w-5/6 border-2 border-none focus:outline-none my-auto "
                type="date"
                name="DOB"
                value={
                  editedData?.DOB && !isNaN(new Date(editedData?.DOB).getTime())
                    ? new Date(editedData?.DOB).toISOString().split("T")[0]
                    : ""
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
                      titleImg={"/arrowBack.svg"}
                      titleImgAlt={"revert"}
                      size={"70"}
                    />
                  </Holds>
                </Buttons>
              )}
            </Holds>
          </Holds>
          <Holds className="w-[50%]  px-2">
            <Labels size={"p4"}>{t("PhoneNumber")}</Labels>
            <Holds
              position={"row"}
              className="gap-2 h-[50px] border-[3px] rounded-[10px] border-black"
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
                      titleImg={"/arrowBack.svg"}
                      titleImgAlt={"revert"}
                      size={"70"}
                    />
                  </Holds>
                </Buttons>
              )}
            </Holds>
          </Holds>

          <Holds className="w-[50%] px-2">
            <Labels size={"p4"}>{t("EmergencyContact")}</Labels>
            <Holds
              position={"row"}
              className="gap-2 h-[50px] border-[3px] rounded-[10px] border-black"
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
                      titleImg={"/arrowBack.svg"}
                      titleImgAlt={"revert"}
                      size={"70"}
                    />
                  </Holds>
                </Buttons>
              )}
            </Holds>
          </Holds>
          <Holds className="w-[50%] px-2">
            <Labels size={"p4"}>{t("EmergencyContactNumber")}</Labels>
            <Holds
              position={"row"}
              className="gap-2 border-[3px] rounded-[10px] border-black"
            >
              <Inputs
                className="h-[50px] w-5/6 border-2 border-none focus:outline-none my-auto "
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
                      titleImg={"/arrowBack.svg"}
                      titleImgAlt={"revert"}
                      size={"70"}
                    />
                  </Holds>
                </Buttons>
              )}
            </Holds>
          </Holds>
          <Holds className="w-[50%] px-2">
            <Labels size={"p4"}>{t("Signature")}</Labels>
            <Holds
              title="Edit Signature"
              className=" border-[3px] rounded-[10px] h-[50px] border-black cursor-pointer"
              onClick={() => setPersonalSignature(true)}
            >
              {!signatureBase64String ? (
                <Holds className="w-full h-full justify-center">
                  <Texts size={"p4"}>{t("NoSignature")}</Texts>
                </Holds>
              ) : (
                <Images
                  titleImg={signatureBase64String || ""}
                  titleImgAlt="personnel"
                  className="rounded-full my-auto m-auto"
                  size="40"
                />
              )}
            </Holds>
          </Holds>
        </Holds>
      </form>
    </Holds>
  );
}
