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
      <Holds background={"white"} className="row-start-1 row-end-2 h-full  ">
        <TitleBoxes
          onClick={() => {
            router.back();
          }}
        >
          <>
            <Holds className="px-8 h-full justify-center items-center">
              <Titles size={"h3"}>
                {formTitle
                  ? formTitle.charAt(0).toUpperCase() +
                    formTitle.slice(1).slice(0, 24)
                  : formData.name.charAt(0).toUpperCase() +
                    formData.name.slice(1).slice(0, 24)}
              </Titles>
              {formTitle !== "" && <Titles size={"h6"}>{formData.name}</Titles>}
            </Holds>
            <Holds className=" w-12 h-12 absolute right-1 top-0 justify-center">
              <Images
                titleImgAlt={"form Status"}
                titleImg={
                  submissionStatus === "PENDING"
                    ? "/statusOngoingFilled.svg"
                    : submissionStatus === "APPROVED"
                      ? "/statusApprovedFilled.svg"
                      : "/statusDeniedFilled.svg"
                }
                className="max-w-10 h-auto object-contain"
              />
            </Holds>
          </>
        </TitleBoxes>
      </Holds>

      <Holds
        background={"white"}
        className="w-full h-full row-start-2 row-end-8 no-scrollbar  "
      >
        <Contents width={"section"}>
          <form
            onSubmit={() => {
              handleDelete();
            }}
            className="h-full py-3"
          >
            <Grids rows={"8"} gap={"5"} className="h-full w-full">
              <Holds className="row-start-1 row-end-8 h-full w-full overflow-y-auto no-scrollbar">
                <FormFieldRenderer
                  formData={formData}
                  formValues={formValues}
                  setFormValues={updateFormValues}
                  readOnly={submissionStatus !== "PENDING"}
                />

                <Holds className="h-full w-full pt-4">
                  {submissionStatus === "PENDING" && (
                    <Holds className="border-[3px] rounded-[10px] border-black justify-center items-center">
                      {signature ? (
                        <Images
                          titleImgAlt={"form Status"}
                          titleImg={signature}
                          className=" w-full h-24 object-contain"
                        />
                      ) : (
                        <Holds className="w-full h-24 flex items-center justify-center">
                          <Texts>{t("NoSignature")}</Texts>
                        </Holds>
                      )}
                    </Holds>
                  )}
                  {submittedForm && (
                    <Texts
                      className="pt-1"
                      position={"left"}
                      size={"p7"}
                      text={"gray"}
                    >{`${t("OriginallySubmitted")} ${
                      format(new Date(submittedForm || ""), "M/dd/yy") || ""
                    } `}</Texts>
                  )}
                </Holds>
              </Holds>
              {submissionStatus === "PENDING" && (
                <Holds className="row-start-8 row-end-9 justify-center h-full w-full">
                  <Buttons
                    background={"red"}
                    type="button"
                    onClick={() => setDeleteRequestModal(true)}
                    className="w-full h-[50px]"
                  >
                    <Titles size={"h4"}>{t("DeleteRequest")}</Titles>
                  </Buttons>
                </Holds>
              )}
              <NModals
                background={"noOpacity"}
                isOpen={deleteRequestModal}
                handleClose={() => setDeleteRequestModal(false)}
                size={"medWW"}
              >
                <Holds className="w-full h-full pb-5">
                  <Holds className="w-full h-3/4 justify-center items-center">
                    <Texts size={"p2"}>
                      {t("AreYouSureYouWantToDeleteThisRequest")}
                    </Texts>
                  </Holds>
                  <Holds position={"row"} className="gap-4 h-1/4">
                    <Buttons
                      background={"green"}
                      type="button"
                      onClick={() => handleDelete()}
                      className="w-full py-2"
                    >
                      <Titles size={"h4"}>{t("Yes")}</Titles>
                    </Buttons>

                    <Buttons
                      background={"red"}
                      type="button"
                      onClick={() => setDeleteRequestModal(false)}
                      className="w-full py-2"
                    >
                      <Titles size={"h4"}>{t("Cancel")}</Titles>
                    </Buttons>
                  </Holds>
                </Holds>
              </NModals>
            </Grids>
          </form>
        </Contents>
      </Holds>
    </>
  );
}
