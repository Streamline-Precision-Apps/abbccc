"use client";
import { FormEvent, useEffect, useState } from "react";
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

interface FormField {
  id: string;
  label: string;
  name: string;
  type: string;
  required: boolean;
  order: number;
  defaultValue?: string;
  placeholder?: string;
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
  const [formValues, setFormValues] = useState<Record<string, any>>({});
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

        // Fetch draft data if submissionId exists
        if (submissionId) {
          const draftRes = await fetch(`/api/formDraft/` + submissionId);
          const draftData = await draftRes.json();
          setFormValues(draftData.data || {});
        }
      } catch (error) {
        console.error("error", error);
      } finally {
        setLoading(false);
      }
    }

    fetchForm();
  }, [params.id, submissionId]);

  // Debounce function to limit the frequency of auto-saves
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Auto-save function
  const autoSave = debounce(async () => {
    if (Object.keys(formValues).length > 0) {
      setIsSaving(true);
      try {
        await saveDraft(
          formValues,
          formData?.id || "",
          userId || "",
          formData?.formType,
          submissionId || undefined
        );
        console.log("Draft saved successfully");
      } catch (error) {
        console.error("Error saving draft:", error);
      } finally {
        setIsSaving(false);
      }
    }
  }, 2000); // Save every 2 seconds after the user stops typing

  // Trigger auto-save whenever formValues changes
  useEffect(() => {
    autoSave();
  }, [formValues]);

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await submitForm(
        formValues,
        formData?.id || "",
        userId || "",
        formData?.formType,
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
                    {formData?.groupings?.map((group) => (
                      <Holds key={group.id} className="">
                        {group.title && <h3>{group.title || ""}</h3>}
                        {group.fields.map((field) => (
                          <Holds key={field.id} className="p-2">
                            <FormInput
                              key={field.label}
                              field={field}
                              formValues={formValues}
                              setFormValues={setFormValues}
                            />
                          </Holds>
                        ))}
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
