"use client";

import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useTranslations } from "next-intl";
import Base64Encoder from "@/components/(camera)/Base64Encoder";
import { useEffect, useState } from "react";
import { Contents } from "@/components/(reusable)/contents";
import { Labels } from "@/components/(reusable)/labels";
import { Modals } from "@/components/(reusable)/modals";
import { Images } from "@/components/(reusable)/images";
import { Employee } from "@/lib/types";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Texts } from "@/components/(reusable)/texts";
import Spinner from "@/components/(animations)/spinner";
import { z } from "zod";
import Signature from "@/app/(routes)/dashboard/clock-out/(components)/injury-verification/Signature";
import { Titles } from "@/components/(reusable)/titles";
import { uploadSignature } from "@/actions/userActions";
import { EditableFields } from "@/components/(reusable)/EditableField";
import { updateUserProfile } from "@/actions/userActions";

const contactSchema = z.object({
  phoneNumber: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
});

const employeeSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().optional(),
  image: z.string().nullable().optional(),
  signature: z.string().nullable().optional(),
});

export default function EmployeeInfo() {
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<Employee>();
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    emergencyContact: "",
    emergencyContactNumber: "",
  });
  const [originalState, setOriginalState] = useState(formState);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [editImg, setEditImg] = useState(false);
  const [editSignatureModalOpen, setEditSignatureModalOpen] = useState(false);

  const t = useTranslations("Hamburger");
  const [base64String, setBase64String] = useState<string>("");
  const [signatureBase64String, setSignatureBase64String] =
    useState<string>("");

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const employeeRes = await fetch("/api/getEmployee");
      const employeeData = await employeeRes.json();
      const contactData = employeeData.contact;

      const validatedEmployee = employeeSchema.parse(employeeData);
      const validatedContact = contactSchema.parse(contactData);
      setEmployee(validatedEmployee as Employee);
      setFormState({
        firstName: validatedEmployee.firstName,
        lastName: validatedEmployee.lastName,
        email: validatedEmployee.email ?? "",
        phoneNumber: validatedContact.phoneNumber ?? "",
        emergencyContact: validatedContact.emergencyContact ?? "",
        emergencyContactNumber: validatedContact.emergencyContactNumber ?? "",
      });
      setSignatureBase64String(validatedEmployee.signature ?? "");
      setOriginalState({
        firstName: validatedEmployee.firstName,
        lastName: validatedEmployee.lastName,
        email: validatedEmployee.email ?? "",
        phoneNumber: validatedContact.phoneNumber ?? "",
        emergencyContact: validatedContact.emergencyContact ?? "",
        emergencyContactNumber: validatedContact.emergencyContactNumber ?? "",
      });
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const hasChanged = (field: keyof typeof originalState) =>
    formState[field] !== originalState[field];

  const handleFieldChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("id", employee?.id ?? "");
    formData.append("email", formState.email);
    formData.append("phoneNumber", formState.phoneNumber);
    formData.append("emergencyContact", formState.emergencyContact);
    formData.append("emergencyContactNumber", formState.emergencyContactNumber);

    try {
      await updateUserProfile(formData);
      setOriginalState(formState);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSignatureClose = () => {
    uploadSignature(employee?.id ?? "", signatureBase64String);
    setEditSignatureModalOpen(false);
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
            <Texts> {t("Loading")} </Texts>
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
                <Holds
                  size={"full"}
                  background={"white"}
                  className="my-5"
                  row-span-7
                >
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
                    <Texts>{t("ChangeProfilePicture")}</Texts>
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
                    reloadEmployeeData={fetchEmployee}
                  />
                </Holds>
              )}
            </Modals>
          </Holds>
          <Holds background={"white"} className="row-span-7 h-full">
            <Holds className="h-full">
              <Contents width={"section"}>
                <Grids rows={"7"} gap={"5"}>
                  <Holds className="h-full w-full">
                    <Labels size={"p6"}>
                      {t("PhoneNumber")} <span className="text-red-500">*</span>
                    </Labels>
                    <EditableFields
                      value={formState.phoneNumber}
                      isChanged={hasChanged("phoneNumber")}
                      onChange={(e) =>
                        handleFieldChange("phoneNumber", e.target.value)
                      }
                      onRevert={() =>
                        handleFieldChange(
                          "phoneNumber",
                          originalState.phoneNumber
                        )
                      }
                      variant="default"
                      size="default"
                    />
                  </Holds>
                  <Holds className="h-full w-full">
                    <Labels size={"p6"}>
                      {t("Email")} <span className="text-red-500">*</span>
                    </Labels>
                    <EditableFields
                      value={formState.email}
                      isChanged={hasChanged("email")}
                      onChange={(e) =>
                        handleFieldChange("email", e.target.value)
                      }
                      onRevert={() =>
                        handleFieldChange("email", originalState.email)
                      }
                      variant="default"
                      size="default"
                    />
                  </Holds>
                  <Holds className="h-full w-full">
                    <Labels size={"p6"}>
                      {t("EmergencyContactName")}{" "}
                      <span className="text-red-500">*</span>
                    </Labels>
                    <EditableFields
                      value={formState.emergencyContact}
                      isChanged={hasChanged("emergencyContact")}
                      onChange={(e) =>
                        handleFieldChange("emergencyContact", e.target.value)
                      }
                      onRevert={() =>
                        handleFieldChange(
                          "emergencyContact",
                          originalState.emergencyContact
                        )
                      }
                      variant="default"
                      size="default"
                    />
                  </Holds>
                  <Holds className="h-full w-full">
                    <Labels size={"p6"}>
                      {t("EmergencyContact")}{" "}
                      <span className="text-red-500">*</span>
                    </Labels>
                    <EditableFields
                      value={formState.emergencyContactNumber}
                      isChanged={hasChanged("emergencyContactNumber")}
                      onChange={(e) =>
                        handleFieldChange(
                          "emergencyContactNumber",
                          e.target.value
                        )
                      }
                      onRevert={() =>
                        handleFieldChange(
                          "emergencyContactNumber",
                          originalState.emergencyContactNumber
                        )
                      }
                      variant="default"
                      size="default"
                    />
                  </Holds>
                  <Holds className=" row-span-2 h-full  ">
                    <Holds className="h-full my-auto">
                      <Labels size={"p4"}>{t("Signature")}</Labels>
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
                      handleClose={() => handleSignatureClose()}
                      type="signature"
                      size="fullPage"
                      isOpen={editSignatureModalOpen}
                    >
                      <Signature setBase64String={setSignatureBase64String} />
                    </Modals>
                  </Holds>
                  <Holds className="row-span-2 h-full ">
                    <Holds className="my-auto">
                      {Object.keys(formState).every(
                        (key) => !hasChanged(key as keyof typeof formState)
                      ) ? (
                        // Button for when no changes have been made
                        <Buttons
                          onClick={() => setIsOpen2(true)} // Mimics the Sign Out button functionality
                          background={"red"}
                          size={"full"}
                          className="p-3 "
                        >
                          <Titles size={"h4"}>{t("SignOut")}</Titles>
                        </Buttons>
                      ) : (
                        // Submit Changes button
                        <Buttons
                          onClick={handleSubmit}
                          background={"green"}
                          size={"full"}
                          className="p-3 "
                        >
                          <Titles size={"h4"}>{t("SubmitChanges")}</Titles>
                        </Buttons>
                      )}
                    </Holds>

                    {/* Modal for Sign Out confirmation */}
                    <Modals
                      handleClose={() => setIsOpen2(false)}
                      isOpen={isOpen2}
                      type="signOut"
                      size="sm"
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
