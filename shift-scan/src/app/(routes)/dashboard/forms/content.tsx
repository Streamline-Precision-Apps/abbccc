"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Options } from "@/components/(reusable)/options";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { TextAreas } from "@/components/(reusable)/textareas";

export default function Content() {
  const t = useTranslations("dashboard");
  const [form, setForm] = useState(0);
  const [displayForm, setDisplayForm] = useState(false);
  const { data: session } = useSession();
  if (!session) {
    return null;
  }
  const userId = session.user.id;


  const handleRoute = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedForm = e.currentTarget.form.value;
    setForm(selectedForm);
    setDisplayForm(selectedForm !== 0);
  };

  // TODO: Create a form component for each form
  // current colors are here to show the forms
  const formComponents: { [key: string]: JSX.Element } = {
    "1": (
      <Holds size={"full"} background={"green"} className="my-10">
        <p>{form}</p>
      </Holds>
    ),
    "2": (
      <Holds size={"full"} background={"darkBlue"} className="my-10">
        <p>{form}</p>
      </Holds>
    ),
    "3": (
      <Holds size={"full"} className="my-10">
        <Titles>{t("Form3")}</Titles>
        <Forms action="">
            <Inputs type="hidden" name="userId" value={userId}></Inputs> 
          <Labels>{t("Form3Q1")}
          <Inputs type="date" name="q1" id="q1" required placeholder={`${t("Form3Q1Placeholder")}`} />
          </Labels>

          <Labels>{t("Form3Q2")}
          <Inputs type="text" name="q2" id="q2" required placeholder={`${t("Form3Q2Placeholder")}`} />
          </Labels>

          <Labels>{t("Form3Q3")}
          <TextAreas name="q3" id="q3" required placeholder={`${t("Form3Q3Placeholder")}`} />
          </Labels>

          <Labels>{t("Form3Q4")}
          <Inputs type="text" name="q4" id="q4" required placeholder={`${t("Form3Q4Placeholder")}`} />
          </Labels>
        <Holds size={"full"} className="py-4">
          <Buttons
          type="submit"
          background={"orange"}
          className="rounded-lg p-3"
          size={"50"}
          >
        <Titles text={"black"} size={"h2"}>
          {t("Form3Submit")}
        </Titles>
        </Buttons>
          </Holds>

        </Forms>
      </Holds>
    ),
  };

  return (
    <Holds size={"full"} background="white" className="my-10">
      <Forms onSubmit={handleRoute} className="my-5">
        <Labels className="my-2">
          {t("Forms")}
          <Selects
          onChange={() => setDisplayForm(false)}
          name="form" id="form" defaultValue="" required className="my-2">
            <Options value="">{t("FormDefault")}</Options>
            <Options value="1">{t("Form1")}</Options>
            <Options value="2">{t("Form2")}</Options>
            <Options value="3">{t("Form3")}</Options>
          </Selects>
        </Labels>
        <Holds size={"full"} className="py-4">
        {!displayForm &&
        <Buttons 
        className="bg-app-orange rounded-lg p-3"
        size={"50"}
        type="submit">
            <Titles text={"black"} size={"h2"}>
          {t("Continue")}
        </Titles>
        </Buttons>
        }
        </Holds>
      </Forms>

      {/* Display the selected form if available */}
      {displayForm && formComponents[form]}
    </Holds>
  );
}