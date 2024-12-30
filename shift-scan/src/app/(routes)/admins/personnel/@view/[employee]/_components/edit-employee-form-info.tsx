"use client";
import { editPersonnelInfo } from "@/actions/adminActions";
import { useNotification } from "@/app/context/NotificationContext";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Texts } from "@/components/(reusable)/texts";
import { EmployeeContactInfo, Permission, UserProfile } from "@/lib/types";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

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

export const EditEmployeeFormInfo = ({
  formRef,

  editedData,
  setEditedData,
  editedData1,
  setEditedData1,
  initialEmployeeProfile,
  initialEmployeeContactInfo,
  setRenderedData,
  setRenderedData1,
  setPersonalSignature,
  signatureBase64String,
}: Props) => {
  const t = useTranslations("Admins");
  const { setNotification } = useNotification();
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
        setNotification(`${t("EmployeeInfoUpdatedSuccessfully")}`, "success");
        setRenderedData(editedData);
        setRenderedData1(editedData1);
      } else {
        setNotification(`${t("FailedToUpdateEmployeeInfo")}`, "error");
      }
    } catch (error) {
      console.error(`${t("FailedToUpdateEmployeeInfo")}`, error);
      setNotification(`${t("FailedToUpdateEmployeeInfo")}`, "error");
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
    <Holds
      background={"white"}
      className=" col-span-4 my-auto h-full w-full overflow-y-scroll"
    >
      <form
        ref={formRef}
        onSubmit={handleSubmitEdits}
        className="w-full h-full "
      >
        {/* --------------------------------------------------------------------------------------------------------------------*/}
        {/* -----------------------------------------------  Employee Info  ----------------------------------------------------*/}
        {/* --------------------------------------------------------------------------------------------------------------------*/}

        <Holds className="flex-row w-full h-full flex-wrap my-14">
          <Inputs type="hidden" name="id" value={editedData?.id || ""} />

          <Holds className="w-[50%] p-2">
            <Labels size={"p6"}>{t("Username")}</Labels>
            <Inputs
              className="h-14"
              type="text"
              name="userName"
              value={editedData?.username || ""}
              onChange={handleInputChange}
              disabled
            />
          </Holds>
          <Holds className="w-[50%] px-2">
            <Labels size={"p6"} className="">
              {t("FirstName")}
            </Labels>
            <Holds
              position={"row"}
              className="gap-2 h-14 border-[3px] rounded-[10px] border-black"
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
            <Labels size={"p6"}>{t("LastName")}</Labels>
            <Holds
              position={"row"}
              className="gap-2  h-14  border-[3px] rounded-[10px] border-black"
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
            <Labels size={"p6"}>{t("Email")}</Labels>
            <Holds
              position={"row"}
              className="gap-2  h-14  border-[3px] rounded-[10px] border-black"
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
            <Labels size={"p6"}>{t("DateOfBirth")}</Labels>
            <Holds
              position={"row"}
              className="gap-2  h-14  border-[3px] rounded-[10px] border-black"
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
                      titleImg={"/turnBack.svg"}
                      titleImgAlt={"revert"}
                      size={"70"}
                    />
                  </Holds>
                </Buttons>
              )}
            </Holds>
          </Holds>
          <Holds className="w-[50%]  px-2">
            <Labels size={"p6"}>{t("PhoneNumber")}</Labels>
            <Holds
              position={"row"}
              className="gap-2 h-14 border-[3px] rounded-[10px] border-black"
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
            <Labels size={"p6"}>{t("EmergencyContact")}</Labels>
            <Holds
              position={"row"}
              className="gap-2 h-14 border-[3px] rounded-[10px] border-black"
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
            <Labels size={"p6"}>{t("EmergencyContactNumber")}</Labels>
            <Holds
              position={"row"}
              className="gap-2 border-[3px] rounded-[10px] border-black"
            >
              <Inputs
                className="h-14 w-5/6 border-2 border-none focus:outline-none my-auto "
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
            <Labels size={"p6"}>{t("Signature")}</Labels>
            <Holds
              title="Edit Signature"
              className=" border-[3px] rounded-[10px] h-14 border-black cursor-pointer"
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
                  size="70"
                />
              )}
            </Holds>
          </Holds>
        </Holds>
      </form>
    </Holds>
  );
};
