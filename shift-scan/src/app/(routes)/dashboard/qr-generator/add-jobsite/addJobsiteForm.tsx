"use client";
import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { createJobsite, jobExists } from "@/actions/jobsiteActions";
import { useTranslations } from "next-intl";
import { Forms } from "@/components/(reusable)/forms";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { useRouter } from "next/navigation";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Divider } from "@nextui-org/react";
import { Dividers } from "@/components/(reusable)/dividers";

type Props = {
  handler: () => void;
  setBanner: Dispatch<SetStateAction<boolean>>;
  setBannerText: Dispatch<SetStateAction<string>>;
};
export default function AddJobsiteForm({
  handler,
  setBanner,
  setBannerText,
}: Props) {
  const t = useTranslations("Generator");
  const [qrCode, setQrCode] = useState("");
  const router = useRouter();

  const randomQrCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "J-TEMP-";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };
  // this checks if the qr code already exists in the database
  useEffect(() => {
    async function generateQrCode() {
      try {
        const result = randomQrCode();
        setQrCode(result);
        const response = await jobExists(result);
        if (response) {
          setQrCode("");
          return generateQrCode();
        }
      } catch (error) {
        console.error("Failed to generate QR code:", error);
      }
    }
    generateQrCode();
  }, []);

  function handleRoute() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setBanner(false);
      setBannerText("");
      router.replace("/dashboard/qr-generator/");
    }, 2300);
  }

  return (
    <Forms
      action={createJobsite}
      onSubmit={() => {
        setBanner(true);
        setBannerText("Created Jobsite Successfully");
        handler();
        handleRoute();
      }}
    >
      <Labels size={"p4"}>
        {t("Temporary")}
        <Inputs id="id" name="id" type="text" value={qrCode} disabled />
      </Labels>

      <Labels size={"p4"}>
        {t("Name")}
        <Inputs
          id="name"
          name="name"
          type="text"
          placeholder={t("NameExample")}
        />
      </Labels>

      <Texts position={"center"} size={"p3"} className="mt-6">
        {t("Address")}
      </Texts>
      <Dividers />
      <Holds size={"full"} className="mr-4">
        <Labels size={"p4"}>
          {t("StreetNumber")}
          <Inputs
            variant={"default"}
            id="streetNumber"
            name="streetNumber"
            placeholder={`${t("StreetNumberDirection")} `}
          />
        </Labels>
      </Holds>

      <Holds size={"full"}>
        <Labels size={"p4"}>
          {t("StreetName")}
          <Inputs
            className="text-black"
            id="streetName"
            name="streetName"
            placeholder={t("StreetNameDirection")}
          />
        </Labels>
      </Holds>

      <Holds size={"full"} className="mr-4">
        <Labels size={"p4"}>
          {t("City")}
          <Inputs
            variant={"default"}
            id="city"
            name="city"
            placeholder={t("CityTitle")}
          />
        </Labels>
      </Holds>
      <Holds position={"row"} size={"full"}>
        <Holds size={"50"} className="mr-4">
          <Labels size={"p4"}>
            {t("ZipCode")}
            <Inputs
              variant={"default"}
              id="zipCode"
              name="zipCode"
              placeholder={t("ZipCodeTitle")}
            />
          </Labels>
        </Holds>
        <Holds size={"50"}>
          <Labels size={"p4"}>
            {t("State")}
            <Inputs
              variant={"default"}
              id="state"
              name="state"
              placeholder={t("StateTitle")}
            />
          </Labels>
        </Holds>
      </Holds>
      {/* Commented out foreign country becaus its not that big of a concern right now*/}
      {/* <Holds size={"full"} className="mr-4">
        <Labels>
          {t("Country")}
          <Inputs
          variant={"default"}
          id="country"
          name="country"
          />
          </Labels>
          </Holds> */}
      <Texts position={"center"} size={"p3"} className="mt-6">
        {t("Description")}
      </Texts>
      <Dividers />
      <Labels size={"p4"}>
        {t("DescriptionTitle")}
        <TextAreas
          variant={"default"}
          id="description"
          rows={4}
          name="description"
          placeholder={t("purpose")}
        />
      </Labels>

      <Labels size={"p4"}>
        {t("Comments")}
        <TextAreas
          id="comment"
          name="comment"
          rows={4}
          placeholder={t("CommentsPurpose")}
        />
      </Labels>

      <Holds size={"full"} position={"center"} className="my-4">
        <Buttons background={"green"} size={"50"} type="submit" className="p-2">
          <Titles size={"h3"}>{t("Submit")}</Titles>
        </Buttons>
      </Holds>
    </Forms>
  );
}
