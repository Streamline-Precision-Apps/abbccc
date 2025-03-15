"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { FormInput } from "./formInput";
import { FormEvent } from "react";
import { deleteFormSubmission } from "@/actions/hamburgerActions";
import { Titles } from "@/components/(reusable)/titles";
import { useRouter } from "next/navigation";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { format } from "date-fns";

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
  submissionStatus,
  signature,
  submittedForm,
  submissionId,
}: {
  formData: FormTemplate;
  formValues: Record<string, string>;
  formTitle: string;
  setFormTitle: (title: string) => void;
  updateFormValues: (values: Record<string, string>) => void;
  submissionStatus: string | null;
  signature: string | null;
  submittedForm: string | null;
  submissionId: string | null;
}) {
  const router = useRouter();

  const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!submissionId) {
        console.error("No submission ID found");
        return;
      }
      const isDeleted = await deleteFormSubmission(submissionId);
      if (isDeleted) {
        return router.push("/hamburger/inbox");
      }
    } catch (error) {
      console.error("Error deleting form submission:", error);
    }
  };
  return (
    <>
      <Holds
        background={"white"}
        className="row-span-1 h-full justify-center px-3 "
      >
        <Grids cols={"5"} rows={"2"} className="w-full h-full p-2">
          <Holds className="col-span-1 row-span-2 flex items-center justify-center">
            <Buttons
              onClick={() => router.push("/hamburger/inbox")}
              background={"none"}
              position={"left"}
            >
              <Images
                titleImg="/turnBack.svg"
                titleImgAlt={"Turn Back"}
                className="max-w-8 h-auto object-contain"
              />
            </Buttons>
          </Holds>

          <Holds className="col-start-2 col-end-5 row-start-1 row-end-3 flex items-center justify-center">
            <Titles size={"h4"}>{formTitle}</Titles>
            <Titles size={"h6"}>{formData.name}</Titles>
          </Holds>
          <Holds className="col-start-5 col-end-6 row-start-1 row-end-3">
            <Holds
              background={
                submissionStatus === "PENDING"
                  ? "orange"
                  : submissionStatus === "APPROVED"
                  ? "green"
                  : "red"
              }
              className="flex items-center justify-center w-10 h-auto rounded-full"
            >
              <Images
                titleImgAlt={"form Status"}
                titleImg={
                  submissionStatus === "PENDING"
                    ? "/OrangeOngoing.svg"
                    : submissionStatus === "APPROVED"
                    ? "/Checkmark.svg"
                    : "/statusReject.svg"
                }
                className=" w-10 h-auto object-contain"
              />
            </Holds>
          </Holds>
        </Grids>
      </Holds>

      <Holds background={"white"} className="w-full h-full row-span-7 px-2 ">
        <Contents width={"section"}>
          <form
            onSubmit={(e) => {
              handleDelete(e);
            }}
            className="h-full"
          >
            <Grids rows={"6"} gap={"3"} className="h-full w-full mt-5">
              <Holds className="row-start-1 row-end-6 h-full w-full overflow-y-hidden no-scrollbar">
                {formData?.groupings?.map((group) => (
                  <Holds key={group.id} className="">
                    {group.title && <h3>{group.title || ""}</h3>}
                    {group.fields.map((field) => {
                      return (
                        <Holds key={field.id} className="pb-3">
                          <FormInput
                            key={field.name} // Use field.name as the key
                            field={field}
                            formValues={formValues}
                            setFormValues={updateFormValues}
                          />
                        </Holds>
                      );
                    })}
                  </Holds>
                ))}

                <Holds className="h-full w-full py-2">
                  <Holds className="border-[3px] rounded-[10px] border-black justify-center items-center">
                    {signature ? (
                      <Images
                        titleImgAlt={"form Status"}
                        titleImg={signature}
                        className=" w-full h-24 object-contain"
                      />
                    ) : (
                      <Holds className="w-full h-24 flex items-center justify-center">
                        <Texts>No Signature</Texts>
                      </Holds>
                    )}
                  </Holds>
                  {submittedForm && (
                    <Texts
                      className="pt-1"
                      position={"left"}
                      size={"p7"}
                    >{`Originally Submitted: ${
                      format(new Date(submittedForm || ""), "M/dd/yy") || ""
                    } `}</Texts>
                  )}
                </Holds>
              </Holds>

              <Holds className="row-start-6 row-end-7 h-full w-full">
                <Buttons
                  background={"red"}
                  type="submit"
                  className="w-full h-[50px]"
                >
                  <Titles size={"h4"}>Delete Request</Titles>
                </Buttons>
              </Holds>
            </Grids>
          </form>
        </Contents>
      </Holds>
    </>
  );
}
