"use client";
import { FormEvent, useEffect, useState, useCallback } from "react";
import { FormInput } from "./formInput";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import Spinner from "@/components/(animations)/spinner";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveDraft, submitForm } from "@/actions/hamburgerActions";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";

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

export default function DynamicForm({ params }: { params: { id: string } }) {
  const formSubmissions = useSearchParams();
  const submissionId = formSubmissions.get("submissionId");

  const [formData, setFormData] = useState<FormTemplate | null>(null);
  const [initialDraftData, setInitialDraftData] = useState<
    Record<string, string>
  >({});
  const [formTitle, setFormTitle] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { data: session } = useSession();
  const userId = session?.user.id;
  const router = useRouter();

  // Fetch form template and draft data on page load
  useEffect(() => {
    setLoading(true);

    async function fetchForm() {
      try {
        const res = await fetch(`/api/form/` + params.id);
        const data = await res.json();
        setFormData(data);

        if (submissionId) {
          const draftRes = await fetch(`/api/formDraft/` + submissionId);
          const draftData = await draftRes.json();

          setFormValues(draftData.data);
          setFormTitle(draftData.title || ""); // Set the title from draft data
          setInitialDraftData(draftData.data); // Store the initial draft data
        }
      } catch (error) {
        console.error("error", error);
      } finally {
        setLoading(false);
      }
    }

    fetchForm();
  }, [params.id, submissionId]);

  const getChangedFields = (
    currentValues: Record<string, string>,
    initialValues: Record<string, string>
  ) => {
    const changedFields: Record<string, string> = {};

    for (const key in currentValues) {
      if (currentValues[key] !== initialValues[key]) {
        changedFields[key] = currentValues[key];
      }
    }

    return changedFields;
  };

  // Debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId); // Clear the previous timeout
      timeoutId = setTimeout(() => func(...args), delay); // Set a new timeout
    };
  };

  // Memoized auto-save function
  const autoSave = useCallback(
    debounce(async (values: Record<string, any>, title: string) => {
      if ((Object.keys(values).length > 0 || title) && formData) {
        setIsSaving(true);
        try {
          const changedFields = getChangedFields(values, initialDraftData); // Get only changed fields
          await saveDraft(
            { ...changedFields, title }, // Include the title in the draft data
            formData.id,
            userId || "",
            formData.formType,
            submissionId || undefined
          );
          console.log("Draft saved successfully");
        } catch (error) {
          console.error("Error saving draft:", error);
        } finally {
          setIsSaving(false);
        }
      }
    }, 2000), // Save every 2 seconds after the user stops typing
    [formData, userId, submissionId, initialDraftData] // Dependencies
  );

  // Update formValues and title with debounce
  const updateFormValues = useCallback(
    (newValues: Record<string, any>) => {
      setFormValues(newValues); // Update state immediately
      autoSave(newValues, formTitle); // Debounce the auto-save
    },
    [autoSave, formTitle]
  );

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData) {
      console.error("Form data is not available");
      return;
    }

    try {
      const result = await submitForm(
        { ...formValues, title: formTitle }, // Include the title in the submission
        formData.id,
        userId || "",
        formData.formType,
        submissionId || undefined
      );

      if (result) {
        router.push("/hamburger/inbox"); // Redirect to a success page
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (loading || !formData) {
    return (
      <Bases>
        <Contents>
          <Grids className="grid-rows-8 gap-5">
            <Holds
              background={"white"}
              className="row-span-1 h-full justify-center animate-pulse px-2 "
            >
              <TitleBoxes
                title={"loading..."}
                type="noIcon"
                titleImg={""}
                titleImgAlt={""}
              />
            </Holds>

            <Holds
              background={"white"}
              className="w-full h-full row-span-7 animate-pulse"
            >
              <Contents width={"section"}>
                <form className="h-full">
                  <Grids rows={"6"} gap={"3"} className="h-full w-full my-5">
                    <Holds className="row-start-1 row-end-6 h-full w-full justify-center">
                      <Spinner />
                    </Holds>

                    <Holds className="row-start-6 row-end-7 h-full w-full">
                      <Buttons type="submit" className="w-full h-[50px]">
                        Submit
                      </Buttons>
                    </Holds>
                  </Grids>
                </form>
              </Contents>
            </Holds>
          </Grids>
        </Contents>
      </Bases>
    );
  }

  return (
    <Bases>
      <Contents>
        <Grids className="grid-rows-8 gap-5">
          <Holds
            background={"white"}
            className="row-span-1 h-full justify-center px-3 "
          >
            <TitleBoxes
              title={formData.name}
              type="noIcon"
              titleImg={""}
              titleImgAlt={""}
            />
          </Holds>

          <Holds background={"white"} className="w-full h-full row-span-7 ">
            <Contents width={"section"}>
              <form onSubmit={handleSubmit} className="h-full">
                <Grids rows={"6"} gap={"3"} className="h-full w-full my-5">
                  <Holds className="row-start-1 row-end-6 h-full w-full">
                    <Holds className="px-2">
                      <Labels size={"p4"} htmlFor="title">
                        Title (Optional)
                      </Labels>
                      <Inputs
                        type="text"
                        placeholder="Enter a title here"
                        name="title"
                        value={formTitle}
                        className="text-center"
                        onChange={(e) => setFormTitle(e.target.value)}
                      />
                    </Holds>
                    {formData?.groupings?.map((group) => (
                      <Holds key={group.id} className="">
                        {group.title && <h3>{group.title || ""}</h3>}
                        {group.fields.map((field) => {
                          return (
                            <Holds key={field.id} className="p-2">
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
                  </Holds>

                  <Holds className="row-start-6 row-end-7 h-full w-full">
                    <Buttons type="submit" className="w-full h-[50px]">
                      Submit
                    </Buttons>
                  </Holds>
                </Grids>
              </form>
            </Contents>
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
