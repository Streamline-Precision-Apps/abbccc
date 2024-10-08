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
import SignOutModal from "./signOutModal";
import { Modals } from "@/components/(reusable)/modals";
import { Images } from "@/components/(reusable)/images";
import { Contact, Employee, UserTraining } from "@/lib/types";
import { Buttons } from "@/components/(reusable)/buttons";
import { Trainings } from "@prisma/client";
import { Grids } from "@/components/(reusable)/grids";
import { Texts } from "@/components/(reusable)/texts";
import Spinner from "@/components/(animations)/spinner";

type Props = {
  contacts: Contact;
};

export default function EmployeeInfo() {
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<Employee>();
  const [contacts, setContacts] = useState<Contact>();
  const [training, setTraining] = useState<Trainings[]>([]); // Assuming `training` is an array
  const [userTrainings, setUserTrainings] = useState<UserTraining[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Make parallel requests if possible
        const [employeeRes, contactsRes, trainingRes, userTrainingsRes] =
          await Promise.all([
            fetch("/api/getEmployee"), // A separate endpoint for employee
            fetch("/api/getContacts"), // A separate endpoint for contacts
            fetch("/api/getTraining"), // A separate endpoint for training
            fetch("/api/getUserTrainings"), // A separate endpoint for user trainings
          ]);

        // Parse responses in parallel
        const [employee, contacts, training, userTrainings] = await Promise.all(
          [
            employeeRes.json(),
            contactsRes.json(),
            trainingRes.json(),
            userTrainingsRes.json(),
          ]
        );

        // Set the data in the state
        setEmployee(employee);
        setContacts(contacts);
        setTraining(training);
        setUserTrainings(userTrainings);

        if (
          employee?.error ||
          contacts?.error ||
          training?.error ||
          userTrainings?.error
        ) {
          console.log("An error occurred in one of the responses.");
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const t = useTranslations("Hamburger");
  const [base64String, setBase64String] = useState<string>("");

  // Logic to get number of completed trainings
  const total = Number(training);
  const completed = userTrainings.filter((ut) => ut.isCompleted).length;

  // Logic to get completion percentage
  const completionStatus = total > 0 ? completed / total : 0;
  const completionPercentage = (completionStatus * 100).toFixed(0);

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

  return (
    <>
      <Contents width={"section"}>
        <Grids rows={"10"} gap={"5"}>
          <Holds background={"white"} className="row-span-3 h-full">
            {/*This Title box allows the profile pic to default as a base profile picture*/}
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
              variant={"default"}
              size={"fullPage"}
              isOpen={isOpen}
            >
              <Base64Encoder
                employee={employee && employee}
                base64String={base64String}
                setBase64String={setBase64String}
                setIsOpen={setIsOpen}
              />
            </Modals>
          </Holds>
          <Holds background={"white"} className="row-span-7 h-full ">
            <Holds className="h-full">
              <Contents width={"section"}>
                <Labels size={"p4"}>
                  {t("PhoneNumber")}
                  <Inputs
                    disabled
                    type="tel"
                    defaultValue={contacts?.phoneNumber ?? ""}
                  />
                </Labels>

                <Labels size={"p4"}>
                  {t("PersonalEmail")}
                  <Inputs
                    disabled
                    type="email"
                    defaultValue={contacts?.email}
                  />
                </Labels>
                <Labels size={"p4"}>
                  {t("EmergencyContact")}
                  <Inputs
                    disabled
                    type="tel"
                    defaultValue={contacts?.emergencyContactNumber ?? ""}
                  />
                </Labels>

                <SignOutModal />
              </Contents>
            </Holds>
          </Holds>
        </Grids>
      </Contents>
    </>
  );
}
