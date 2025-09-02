"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { FormInput } from "./formInput";
import { FormFieldRenderer } from "@/app/(routes)/hamburger/inbox/_components/FormFieldRenderer";
import { useEffect, useState } from "react";
import { deleteFormSubmission, savePending } from "@/actions/hamburgerActions";
import { Titles } from "@/components/(reusable)/titles";
import { useRouter } from "next/navigation";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { format } from "date-fns";
import { useAutoSave } from "@/hooks/(inbox)/useAutoSave";
import { NModals } from "@/components/(reusable)/newmodals";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";

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
export default function SubmittedForms({
  formData,
  formTitle,
  setFormTitle,
  formValues,
  updateFormValues,
  userId,
  signature,
  submittedForm,
  submissionId,
  submissionStatus,
}: {
  formData: FormTemplate;
  formValues: Record<string, string>;
  formTitle: string;
  setFormTitle: (title: string) => void;
  updateFormValues: (values: Record<string, string>) => void;
  userId: string;
  signature: string | null;
  submittedForm: string | null;
  submissionId: number | null;
  submissionStatus: string | null;
}) {
  const t = useTranslations("Hamburger-Inbox");
  const router = useRouter();
  const [deleteRequestModal, setDeleteRequestModal] = useState(false);

  type FormValues = Record<string, string>;

  // Helper function to validate date string
  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const saveDraftData = async (values: FormValues, title: string) => {
    if ((Object.keys(values).length > 0 || title) && formData) {
      try {
        await savePending(
          values,
          formData.id,
          userId,
          formData.formType,
          submissionId ? submissionId : undefined,
          title,
        );
      } catch (error) {
        console.error("Error saving draft:", error);
      }
    }
  };

  // Use the auto-save hook with the FormValues type
  const { autoSave } = useAutoSave<{
    values: FormValues;
    title: string;
  }>((data) => saveDraftData(data.values, data.title), 500);

  // Trigger auto-save when formValues or formTitle changes
  useEffect(() => {
    autoSave({ values: formValues, title: formTitle });
  }, [formValues, formTitle, autoSave]);

  const handleDelete = async () => {
    try {
      if (!submissionId) {
        console.error("No submission ID found");
        return;
      }
      const isDeleted = await deleteFormSubmission(submissionId);
      if (isDeleted) {
        return router.back();
      }
    } catch (error) {
      console.error("Error deleting form submission:", error);
    }
  };
  return (
    <>
      <Holds background={"white"} className="row-start-1 row-end-2 h-full">
        <TitleBoxes
          onClick={() => {
            router.back();
          }}
        >
          <Holds className="px-8 h-full justify-center items-center">
            <div className="flex flex-col items-center">
              <Titles size={"h3"} className="text-center">
                {formTitle
                  ? formTitle.charAt(0).toUpperCase() +
                    formTitle.slice(1).slice(0, 24)
                  : formData.name.charAt(0).toUpperCase() +
                    formData.name.slice(1).slice(0, 24)}
              </Titles>
              {formTitle !== "" && (
                <Titles size={"h6"} className="text-gray-500">
                  {formData.name}
                </Titles>
              )}
            </div>
          </Holds>
        </TitleBoxes>
      </Holds>

      <Holds
        background={"white"}
        className="w-full h-full row-start-2 row-end-8"
      >
        <form
          onSubmit={() => {
            handleDelete();
          }}
          className="h-full"
        >
          <Grids rows={"8"} className="h-full w-full">
            <Holds className="row-start-1 row-end-8 h-full w-full overflow-y-auto no-scrollbar">
              <Contents width={"section"}>
                <div className="h-full py-4 px-1">
                  {/* Submission Details Card */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-blue-600 font-semibold text-sm">
                        Submission Details
                      </h3>
                      <p className="text-xs italic text-gray-500">
                        {`${t("OriginallySubmitted")} ${
                          submittedForm && isValidDate(submittedForm)
                            ? format(new Date(submittedForm), "M/dd/yy")
                            : ""
                        }`}
                      </p>
                    </div>

                    {/* Status indicator */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Status:
                        </span>
                        <div className="py-1 px-3 rounded-md bg-orange-100 border border-app-orange">
                          <p className="text-sm font-medium text-app-orange">
                            Pending
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="bg-white rounded-lg">
                      <FormFieldRenderer
                        formData={formData}
                        formValues={formValues}
                        setFormValues={updateFormValues}
                        readOnly={true}
                        disabled={true}
                      />
                    </div>
                  </div>

                  {/* Signature Section */}
                  {submissionStatus === "PENDING" && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {t("Signature")}
                        </span>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-md p-2 flex justify-center items-center">
                        {signature ? (
                          <Images
                            titleImgAlt={"Signature"}
                            titleImg={signature}
                            className="w-full h-12 object-contain"
                          />
                        ) : (
                          <p className="text-sm text-gray-400 italic py-2">
                            {t("NoSignature")}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Contents>
            </Holds>

            {/* Delete Button Section */}
            {submissionStatus === "PENDING" && (
              <Holds className="row-start-8 row-end-9 justify-center h-full w-full p-4 border-t border-gray-200">
                <Contents width={"section"}>
                  <Buttons
                    background={"red"}
                    type="button"
                    onClick={() => setDeleteRequestModal(true)}
                    className="w-full h-10 rounded-md shadow-sm"
                    shadow={"none"}
                  >
                    <Titles size={"sm"}>{t("DeleteRequest")}</Titles>
                  </Buttons>
                </Contents>
              </Holds>
            )}
            {/* Confirmation Modal */}
            <NModals
              background={"noOpacity"}
              isOpen={deleteRequestModal}
              handleClose={() => setDeleteRequestModal(false)}
              size={"medWW"}
            >
              <div className="w-full h-full p-5 flex flex-col">
                <div className="flex-grow flex justify-center items-center">
                  <p className="text-lg font-medium text-gray-700 text-center">
                    {t("AreYouSureYouWantToDeleteThisRequest")}
                  </p>
                </div>
                <div className="flex gap-4 mt-4">
                  <Buttons
                    background={"green"}
                    type="button"
                    onClick={() => handleDelete()}
                    className="w-full h-10 rounded-md"
                  >
                    <Titles size={"md"}>{t("Yes")}</Titles>
                  </Buttons>

                  <Buttons
                    background={"neutral"}
                    type="button"
                    onClick={() => setDeleteRequestModal(false)}
                    className="w-full h-10 rounded-md"
                  >
                    <Titles size={"md"}>{t("Cancel")}</Titles>
                  </Buttons>
                </div>
              </div>
            </NModals>
          </Grids>
        </form>
      </Holds>
    </>
  );
}
