  import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
  import { Buttons } from "@/components/(reusable)/buttons";
  import { createJobsite, jobExists } from "@/actions/jobsiteActions";
  import { useTranslations } from "next-intl";
  import { Forms } from "@/components/(reusable)/forms";
  import { Labels } from "@/components/(reusable)/labels";
  import { Inputs } from "@/components/(reusable)/inputs";
  import { TextAreas } from "@/components/(reusable)/textareas";
  import { useRouter } from 'next/navigation';
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";

type Props = {
  handler:() => void
  setBanner:  Dispatch<SetStateAction<boolean>>
  setBannerText: Dispatch<SetStateAction<string>>
}
export default function AddJobsiteForm({ handler, setBanner, setBannerText}:Props){
  const t = useTranslations("addJobsiteForm");
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
  window.scrollTo({ top: 0, behavior: "smooth" })
  setTimeout(() => {
    setBanner(false);
    setBannerText("");
    router.replace("/dashboard/qr-generator/");
  }, 2300);
}

  return (
    <Forms action={createJobsite} 
    onSubmit={() => { 
      setBanner(true);
      setBannerText("Created Jobsite Successfully");
        handler();
        handleRoute();
      }} 
      >
      <Labels>{t("Temporary")}
      <Inputs id="id" name="id" type="text" value={qrCode} disabled />
      </Labels>

      <Labels>
          {t("Name")}
        <Inputs
          id="name"
          name="name"
          type="text"
          placeholder={t("NameExample")}
          />
          </Labels> 

    <Texts position={"left"} size={"p1"} className="mb-2 mt-4">{t("Address")}</Texts>

      <Holds position={"row"} size={"full"} className="justify-between mb-4">
      <Holds size={"30"} className="mr-4">
        <Labels> 
            {t("StreetNumber")}
            <Inputs
                variant={"default"}
                id="streetNumber"
                name="streetNumber"
                placeholder={`${t("StreetNumberDirection")} `}
              />
        </Labels> 
      </Holds>

      <Holds size={"70"}>
      <Labels> 
      {t("StreetName")}
          <Inputs
          className="text-black"
          id="streetName"
          name="streetName"
          placeholder={t("StreetNameDirection")}
          />
      </Labels> 
      </Holds>
    </Holds>

      <Holds position={"row"} size={"full"}>
      <Holds size={"40"} className="mr-4">
        <Labels>
          {t("City")}
          <Inputs
          variant={"default"}
          id="city"
          name="city"
          placeholder={t("CityTitle")}
          />
          </Labels>
      </Holds>
      <Holds size={"20"} className="mr-4">
        <Labels>
          {t("ZipCode")}
          <Inputs
          variant={"default"}
          id="zipCode"
          name="zipCode"
          placeholder={t("ZipCodeTitle")}
          />
          </Labels>
      </Holds>
      <Holds size={"20"}>
        <Labels>
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
          <Texts position={"left"} size={"p1"} className="mb-4 mt-6">{t("Description")}</Texts>
        <Labels>
          {t("DescriptionTitle")}
            <TextAreas
              variant={"default"}
              id="description"
              rows={4}
              name="description"
              placeholder={t("purpose")}
              />
        </Labels>
      
      
        <Labels>
          {t("Comments")}
          <TextAreas
          id="comment"
          name="comment"
          rows={4}
          placeholder={t("CommentsPurpose")}
          />
          </Labels>
      <Holds size={"full"} position={"center"} className="m-2">
      <Buttons background={"green"} size={"80"} type="submit" className="p-3 ">
        <Titles size={"h1"}>{t("Submit")}</Titles>
      </Buttons>
      </Holds>
    </Forms>
  );
  };