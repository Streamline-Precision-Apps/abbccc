"use client";
import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { Texts } from "@/components/(reusable)/texts";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState, useCallback, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { FormFieldRenderer } from "@/app/(routes)/hamburger/inbox/_components/FormFieldRenderer";
import { useSession } from "next-auth/react";
import { saveDraft, saveDraftToPending } from "@/actions/hamburgerActions";
import { ref } from "process";

// Form field type definitions
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

interface FormSubmission {
  id: string;
  formId: string;
  formData: unknown; // This should match your actual form data structure
  formTitle?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  FormTemplate: {
    id: string;
    name: string;
  };
}

export default function EditFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("Hamburger-Inbox");
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/forms?tab=inprogress";
  const { data: session } = useSession();
  const userId = session?.user.id;

  // Form state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formSubmission, setFormSubmission] = useState<FormSubmission | null>(
    null,
  );
  const [formTemplate, setFormTemplate] = useState<FormTemplate | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formTitle, setFormTitle] = useState<string>("");
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [showSignature, setShowSignature] = useState(false);

  // Fetch user signature
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
  }, []);

  // Fetch the form submission data
  useEffect(() => {
    const fetchFormSubmission = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/formSubmission/${id}`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch form submission: ${response.status}`,
          );
        }

        const data = await response.json();
        setFormSubmission(data);

        // Initialize form values from submission data
        if (data.formData) {
          setFormValues(data.formData);
        }

        // Initialize form title
        if (data.formTitle) {
          setFormTitle(data.formTitle);
        }

        // Now fetch the template
        if (data.FormTemplate?.id) {
          fetchFormTemplate(data.FormTemplate.id);
        } else {
          throw new Error("Form template ID not found in submission");
        }
      } catch (error) {
        console.error("Error fetching form submission:", error);
        setError("Failed to load the form. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchFormTemplate = async (templateId: string) => {
      try {
        const response = await fetch(`/api/form/${templateId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch form template: ${response.status}`);
        }

        const template = await response.json();
        setFormTemplate(template);
      } catch (error) {
        console.error("Error fetching form template:", error);
        setError("Failed to load the form template. Please try again later.");
      }
    };

    if (userId) {
      fetchFormSubmission();
    }
  }, [id, userId]);

  // Update form values - this function will be passed to FormFieldRenderer
  const updateFormValues = (newValues: Record<string, string>) => {
    setFormValues(newValues);
    setIsDirty(true);
  };

  // Save draft function
  const saveFormDraft = useCallback(async () => {
    if (!formTemplate || !userId || !formSubmission) return null;

    try {
      // Create draft data to save
      const result = await saveDraft(
        formValues,
        formTemplate.id,
        userId,
        formTemplate.formType,
        Number(formSubmission.id),
        formTitle,
      );

      console.log("Draft saved automatically");
      setIsDirty(false);
      return result?.id;
    } catch (error) {
      console.error("Error saving draft:", error);
      return null;
    }
  }, [formTemplate, userId, formTitle, formValues, formSubmission]);

  // Auto-save when values change
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if ((Object.keys(formValues).length > 0 || formTitle) && isDirty) {
        saveFormDraft();
      }
    }, 3000); // Save after 3 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [formValues, formTitle, saveFormDraft, isDirty]);

  // Save draft on navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        saveFormDraft();

        // Standard way to show a confirmation dialog
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, saveFormDraft]);

  // Submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formTemplate || !userId || !formSubmission) return;

    setSubmitting(true);

    try {
      // Validate form
      const requiredFields: string[] = [];

      formTemplate.groupings.forEach((group) => {
        group.fields.forEach((field) => {
          if (field.required && !formValues[field.name]) {
            requiredFields.push(field.label);
          }
        });
      });

      if (requiredFields.length > 0) {
        alert(
          `Please fill in the following required fields: ${requiredFields.join(", ")}`,
        );
        setSubmitting(false);
        return;
      }

      // Check for signature if required
      if (formTemplate.isSignatureRequired && !signature) {
        alert("Please add your signature to submit this form.");
        setShowSignature(true);
        setSubmitting(false);
        return;
      }

      // Submit using the server action
      const result = await saveDraftToPending(
        formValues,
        formTemplate.id,
        userId,
        formTemplate.formType,
        Number(formSubmission.id),
        formTitle,
      );

      if (result) {
        const response = await fetch("/api/notifications/send-multicast", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: "form-submissions",
            title: "Form Submission",
            message: `${result.User.firstName} ${result.User.lastName} has submitted a form titled "${formTemplate.name}" for approval.`,
            link: `/admins/forms/${result.formTemplateId}`,
            referenceId: result.id,
          }),
        });
        await response.json();

        // Navigate back to forms page
        router.push("/forms?tab=submitted");
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Render form fields
  const renderFormFields = () => {
    if (!formTemplate) return null;

    return (
      <Holds className="mb-6">
        <FormFieldRenderer
          formData={formTemplate}
          formValues={formValues}
          setFormValues={updateFormValues}
          readOnly={false}
        />
      </Holds>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <Bases>
        <Contents width={"section"}>
          <Grids rows={"8"}>
            <Holds
              background={"white"}
              className="h-full w-full row-span-1 relative rounded-b-none"
            >
              <TitleBoxes
                position={"row"}
                onClick={() => router.push(returnUrl)}
              >
                <Holds
                  position={"row"}
                  className="w-full justify-center items-center gap-x-2"
                >
                  <Titles size={"md"}>Edit Form</Titles>
                </Holds>
              </TitleBoxes>
            </Holds>
            <Holds
              background={"white"}
              className="h-full w-full rounded-t-none row-span-7 flex items-center justify-center"
            >
              <Titles size={"sm"} className="text-gray-500">
                Loading form...
              </Titles>
            </Holds>
          </Grids>
        </Contents>
      </Bases>
    );
  }

  // Render error state
  if (error) {
    return (
      <Bases>
        <Contents width={"section"}>
          <Grids rows={"8"}>
            <Holds
              background={"white"}
              className="h-full w-full row-span-1 relative rounded-b-none"
            >
              <TitleBoxes
                position={"row"}
                onClick={() => router.push("/forms")}
              >
                <Holds
                  position={"row"}
                  className="w-full justify-center items-center gap-x-2"
                >
                  <Titles size={"md"}>Error</Titles>
                </Holds>
              </TitleBoxes>
            </Holds>
            <Holds
              background={"white"}
              className="h-full w-full rounded-t-none row-span-7 flex flex-col items-center justify-center p-4"
            >
              <Texts size={"md"} className="text-red-500 mb-4">
                {error}
              </Texts>
              <Button onClick={() => router.push(returnUrl)}>
                Back to Forms
              </Button>
            </Holds>
          </Grids>
        </Contents>
      </Bases>
    );
  }

  // Render form
  return (
    <Bases>
      <Contents width={"section"}>
        <Grids rows={"8"}>
          <Holds
            background={"white"}
            className="h-full w-full row-span-1 relative rounded-b-none"
          >
            <TitleBoxes position={"row"} onClick={() => router.push(returnUrl)}>
              <Holds
                position={"row"}
                className="w-full justify-center items-center gap-x-2"
              >
                <Titles size={"md"}>
                  {formSubmission?.FormTemplate?.name || "Edit Form"}
                </Titles>
              </Holds>
            </TitleBoxes>
          </Holds>
          <Holds
            background={"white"}
            className="h-full w-full rounded-t-none row-span-7 overflow-y-auto no-scrollbar"
          >
            {formTemplate ? (
              <form onSubmit={handleSubmit} className="p-4">
                {/* Form title */}
                <Holds className="mb-6">
                  <Labels htmlFor="formTitle">
                    Form Title <span className="text-red-500">*</span>
                  </Labels>
                  <Inputs
                    id="formTitle"
                    value={formTitle}
                    onChange={(e) => {
                      setFormTitle(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Enter a title for this form"
                    required
                    className="w-full"
                  />
                </Holds>

                {/* Last updated timestamp */}
                <div className="mb-4">
                  <Texts size={"sm"} className="text-gray-500 mb-2">
                    Last updated:{" "}
                    {new Date(formSubmission?.updatedAt || "").toLocaleString()}
                  </Texts>
                </div>

                {/* Dynamic form fields */}
                {renderFormFields()}

                {/* Signature section */}
                {formTemplate.isSignatureRequired && (
                  <Holds className="mt-6">
                    <Holds className="bg-gray-50 rounded-lg">
                      {showSignature ? (
                        <div
                          onClick={() => setShowSignature(false)}
                          className="w-full h-full border-[3px] rounded-[10px] border-black cursor-pointer"
                        >
                          {signature && (
                            <img
                              src={signature}
                              alt="signature"
                              className="h-20 w-full object-contain"
                            />
                          )}
                        </div>
                      ) : (
                        <Buttons
                          onClick={() => setShowSignature(true)}
                          type="button"
                          className="shadow-none w-full h-20"
                        >
                          {t("TapToSign")}
                        </Buttons>
                      )}
                    </Holds>
                  </Holds>
                )}

                {/* Action buttons */}
                <div className="flex justify-between mt-8 pt-4 border-t gap-2 border-gray-200">
                  <Button
                    size={"lg"}
                    className="w-full bg-gray-200 py-2 px-4 rounded-lg cursor-pointer hover:opacity-90 text-center"
                    onClick={() => router.push("/forms")}
                  >
                    <Texts size={"sm"} className="font-semibold">
                      Cancel
                    </Texts>
                  </Button>

                  <Button
                    size={"lg"}
                    type="submit"
                    disabled={submitting}
                    className=" w-full bg-green-300 py-2 px-4 rounded-lg cursor-pointer hover:opacity-90 text-white text-center disabled:opacity-50"
                  >
                    <Texts size={"sm"} className="font-semibold">
                      {submitting ? "Submitting..." : "Submit Form"}
                    </Texts>
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Texts size={"sm"} className="text-gray-400 italic">
                  No form template found
                </Texts>
              </div>
            )}
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
