"use client";

import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useTranslations } from "next-intl";
import Base64Encoder from "@/components/(camera)/Base64Encoder";
import { useEffect, useState } from "react";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { Modals } from "@/components/(reusable)/modals";
import { Images } from "@/components/(reusable)/images";
import { Contact, Employee, UserTraining } from "@/lib/types";
import { Buttons } from "@/components/(reusable)/buttons";
import { Trainings } from "@prisma/client";
import { Grids } from "@/components/(reusable)/grids";
import { Texts } from "@/components/(reusable)/texts";
import Spinner from "@/components/(animations)/spinner";
import { set } from "zod";
import useFetchAllData from "@/app/(content)/FetchData";
import { Signature } from "@/app/(routes)/dashboard/clock-out/(components)/injury-verification/Signature";
import { uploadFirstSignature } from "@/actions/userActions";
import { Titles } from "@/components/(reusable)/titles";

type Props = {
  contacts: Contact;
};

export default function EmployeeInfo() {
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<Employee>();
  const [contacts, setContacts] = useState<Contact>();
  const [training, setTraining] = useState<Trainings[]>([]);
  const [userTrainings, setUserTrainings] = useState<UserTraining[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [editImg, setEditImg] = useState(false);
  const [editSignatureModalOpen, setEditSignatureModalOpen] = useState(false); // State for signature modal

  const t = useTranslations("Hamburger");
  const [base64String, setBase64String] = useState<string>("");
  const [signatureBase64String, setSignatureBase64String] =
    useState<string>("");

  // Logic to get number of completed trainings
  const total = Number(training);
  const completed = userTrainings.filter((ut) => ut.isCompleted).length;

  // Logic to get completion percentage
  const completionStatus = total > 0 ? completed / total : 0;
  const completionPercentage = (completionStatus * 100).toFixed(0);

  //----------------------------Data Fetching-------------------------------------
  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const employeeRes = await fetch("/api/getEmployee");
      const employeeData = await employeeRes.json();
      setEmployee(employeeData);
      setSignatureBase64String(employeeData.signature);
      console.log(signatureBase64String);
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const [contactsRes, trainingRes, userTrainingsRes] = await Promise.all([
        fetch("/api/getContacts"),
        fetch("/api/getTraining"),
        fetch("/api/getUserTrainings"),
      ]);

      const [contactsData, trainingData, userTrainingsData] = await Promise.all(
        [contactsRes.json(), trainingRes.json(), userTrainingsRes.json()]
      );

      setContacts(contactsData);
      setTraining(trainingData);
      setUserTrainings(userTrainingsData);

      if (
        contactsData?.error ||
        trainingData?.error ||
        userTrainingsData?.error
      ) {
        console.log("An error occurred in one of the responses.");
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchProfile(), fetchEmployee()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const reloadEmployeeData = () => {
    const data = fetchEmployee(); // Directly fetch the updated employee data

    console.log("Employee data reloaded");
  };

  const handleSubmitImage = async () => {
    if (employee) {
      const formData = new FormData();
      formData.append("id", employee.id);
      formData.append("signature", signatureBase64String);

      setLoading(true);
      try {
        await uploadFirstSignature(formData); // This assumes you have an uploadFirstSignature function elsewhere
      } catch (error) {
        console.error("Error uploading signature:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Employee is not defined");
    }
  };

  if (loading) {
    return (
      <Grids className="grid-rows-7 gap-5 ">
        <Holds
          size={"full"}
          background={"white"}
          className="row-span-2 h-full "
        ></Holds>
        <Holds
          size={"full"}
          background={"white"}
          className="row-span-5 h-full "
        >
          <Contents width={"section"}>
            <Texts> Loading </Texts>
            <Spinner />
          </Contents>
        </Holds>
      </Grids>
    );
  }
  const signoutHandler = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Contents width={"section"}>
        <Grids rows={"10"} gap={"5"}>
          <Holds background={"white"} className="row-span-2 h-full">
            <Contents width={"section"}>
              <TitleBoxes
                type="profilePic"
                title={`${employee?.firstName} ${employee?.lastName} `}
                title2={`#ID: ${employee?.id}`}
                titleImg={
                  employee?.image !== null
                    ? `${employee?.image}`
                    : "/profile.svg"
                }
                titleImgAlt={"image"}
                modalTitle={setIsOpen}
                modal={true}
                className="h-full relative"
              />
            </Contents>

            <Modals
              handleClose={() => {
                setIsOpen(false);
                setBase64String("");
              }}
              type="base64"
              size={"fullPage"}
              isOpen={isOpen}
            >
              {!editImg && (
                <Holds size={"full"} background={"white"} className="my-5">
                  <Holds size={"50"} className="rounded-full">
                    <img
                      src={employee?.image ?? ""}
                      alt={"image"}
                      className="rounded-full"
                    />
                  </Holds>
                  <Buttons
                    size={"50"}
                    className="my-5"
                    onClick={() => setEditImg(true)}
                  >
                    <Texts>Change Profile Picture</Texts>
                  </Buttons>
                </Holds>
              )}
              {editImg && (
                <Holds size={"full"} background={"white"} className="my-5">
                  <Base64Encoder
                    employee={employee && employee}
                    base64String={base64String}
                    setBase64String={setBase64String}
                    setIsOpen={setIsOpen}
                    reloadEmployeeData={reloadEmployeeData}
                  />
                </Holds>
              )}
            </Modals>
          </Holds>
          <Holds background={"white"} className="row-span-8 h-full">
            <Holds className="h-full">
              <Contents width={"section"}>
                <Grids rows={"7"}>
                  <Holds className=" row-span-1 h-full">
                    <Labels size={"p4"}>
                      {t("PhoneNumber")}
                      <Inputs
                        disabled
                        type="tel"
                        defaultValue={contacts?.phoneNumber ?? ""}
                      />
                    </Labels>
                  </Holds>
                  <Holds className=" row-span-1 h-full">
                    <Labels size={"p4"}>
                      {t("PersonalEmail")}
                      <Inputs
                        disabled
                        type="email"
                        defaultValue={contacts?.email}
                      />
                    </Labels>
                  </Holds>
                  <Holds className=" row-span-1 h-full">
                    <Labels size={"p4"}>
                      {t("EmergencyContact")}
                      <Inputs
                        disabled
                        type="tel"
                        defaultValue={contacts?.emergencyContactNumber ?? ""}
                      />
                    </Labels>
                  </Holds>
                  <Holds className=" row-span-2 h-full ">
                    <Holds className="h-full">
                      <Labels size={"p4"}>
                        {t("Signature")}
                        <Holds
                          className="w-full rounded-3xl border-[3px] border-black cursor-pointer"
                          onClick={() => setEditSignatureModalOpen(true)}
                          size={"20"}
                        >
                          <Images
                            titleImg={signatureBase64String}
                            titleImgAlt={t("Signature")}
                            className="mx-auto p-5 "
                          />
                        </Holds>
                      </Labels>
                    </Holds>
                    {/* Modal for editing signature */}
                    <Modals
                      handleClose={() => setEditSignatureModalOpen(false)}
                      type="signature"
                      size={"fullPage"}
                      isOpen={editSignatureModalOpen}
                    >
                      <Signature
                        setBase64String={setSignatureBase64String}
                        base64string={signatureBase64String}
                        handleSubmitImage={() => {
                          handleSubmitImage();
                          setEditSignatureModalOpen(false); // Close the modal after saving
                        }}
                      />
                    </Modals>
                  </Holds>
                  <Holds className="row-span-2 h-full my-auto">
                    <Holds className="my-auto">
                      <Buttons
                        onClick={() => setIsOpen2(true)}
                        background={"red"}
                        size={"full"}
                        className="p-3 "
                      >
                        <Titles size={"h4"}>{t("SignOut")}</Titles>
                      </Buttons>
                    </Holds>

                    <Modals
                      handleClose={signoutHandler}
                      isOpen={isOpen2}
                      type="signOut"
                      size={"sm"}
                    >
                      {t("SignOutConfirmation")}
                    </Modals>
                  </Holds>
                </Grids>
              </Contents>
            </Holds>
          </Holds>
        </Grids>
      </Contents>
    </>
  );
}
