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
import { Signature } from "@/app/(routes)/dashboard/clock-out/(components)/injury-verification/Signature";
import { updateContactInfo, uploadFirstSignature } from "@/actions/userActions";
import { Titles } from "@/components/(reusable)/titles";
import { Forms } from "@/components/(reusable)/forms";

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

export const AdminEditContact = ({
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
      <Holds className="h-full w-full relative ">
        <Holds background={"orange"} className="h-[9%] w-full  ">
          <Texts>Edit Mode</Texts>
        </Holds>
        <Holds className="w-[3%] h-[6%] p-1 rounded-full absolute top-1 right-1 cursor-pointer ">
          <Images
            titleImg="/turnBack.svg"
            titleImgAlt="settings"
            className="h-10 w-10 my-auto"
            width={"10"}
            onClick={() => editView(0)}
          />
        </Holds>
        <Holds position={"row"} className="my-5 gap-5 h-full">
          <Holds background={"white"} className="w-1/2 h-full ">
            <Holds className="my-auto">
              <Spinner />
            </Holds>
          </Holds>
          <Holds background={"white"} className="w-1/2 h-full ">
            <Holds className="my-auto">
              <Spinner />
            </Holds>
          </Holds>
        </Holds>
      </Holds>
    );
  }
  const handleContacts = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);

      const response = await updateContactInfo(formData);
      if (response) {
        // on a successful update we return to previous view
        editView(0);
      }
    } catch {
      console.error("Error updating contact info");
    }
  };
  const handleProfilePic = () => {
    setIsOpen(true);
  };

  return (
    <Holds className="h-full w-full relative ">
      <Holds background={"orange"} className="h-[9%] w-full rounded-b-none ">
        <Texts>Edit Mode</Texts>
      </Holds>
      <Holds className="w-[3%] h-[6%] p-1 rounded-full absolute top-1 right-1 cursor-pointer ">
        <Images
          titleImg="/turnBack.svg"
          titleImgAlt="settings"
          className="h-10 w-10 my-auto"
          width={"10"}
          onClick={() => editView(0)}
        />
      </Holds>
      <Holds className="flex flex-row gap-5 h-[90%] ">
        {/* Save button to confirm changes */}
        <Holds background={"white"} className="h-full mt-5 gap-5 ">
          <Holds className="w-full h-1/2 my-5 ">
            <Holds className="relative ">
              <Images
                titleImg={employee?.image ?? "/profile.svg"}
                titleImgAlt={"profile"}
                className="rounded-full border-[3px] border-black cursor-pointer"
                size={"50"}
                onClick={() => {
                  handleProfilePic();
                }}
              />
              <Holds
                className="cursor-pointer absolute rounded-full h-24 w-24 left-[65%] top-[85%] transform -translate-x-1/2 -translate-y-1/2  border-[3px] border-black bg-white"
                onClick={() => {
                  handleProfilePic();
                }}
              >
                <Images
                  titleImg="/camera.svg"
                  titleImgAlt="camera"
                  size={"full"}
                  className="my-auto"
                />
              </Holds>
            </Holds>
          </Holds>

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

          <Holds className=" h-1/2">
            <Holds className="h-full my-5 w-11/12">
              <Titles>{t("SignatureTitle")}</Titles>
              <Texts position={"left"} text={"black"} size={"p6"}>
                {t("Signature")}
              </Texts>
              <Holds
                className="w-full rounded-3xl border-[3px] border-black cursor-pointer"
                onClick={() => setEditSignatureModalOpen(true)}
              >
                <Images
                  titleImg={signatureBase64String}
                  titleImgAlt={t("Signature")}
                  size={"40"}
                  className="p-1"
                />
              </Holds>
            </Holds>
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
                }}
              />
            </Modals>
          </Holds>
        </Holds>
        {/* Contact details to be updated / edited easily */}

        <Forms
          onSubmit={handleContacts}
          background={"white"}
          className="h-full mt-5"
        >
          <Inputs type="hidden" name="id" defaultValue={employee?.id} />
          <Holds className="h-full my-5">
            <Titles size={"h2"}>{t("ContactDetails")}</Titles>
            <Contents width={"section"} className="h-full my-16">
              <Holds className="h-full">
                <Holds className=" mt-5">
                  <Holds position={"row"} className="w-full">
                    <Holds className="w-full">
                      <Texts position={"left"} size={"p6"}>
                        {t("PhoneNumber")}
                      </Texts>
                    </Holds>
                    <Holds className="w-full">
                      <Texts position={"right"} size={"p6"}>
                        {" "}
                        Ex: (555-555-5555)
                      </Texts>
                    </Holds>
                  </Holds>
                  <Inputs
                    type="tel"
                    name="phoneNumber"
                    defaultValue={contacts?.phoneNumber ?? ""}
                    placeholder="555-555-5555"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  />
                </Holds>
                <Holds className="mt-5">
                  <Holds position={"row"} className="w-full">
                    <Holds className="w-full">{t("PersonalEmail")}</Holds>
                    <Holds className="w-full">
                      <Texts position={"right"} size={"p6"}>
                        {" "}
                        Ex: email@email.com
                      </Texts>
                    </Holds>
                  </Holds>
                  <Inputs
                    type="email"
                    name="email"
                    defaultValue={contacts?.email}
                    placeholder="email@email.com"
                  />
                </Holds>
                <Holds className=" row-span-1 ">
                  <Labels size={"p4"}>
                    {t("EmergencyContactName")}
                    <Inputs
                      type="text"
                      name="emergencyContact"
                      defaultValue={contacts?.emergencyContact ?? ""}
                    />
                  </Labels>
                </Holds>
                <Holds className=" row-span-1 mt-5 ">
                  <Holds position={"row"} className="w-full">
                    <Holds className="w-full">
                      <Texts position={"left"} size={"p6"}>
                        {t("EmergencyContact")}
                      </Texts>
                    </Holds>
                    <Holds className="w-full">
                      <Texts position={"right"} size={"p6"}>
                        {" "}
                        Ex: (555-555-5555)
                      </Texts>
                    </Holds>
                  </Holds>

                  <Inputs
                    type="tel"
                    name="emergencyContactNumber"
                    defaultValue={contacts?.emergencyContactNumber ?? ""}
                    placeholder="555-555-5555"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  />
                </Holds>
              </Holds>
              <Holds className="justify-end">
                <Buttons background={"green"} className="py-3">
                  <Texts>{t("Save")}</Texts>
                </Buttons>
              </Holds>
            </Contents>
          </Holds>
        </Forms>
      </Holds>
    </Holds>
  );
};
