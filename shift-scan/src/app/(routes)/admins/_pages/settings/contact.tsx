"use client";

import { Holds } from "@/components/(reusable)/holds";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Contents } from "@/components/(reusable)/contents";
import { Modals } from "@/components/(reusable)/modals";
import { Images } from "@/components/(reusable)/images";
import { Contact, Employee } from "@/lib/types";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Texts } from "@/components/(reusable)/texts";
import Spinner from "@/components/(animations)/spinner";
import { z } from "zod"; // Import Zod for validation
import { Titles } from "@/components/(reusable)/titles";

// Define Zod schemas for validation
const contactSchema = z.object({
  phoneNumber: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
  email: z.string().optional(),
});

const employeeSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  image: z.string().nullable().optional(),
  signature: z.string().nullable().optional(),
});

export const AdminContact = ({
  editView,
}: {
  editView: (view: number) => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<Employee>();
  const [contacts, setContacts] = useState<
    Contact | Partial<Contact> | undefined
  >();

  const [isOpen2, setIsOpen2] = useState(false);

  const t = useTranslations("Hamburger");

  //----------------------------Data Fetching-------------------------------------
  // Fetch Employee Data
  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const employeeRes = await fetch("/api/getEmployee");
      const employeeData = await employeeRes.json();

      // Validate data using Zod
      const validatedEmployee = employeeSchema.parse(employeeData);
      setEmployee(validatedEmployee as Employee);
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Profile Data
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const [contactsRes] = await Promise.all([fetch("/api/getContacts")]);

      const [contactsData] = await Promise.all([contactsRes.json()]);

      // Validate data using Zod
      const validatedContacts = contactSchema.parse(contactsData);

      setContacts(validatedContacts);
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
    setIsOpen2(false);
  };

  return (
    <Holds className="h-full w-full ">
      <Contents width={"section"}>
        <Grids className="grid-rows-5 ">
          <Holds background={"white"} className=" row-span-2 h-full relative">
            <Images
              titleImg="/edit-form.svg"
              titleImgAlt="settings"
              className="absolute top-3 right-1 cursor-pointer"
              size={"10"}
              onClick={() => editView(1)}
            />

            <Holds className="rounded-full h-full p-1">
              <Images
                titleImg={employee?.image ?? "/profile.svg"}
                titleImgAlt={"profile"}
                className="rounded-full my-auto border-[3px] border-black"
                size={"50"}
              />
            </Holds>
          </Holds>
          <Holds background={"white"} className=" row-span-2 h-full ">
            <Holds position={"row"} className=" h-full w-full">
              <Holds>
                <Texts position={"left"} size={"p5"}>
                  {t("EmployeeID")}
                </Texts>
              </Holds>

              <Holds>
                <Texts size={"p5"} position={"right"}>
                  {employee?.id ?? ""}
                </Texts>
              </Holds>
            </Holds>
            <Holds position={"row"} className="h-full w-full">
              <Holds>
                <Texts position={"left"} size={"p5"}>
                  {t("PhoneNumber")}
                </Texts>
              </Holds>

              <Holds>
                <Texts size={"p5"} position={"right"}>
                  {`(${contacts?.phoneNumber?.slice(
                    0,
                    3
                  )})  ${contacts?.phoneNumber?.slice(
                    4,
                    7
                  )}-${contacts?.phoneNumber?.slice(8, 12)}`}
                </Texts>
              </Holds>
            </Holds>

            <Holds position={"row"} className="h-full w-full">
              <Holds>
                <Texts position={"left"} size={"p5"}>
                  {t("PersonalEmail")}
                </Texts>
              </Holds>

              <Holds>
                <Texts size={"p5"} position={"right"}>
                  {contacts?.email}
                </Texts>
              </Holds>
            </Holds>
          </Holds>

          <Holds className="row-span-1 h-full ">
            <Holds className="my-auto">
              <Buttons
                onClick={() => setIsOpen2(true)}
                background={"red"}
                size={"80"}
              >
                <Titles size={"h4"}>{t("Logout")}</Titles>
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
  );
};
