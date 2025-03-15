import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { FormInput } from "./formInput";
import { FormEvent } from "react";

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
}: {
  formData: FormTemplate;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  formValues: Record<string, string>;
  formTitle: string;
  setFormTitle: (title: string) => void;
  updateFormValues: (values: Record<string, string>) => void;
}) {
  return (
    <>
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
    </>
  );
}
