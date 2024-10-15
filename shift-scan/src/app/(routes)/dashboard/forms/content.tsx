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
import { useRouter } from "next/navigation";

export default function Content() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [displayForm, setDisplayForm] = useState(false);
  const { data: session } = useSession();
  if (!session) {
    return null;
  }
  const userId = session.user.id;

  const handleRoute = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedForm = e.currentTarget.form.value;
    console.log(selectedForm);

    if (selectedForm === "1") {
      router.push("/dashboard/forms/1");
    } else if (selectedForm === "2") {
      router.push("/dashboard/forms/2");
    } else if (selectedForm === "report-bug") {
      router.push("/dashboard/forms/report-bug");
    }
  };

  return (
    <Contents width={"section"}>
      <Holds size={"full"} background="white" className="my-auto">
        <Forms onSubmit={handleRoute} className="my-5">
          <Labels className="my-2">
            {t("Forms")}
            <Selects
              onChange={() => setDisplayForm(false)}
              name="form"
              id="form"
              defaultValue=""
              required
              className="my-2"
            >
              {/* Add your options here */}
              <Options value="">{t("FormDefault")}</Options>
              <Options value="report-bug">{t("Form3")}</Options>
            </Selects>
          </Labels>
          <Holds size={"full"} className="py-4">
            {!displayForm && (
              <Buttons
                className="bg-app-orange rounded-lg p-3"
                size={"50"}
                type="submit"
              >
                <Titles text={"black"} size={"h2"}>
                  {t("Continue")}
                </Titles>
              </Buttons>
            )}
          </Holds>
        </Forms>
      </Holds>
    </Contents>
  );
}
