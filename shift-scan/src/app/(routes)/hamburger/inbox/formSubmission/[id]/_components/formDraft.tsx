"use client";
import { useEffect, useState } from "react";
import { FormInput } from "./formInput";
import { FormFieldRenderer } from "@/app/(routes)/hamburger/inbox/_components/FormFieldRenderer";
import { FormEvent } from "react";
import { deleteFormSubmission, saveDraft } from "@/actions/hamburgerActions";
import { debounce } from "lodash";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useAutoSave } from "@/hooks/(inbox)/useAutoSave";
import Signature from "@/components/(reusable)/signature";
import { Titles } from "@/components/(reusable)/titles";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface FormField {
  id: string;
  label: string;
  name: string;
  type: string;
  required: boolean;
  order: number;
  defaultValue?: string;
  placeholder?: string;
  maxLength?: number;
  helperText?: string;
  options?: string[];
}

interface FormGrouping {
  id: string;
  title: string;
  order: number;
  fields: FormField[];
}

interface FormTemplate {
  id: string;
  name: string;
  formType: string;
  isActive: boolean;
  isSignatureRequired: boolean;
  groupings: FormGrouping[];
}

export default function FormDraft({
  formData,
  handleSubmit,
  formTitle,
  setFormTitle,
  formValues,
  updateFormValues,
  userId,
  submissionId,
}: {
  formData: FormTemplate;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  formValues: Record<string, string>;
  formTitle: string;
  setFormTitle: (title: string) => void;
  updateFormValues: (values: Record<string, string>) => void;
  userId: string;
  submissionId: string;
}) {
  type FormValues = Record<string, string>;
  const t = useTranslations("Hamburger-Inbox");
  const [signature, setSignature] = useState<string | null>(null);
  const [showSignature, setShowSignature] = useState(false);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSignature = async () => {
      try {
        const response = await fetch("/api/getUserSignature");
        const data = await response.json();
        setSignature(data.signature);
      } catch (error) {
        console.error("Error fetching signature:", error);
      }
    };
    fetchSignature();
  }, [Signature]);

  const saveDraftData = async (values: FormValues, title: string) => {
    if ((Object.keys(values).length > 0 || title) && formData) {
      try {
        // Include the title in the values object
        const dataToSave = { ...values };
        await saveDraft(
          dataToSave,
          formData.id,
          userId,
          formData.formType,
          submissionId,
          title
        );
      } catch (error) {
        console.error("Error saving draft:", error);
      }
    }
  };

  // Use the auto-save hook with the FormValues type
  const { autoSave, cancel } = useAutoSave<{
    values: FormValues;
    title: string;
  }>((data) => saveDraftData(data.values, data.title), 2000);

  // Trigger auto-save when formValues or formTitle changes
  useEffect(() => {
    if (isSubmitting) return;
    autoSave({ values: formValues, title: formTitle });
  }, [formValues, formTitle, autoSave]);

  //validation map function to required all fields that are required within form template
  const validateForm = (
    formValues: Record<string, string>,
    formData: FormTemplate
  ): boolean => {
    for (const group of formData.groupings) {
      for (const field of group.fields) {
        if (field.required) {
          // Check both field ID and field label as keys
          const fieldValue = formValues[field.id] || formValues[field.label];
          if (!fieldValue || fieldValue.trim() === "") {
            console.log(
              `Validation failed for field: ${field.label} (${field.id})`
            );
            return false;
          }

          // For JSON fields, check if they contain meaningful data
          if (
            field.type === "SEARCH_PERSON" ||
            field.type === "SEARCH_ASSET" ||
            field.type === "MULTISELECT"
          ) {
            try {
              const parsed = JSON.parse(fieldValue);
              if (Array.isArray(parsed) && parsed.length === 0) {
                console.log(
                  `Validation failed for empty array field: ${field.label} (${field.id})`
                );
                return false;
              }
              if (parsed === null || parsed === undefined) {
                console.log(
                  `Validation failed for null/undefined field: ${field.label} (${field.id})`
                );
                return false;
              }
            } catch (e) {
              // If it's not valid JSON, treat as string validation
              if (!fieldValue || fieldValue.trim() === "") {
                console.log(
                  `Validation failed for non-JSON field: ${field.label} (${field.id})`
                );
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  };

  const handleDeleteForm = async (id: string) => {
    try {
      await deleteFormSubmission(id);
      router.back();
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  return (
    <>
      <Holds
        background={"white"}
        className="row-start-1 row-end-2 h-full justify-center"
      >
        <TitleBoxes onClick={() => router.push("/hamburger/inbox")}>
          <Titles size={"h2"}>{formData.name}</Titles>
        </TitleBoxes>
      </Holds>

      <Holds
        background={"white"}
        className="w-full h-full row-start-2 row-end-8 "
      >
        <form
          onSubmit={async (e) => {
            setIsSubmitting(true);
            try {
              cancel();
              await handleSubmit(e);
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="h-full mt-3 mb-5"
        >
          <Grids rows={"8"} gap={"5"} className="h-full w-full">
            <Holds className="row-start-1 row-end-8 h-full w-full border-black border-opacity-5 border-b-2 ">
              <div className="overflow-y-auto no-scrollbar">
                <Contents width={"section"}>
                  <Holds>
                    <Labels size={"p4"} htmlFor="title">
                      {t("TitleOptional")}
                    </Labels>
                    <Inputs
                      type="text"
                      placeholder={t("EnterATitleHere")}
                      name="title"
                      value={formTitle}
                      className="text-center text-base"
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </Holds>
                  <FormFieldRenderer
                    formData={formData}
                    formValues={formValues}
                    setFormValues={updateFormValues}
                    readOnly={false}
                  />
                  <Holds>
                    {formData.isSignatureRequired && (
                      <Holds className="h-full w-full">
                        <Labels size={"p5"} htmlFor="signature">
                          {t("Signature")}
                        </Labels>
                        {showSignature ? (
                          <Holds
                            onClick={() => setShowSignature(false)}
                            className="w-full h-full border-[3px] rounded-[10px] border-black"
                          >
                            {signature && (
                              <Holds className="w-full h-full">
                                <img
                                  src={signature}
                                  alt="signature"
                                  className="h-20 w-full object-contain"
                                />
                              </Holds>
                            )}
                          </Holds>
                        ) : (
                          <Holds className="w-full h-full ">
                            <Buttons
                              onClick={() => setShowSignature(true)}
                              type="button"
                              className="shadow-none w-full h-20"
                            >
                              {t("TapToSign")}
                            </Buttons>
                          </Holds>
                        )}
                      </Holds>
                    )}
                  </Holds>
                </Contents>
              </div>
            </Holds>

            <Holds className="row-start-8 row-end-9 h-full w-full">
              <Contents width={"section"}>
                <Holds position={"row"} className="w-full h-full gap-x-3">
                  <Buttons
                    type="submit"
                    background={
                      !validateForm(formValues, formData) || 
                      (formData.isSignatureRequired && !showSignature)
                        ? "darkGray"
                        : "green"
                    }
                    disabled={
                      !validateForm(formValues, formData) ||
                      (formData.isSignatureRequired && !showSignature) ||
                      isSubmitting
                    }
                    className="w-full"
                  >
                    <Titles size={"h4"}>
                      {isSubmitting ? t("Submitting") : t("SubmitRequest")}
                    </Titles>
                  </Buttons>
                  <Buttons
                    type="button"
                    background={"red"}
                    onClick={() => handleDeleteForm(submissionId)}
                    className="w-full"
                  >
                    <Titles size={"h4"}>{t("DeleteDraft")}</Titles>
                  </Buttons>
                </Holds>
              </Contents>
            </Holds>
          </Grids>
        </form>
      </Holds>
    </>
  );
}
