"use client";
import { FormEvent, useEffect, useState } from "react";
import { FormInput } from "./formInput";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { Grids } from "@/components/(reusable)/grids";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import Spinner from "@/components/(animations)/spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FormField {
  id: string;
  label: string;
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
  const [formData, setFormData] = useState<FormTemplate | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const router = useRouter();
  const { data: session } = useSession();
  if (!session) {
    return router.push("/");
  }
  const userId = session.user.id;

  useEffect(() => {
    async function fetchForm() {
      const res = await fetch(`/api/form/` + params.id);
      const data = await res.json();
      setFormData(data);
      console.log(data);
    }

    fetchForm();
  }, [params.id]);

  const SubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents default form submission behavior

    const form = new FormData(e.currentTarget); // Collects form data
    formData && form.append("formTemplateId", formData.id);
    form.append("userId", userId);
    formData && form.append("formType", formData.formType);

    const formObject: Record<string, any> = {};
    console.log("form Data not object:", formData);

    // Convert FormData to an object (optional, for easier handling)
    form.forEach((value, key) => {
      formObject[key] = value;
    });

    console.log("Form Data:", formObject);
    // take form object and submit it to a form submission
  };

  if (!formData)
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

  return (
    <Bases>
      <Contents>
        <Grids className="grid-rows-8 gap-5">
          <Holds
            background={"green"}
            className="row-span-1 h-full justify-center "
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
              <form onSubmit={SubmitForm} className="h-full">
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
