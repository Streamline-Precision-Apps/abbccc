"use client";

import { Holds } from "@/components/(reusable)/holds";
import { ReusableViewLayout } from "./_components/reusableViewLayout";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import EmptyView from "../../../_pages/EmptyView";
import Spinner from "@/components/(animations)/spinner";
import { EmployeeContactInfo, UserProfile } from "@/lib/types";
import { ModalsPage } from "./_components/modal";
import { useTranslations } from "next-intl";
import { EditEmployeeFooter } from "./_components/EditEmployeeFooter";
import { EditEmployeeHeader } from "./_components/EditEmployeeHeader";
import { EditEmployeeMainLeft } from "./_components/EditEmployeeMainLeft";
import { EditEmployeeMainRight } from "./_components/EditEmployeeMainRight";
import { useNotification } from "@/app/context/NotificationContext";
import { editPersonnelInfo } from "@/actions/adminActions";

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
  const formRef2 = useRef<HTMLFormElement>(null);
  const [editedData, setEditedData] = useState<UserProfile | null>(null);
  const [editedData1, setEditedData1] = useState<EmployeeContactInfo | null>(
    null
  );
  const { setNotification } = useNotification();
  // modal
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isProfilePic, setIsProfilePic] = useState(false); // profile modal
  const [isPersonalProfile, setIsPersonalProfile] = useState(false); // profile modal

  const [personalSignature, setPersonalSignature] = useState(false);
  const [signatureBase64String, setSignatureBase64String] =
    useState<string>("");

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

  const handleSubmitClick = async () => {
    try {
      const formData1 = new FormData(formRef.current!);
      const formData2 = new FormData(formRef2.current!);

      // Combine both FormData objects
      for (const [key, value] of formData2.entries()) {
        formData1.append(key, value.toString());
      }

      console.log("Combined FormData:", Array.from(formData1.entries()));

      // Submit the combined FormData
      const res = await editPersonnelInfo(formData1);

      if (res) {
        setNotification(`${t("EmployeeInfoUpdatedSuccessfully")}`, "success");
      } else {
        setNotification(`${t("FailedToUpdateEmployeeInfo")}`, "error");
      }
    } catch (error) {
      console.error(`${t("FailedToUpdateEmployeeInfo")}`, error);
      setNotification(`${t("FailedToUpdateEmployeeInfo")}`, "error");
    }
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
            formRef={formRef2}
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
            userStatus={userStatus}
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
