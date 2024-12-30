"use client";

import { Holds } from "@/components/(reusable)/holds";
import { ReusableViewLayout } from "./_components/reusableViewLayout";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import EmptyView from "../../../_pages/EmptyView";
import Spinner from "@/components/(animations)/spinner";
import { EditEmployeeForm } from "./_components/edit-employee-form";
import { EmployeeContactInfo, UserProfile } from "@/lib/types";
import { ModalsPage } from "./_components/modal";
import { useTranslations } from "next-intl";
import { Texts } from "@/components/(reusable)/texts";
import { Images } from "@/components/(reusable)/images";
import { Grids } from "@/components/(reusable)/grids";
import { Inputs } from "@/components/(reusable)/inputs";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { EditEmployeeFormInfo } from "./_components/edit-employee-form-info";

export default function Employee({ params }: { params: { employee: string } }) {
  const t = useTranslations("Admins");
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

  const [personalSignature, setPersonalSignature] = useState(false);
  const [signatureBase64String, setSignatureBase64String] =
    useState<string>("");

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
        setUser(data.id);
        setUserStatus(data.activeEmployee);
        setRenderedData(data);
        setEditedData(data);
        setSignatureBase64String(data.signature);
        setImage(data.image);
        setFirstName(data.firstName);
        setLastName(data.lastName);
      } catch (error) {
        console.error(`${t("FailedToFetch")} ${t("EmployeeInfo")}`, error);
      }
    };

    fetchEmployeeInfo();
  }, [params.employee, pathname, t]);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch(`/api/contactInfo/${params.employee}`);
        const data = await response.json();
        console.log(data);

        setRenderedData1(data);
        setEditedData1(data);
      } catch (error) {
        console.error(`${t("FailedToFetch")} ${t("EmployeeInfo")}`, error);
      }
    };

    fetchContactInfo();
  }, [params.employee, pathname, t]);

  const reloadEmployeeData = async () => {
    try {
      const response = await fetch(`/api/employeeInfo/${params.employee}`);
      const data = await response.json();
      setImage(data.image);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      // other data updates if needed
    } catch (error) {
      console.error(`${t("FailedToReload")} ${t("EmployeeInfo")}`, error);
    }
  };

  const reloadSignature = async () => {
    const loadSignature = async () => {
      try {
        const response = await fetch(`/api/employeeInfo/${params.employee}`);
        const data = await response.json();
        setSignatureBase64String(data.signature);
      } catch (error) {
        console.error(`${t("FailedToFetch")} ${t("EmployeeSignature")}`, error);
      }
    };
    setTimeout(() => loadSignature(), 1000);
  };

  if (!initialEmployeeProfile || !initialEmployeeContactInfo) {
    return (
      <EmptyView
        Children={
          <>
            <Spinner size={350} />
          </>
        }
      />
    );
  }

  return (
    <Holds className="w-full h-full">
      <ReusableViewLayout
        custom={true}
        header={
          <EditEmployeeHeader
            userId={userId}
            user={user}
            image={image}
            setIsProfilePic={setIsProfilePic}
            setIsPersonalProfile={setIsPersonalProfile}
            userStatus={userStatus}
            firstName={firstName}
            lastName={lastName}
          />
        }
        mainHolds="h-full w-full flex flex-row row-span-6 col-span-2 grid grid-cols-6 grid-rows-1 bg-app-dark-blue px-3 py-2 rounded-[10px] gap-4"
        mainLeft={
          <EditEmployeeMainLeft
            reloadEmployeeData={reloadEmployeeData}
            reloadSignature={reloadSignature}
            initialEmployeeProfile={initialEmployeeProfile}
            initialEmployeeContactInfo={initialEmployeeContactInfo}
            setRenderedData={setRenderedData}
            setRenderedData1={setRenderedData1}
            editedData={editedData}
            editedData1={editedData1}
            formRef={formRef}
            setPersonalSignature={setPersonalSignature}
            signatureBase64String={signatureBase64String}
            setEditedData={setEditedData}
            setEditedData1={setEditedData1}
            user={user}
            userId={userId}
          />
        }
        mainRight={
          <EditEmployeeMainRight
            reloadEmployeeData={reloadEmployeeData}
            reloadSignature={reloadSignature}
            initialEmployeeProfile={initialEmployeeProfile}
            initialEmployeeContactInfo={initialEmployeeContactInfo}
            setRenderedData={setRenderedData}
            setRenderedData1={setRenderedData1}
            editedData={editedData}
            editedData1={editedData1}
            formRef={formRef}
            setPersonalSignature={setPersonalSignature}
            signatureBase64String={signatureBase64String}
            setEditedData={setEditedData}
            setEditedData1={setEditedData1}
            user={user}
            userId={userId}
            permission={permission}
          />
        }
        footer={
          <EditEmployeeFooter
            userId={userId}
            handleSubmitClick={handleSubmitClick}
            setIsOpen={setIsOpen}
            setIsOpen2={setIsOpen2}
            permission={permission}
            user={user}
            userStatus={false}
          />
        }
      />
      <ModalsPage
        reloadEmployeeData={reloadEmployeeData}
        reloadSignature={reloadSignature}
        initialEmployeeProfile={initialEmployeeProfile}
        initialEmployeeContactInfo={initialEmployeeContactInfo}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isOpen2={isOpen2}
        setIsOpen2={setIsOpen2}
        setUserStatus={setUserStatus}
        setImage={setImage}
        setSignatureBase64String={setSignatureBase64String}
        setFirstName={setFirstName}
        setLastName={setLastName}
        user={user}
        setPersonalSignature={setPersonalSignature}
        personalSignature={personalSignature}
        signatureBase64String={signatureBase64String}
        setEditedData={setEditedData}
        setEditedData1={setEditedData1}
        setIsProfilePic={setIsProfilePic}
        isProfilePic={isProfilePic}
        isPersonalProfile={isPersonalProfile}
        setIsPersonalProfile={setIsPersonalProfile}
      />
    </Holds>
  );
}

type EditEmployeeHeaderProps = {
  userId: string | undefined;
  user: string;
  image: string;
  setIsProfilePic: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPersonalProfile: React.Dispatch<React.SetStateAction<boolean>>;
  userStatus: boolean;
  firstName: string;
  lastName: string;
};
export function EditEmployeeHeader({
  userId,
  user,
  image,
  setIsProfilePic,
  setIsPersonalProfile,
  userStatus,
  firstName,
  lastName,
}: EditEmployeeHeaderProps) {
  const t = useTranslations("Admins");
  return (
    <Holds
      background={"white"}
      className="w-full h-full col-span-2 row-span-2 flex flex-row justify-between items-center"
    >
      <Grids cols={"5"} rows={"1"} className="w-full h-full">
        <Holds
          position="left"
          className="col-start-1 col-end-2 h-full cursor-pointer"
          title={t("ChangeProfilePicture")}
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
          />
        </Holds>
        <Holds className="col-start-2 col-end-5 ">
          {userId !== user ? (
            <Inputs
              type="text"
              value={`${firstName} ${lastName}`}
              readOnly={true}
              className="h-20 text-3xl font-bold px-5"
            />
          ) : (
            <Inputs
              type="text"
              value={`${t("YourProfile")}`}
              readOnly={true}
              className="h-20 text-3xl font-bold px-5"
            />
          )}
        </Holds>

        <Holds className="h-full p-3">
          <Texts
            position="right"
            size="p6"
            text={userStatus ? "green" : "red"}
            className="my-auto"
          >
            {userStatus ? null : `${t("Terminated")}`}
          </Texts>
        </Holds>
      </Grids>
    </Holds>
  );
}

export function EditEmployeeMainLeft({
  initialEmployeeProfile,
  setRenderedData,
  initialEmployeeContactInfo,
  editedData,
  editedData1,
  setEditedData,
  setEditedData1,
  formRef,
  user,
  setRenderedData1,
  userId,
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
  return (
    <EditEmployeeFormInfo
      initialEmployeeProfile={initialEmployeeProfile}
      setRenderedData={setRenderedData}
      initialEmployeeContactInfo={initialEmployeeContactInfo}
      editedData={editedData}
      editedData1={editedData1}
      setEditedData={setEditedData}
      setEditedData1={setEditedData1}
      formRef={formRef}
      user={user}
      setRenderedData1={setRenderedData1}
      userId={userId}
      permission={"USER"}
      signatureBase64String={signatureBase64String}
      setPersonalSignature={() => setPersonalSignature(true)}
    />
  );
}

export function EditEmployeeMainRight({
  initialEmployeeProfile,
  setRenderedData,
  initialEmployeeContactInfo,
  editedData,
  editedData1,
  setEditedData,
  setEditedData1,
  formRef,
  user,
  setRenderedData1,
  userId,
  signatureBase64String,
  setPersonalSignature,
  permission,
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
  permission: string | undefined;
}) {
  return (
    <Holds
      background={"white"}
      className="w-full h-full flex col-start-5 col-end-7 flex-row justify-between items-center overflow-y-scroll no-scrollbar"
    >
      <EditEmployeeForm
        initialEmployeeProfile={initialEmployeeProfile}
        setRenderedData={setRenderedData}
        initialEmployeeContactInfo={initialEmployeeContactInfo}
        editedData={editedData}
        editedData1={editedData1}
        setEditedData={setEditedData}
        setEditedData1={setEditedData1}
        formRef={formRef}
        user={user}
        setRenderedData1={setRenderedData1}
        userId={userId}
        permission={permission}
        signatureBase64String={signatureBase64String}
        setPersonalSignature={() => setPersonalSignature(true)}
      />
    </Holds>
  );
}

export function EditEmployeeFooter({
  userId,
  user,
  userStatus,
  permission,
  handleSubmitClick,
  setIsOpen,
  setIsOpen2,
}: {
  userId: string | undefined;
  user: string;
  userStatus: boolean;
  permission: string | undefined;
  handleSubmitClick: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen2: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const t = useTranslations("Admins");
  return (
    <Holds background={"white"} className="w-full h-full col-span-2 p-3 ">
      <Grids cols={"6"} rows={"2"} className="w-full h-full ">
        <Holds className="col-start-6 col-end-7 row-start-1 row-end-3 ">
          <Buttons
            background="green"
            className="py-2"
            type="button"
            onClick={handleSubmitClick}
          >
            <Titles size="h5">{t("SubmitEdit")}</Titles>
          </Buttons>
        </Holds>
        {userId !== user || permission === "SUPERADMIN" ? (
          <Holds className="row-start-1 row-end-3 col-start-1 col-end-2 ">
            {userStatus === true ? (
              <Buttons
                background="red"
                className="py-2"
                onClick={() => setIsOpen(true)}
              >
                <Titles size="h5">{t("TerminateEmployee")}</Titles>
              </Buttons>
            ) : (
              <Buttons
                background="lightBlue"
                className="py-2"
                onClick={() => setIsOpen2(true)}
              >
                <Titles size="h5">{t("ActivateEmployee")}</Titles>
              </Buttons>
            )}
          </Holds>
        ) : null}
      </Grids>
    </Holds>
  );
}
