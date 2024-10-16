"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";

export default function ReportBug() {
  const t = useTranslations("Forms");

  const { data: session } = useSession();
  if (!session) {
    redirect("/dashboard/forms");
  }
  const userId = session?.user.id;

  return (
    <Bases>
      <Contents>
        <Grids rows={"10"} gap={"5"}>
          <Holds background={"white"} className="row-span-2 h-full my-auto">
            <Contents width={"section"}>
              <TitleBoxes
                title={`${t("Form3")}`}
                titleImg="/form.svg"
                titleImgAlt="Forms"
                variant="default"
                size="default"
                className="my-auto"
              />
            </Contents>
          </Holds>
          <Holds
            size={"full"}
            background={"white"}
            className="row-span-8 h-full py-4"
          >
            <Forms action="" className="my-auto h-full">
              <Inputs type="hidden" name="userId" value={userId} />
              <Contents width={"section"}>
                <Grids rows={"8"} gap={"5"} className="h-full">
                  <Holds className="row-span-1 h-full my-auto">
                    <Holds className="my-auto">
                      <Texts position={"left"} size={"p5"}>
                        {t("Form3Q1")}
                      </Texts>
                      <Inputs
                        type="date"
                        name="q1"
                        id="q1"
                        required
                        placeholder={`${t("Form3Q1Placeholder")}`}
                        className="h-10 my-auto"
                      />
                    </Holds>
                  </Holds>
                  <Holds size={"full"} className="row-span-2 my-auto h-full">
                    <Holds className="my-auto">
                      <Holds>
                        <Texts position={"left"} size={"p5"}>
                          {t("Form3Q2")}
                        </Texts>
                      </Holds>
                      <TextAreas
                        rows={2}
                        name="q2"
                        id="q2"
                        minLength={1}
                        maxLength={40}
                        required
                        style={{ resize: "none" }}
                      />
                    </Holds>
                  </Holds>
                  <Holds size={"full"} className="row-span-2 h-full ">
                    <Holds className="my-auto">
                      <Labels size={"p4"}>
                        {t("Form3Q3")}
                        <TextAreas
                          name="q3"
                          id="q3"
                          minLength={1}
                          maxLength={40}
                          required
                          style={{ resize: "none" }}
                        />
                      </Labels>
                    </Holds>
                  </Holds>
                  <Holds size={"full"} className="row-span-2 my-auto h-full ">
                    <Holds className="my-auto">
                      <Labels size={"p4"}>
                        {t("Form3Q4")}
                        <TextAreas
                          name="q4"
                          id="q4"
                          required
                          minLength={1}
                          maxLength={40}
                          className="h-10 my-auto"
                          style={{ resize: "none" }}
                        />
                      </Labels>
                    </Holds>
                  </Holds>
                  <Holds size={"full"} className="row-span-1 h-full">
                    <Holds className="my-auto">
                      <Buttons
                        type="submit"
                        background={"orange"}
                        className="rounded-lg  py-2"
                      >
                        <Titles text={"black"} size={"h3"}>
                          {t("Form3Submit")}
                        </Titles>
                      </Buttons>
                    </Holds>
                  </Holds>
                </Grids>
              </Contents>
            </Forms>
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
