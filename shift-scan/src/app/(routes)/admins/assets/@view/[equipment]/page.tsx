"use client";

import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import EmptyView from "../../../_pages/EmptyView";
import Spinner from "@/components/(animations)/spinner";
import { EditEmployeeForm } from "./_components/edit-employee-form";
import { EmployeeContactInfo, UserProfile } from "@/lib/types";
import { ModalsPage } from "./_components/modal";

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

  const reloadEmployeeData = async () => {
    try {
      const response = await fetch(`/api/employeeInfo/${params.employee}`);
      const data = await response.json();
      setImage(data.image);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      // other data updates if needed
    } catch (error) {
      console.error("Failed to fetch employee info:", error);
    }
  };

  const reloadSignature = async () => {
    const loadSignature = async () => {
      try {
        const response = await fetch(`/api/employeeInfo/${params.employee}`);
        const data = await response.json();
        setSignatureBase64String(data.signature);
      } catch (error) {
        console.error("Failed to fetch employee info:", error);
      }
    };
    setTimeout(() => loadSignature(), 1000);
  };

  if (!initialEmployeeProfile || !initialEmployeeContactInfo) {
    return <EmptyView Children={<Spinner size={350} />} />;
  }

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
          user={user}
          setRenderedData1={setRenderedData1}
          userId={userId}
          permission={"USER"}
          signatureBase64String={signatureBase64String}
          setPersonalSignature={() => setPersonalSignature(true)}
        />
        {/* --------------------------------------------------------------------------------------------------------------------*/}
        {/* ---------------------------------------------  Modals Section  -----------------------------------------------------*/}
        {/* --------------------------------------------------------------------------------------------------------------------*/}
        <ModalsPage
          reloadEmployeeData={reloadEmployeeData}
          reloadSignature={reloadSignature}
          initialEmployeeProfile={initialEmployeeProfile}
          initialEmployeeContactInfo={initialEmployeeContactInfo}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isOpen2={isOpen2}
          setIsOpen2={setIsOpen}
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
      </Grids>
    </Holds>
  );
}
