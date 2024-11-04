"use client";

import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useTranslations } from "next-intl";
import Base64Encoder from "@/components/(camera)/Base64Encoder";
import { useEffect, useState } from "react";
import { Contents } from "@/components/(reusable)/contents";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { Modals } from "@/components/(reusable)/modals";
import { Images } from "@/components/(reusable)/images";
import { Contact, Employee } from "@/lib/types";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Texts } from "@/components/(reusable)/texts";
import Spinner from "@/components/(animations)/spinner";
import { z } from "zod"; // Import Zod for validation
import { uploadFirstSignature } from "@/actions/userActions";
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

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [editImg, setEditImg] = useState(false);
  const [editSignatureModalOpen, setEditSignatureModalOpen] = useState(false); // State for signature modal

  const t = useTranslations("Hamburger");
  const [base64String, setBase64String] = useState<string>("");
  const [signatureBase64String, setSignatureBase64String] =
    useState<string>("");

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
      setSignatureBase64String(validatedEmployee.signature ?? "");
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

  const reloadEmployeeData = () => {
    fetchEmployee(); // Directly fetch the updated employee data
    console.log("Employee data reloaded");
  };

  const handleSubmitImage = async () => {
    if (employee) {
      const formData = new FormData();
      formData.append("id", employee.id);
      if (typeof signatureBase64String === "object") {
        formData.append("signature", JSON.stringify(signatureBase64String));
      } else {
        formData.append("signature", signatureBase64String);
      }
      console.log(formData);

      setLoading(true);
      try {
        const response = await uploadFirstSignature(formData); // This assumes you have an uploadFirstSignature function elsewhere
        console.log(response);
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
  const handleProfilePic = () => {
    setIsOpen(true);
  };

  return (
    <Holds className="h-full w-full my-1 ">
      <Contents width={"section"}>
        <Grids className="grid-rows-4 gap-5 ">
          <Holds background={"white"} className=" row-span-1 h-full relative">
            <Images
              titleImg="/edit-form.svg"
              titleImgAlt="settings"
              className="absolute top-3 right-1 cursor-pointer"
              size={"10"}
              onClick={() => editView(1)}
            />
            <Contents width={"section"}>
              <Holds className="col-span-2 row-span-2">
                <Holds className="rounded-full relative ">
                  <Images
                    titleImg={employee?.image ?? "/profile.svg"}
                    titleImgAlt={"profile"}
                    className="rounded-full border-[3px] border-black"
                    size={"40"}
                  />
                  <Holds className="absolute rounded-full h-10 w-10 md:h-10 md:w-10 left-[60%] top-[85%] transform -translate-x-1/2 -translate-y-1/2  px-1   border-[3px] border-black bg-white">
                    <Images
                      titleImg="/camera.svg"
                      titleImgAlt="camera"
                      size={"full"}
                      className="my-auto"
                    />
                  </Holds>
                </Holds>
              </Holds>
            </Contents>
          </Holds>
          <Holds background={"white"} className=" row-span-2 h-full ">
            <Holds position={"row"} className=" h-full w-full">
              <Holds>
                <Texts position={"left"} size={"p5"}>
                  {t("PhoneNumber")}
                </Texts>
              </Holds>

              <Holds>
                <Texts size={"p5"} position={"right"}>
                  {contacts?.phoneNumber ?? ""}
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

            <Holds position={"row"} className="h-full w-full">
              <Holds>
                <Texts position={"left"} size={"p5"}>
                  {t("EmergencyContact")}
                </Texts>
              </Holds>

              <Holds>
                <Texts size={"p5"} position={"right"}>
                  {contacts?.emergencyContactNumber ?? ""}
                </Texts>
              </Holds>
            </Holds>

            <Holds className="  ">
              <Holds className="h-full my-auto">
                <Holds className="w-full rounded-3xl border-[3px] border-black ">
                  <Images
                    titleImg={signatureBase64String}
                    titleImgAlt={t("Signature")}
                    size={"40"}
                    className="p-1"
                  />
                </Holds>
              </Holds>
            </Holds>
          </Holds>

          <Holds className="row-span-1 h-full ">
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
  );
};
