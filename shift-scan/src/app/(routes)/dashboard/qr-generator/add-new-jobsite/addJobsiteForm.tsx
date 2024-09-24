  import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
  import { Buttons } from "@/components/(reusable)/buttons";
  import { createJobsite, jobExists } from "@/actions/jobsiteActions";
  import { useTranslations } from "next-intl";
  import { Forms } from "@/components/(reusable)/forms";
  import { Labels } from "@/components/(reusable)/labels";
  import { Inputs } from "@/components/(reusable)/inputs";
  import { TextAreas } from "@/components/(reusable)/textareas";
  import { useRouter } from 'next/navigation';

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
      variant="default" 
      size="default"
    >
      <Labels variant="default" size="default" > Temporary Site ID </Labels>
      <Inputs id="id" name="id" type="text" value={qrCode} disabled />

        <Labels variant="default" size="default" >
          {t("Name")}
          </Labels> 
        <Inputs
          id="name"
          name="name"
          type="text"
        
        />
      
      <Labels variant="default" size="default" >
          {t("StreetNumber")}
          </Labels> 
        <Inputs
          variant={"default"}
          id="streetNumber"
          name="streetNumber"
        />
      
      
      <Labels variant="default" size="default" >
          {t("StreetName")}
          </Labels> 
          <Inputs
          variant={"default"}
          id="streetName"
          name="streetName"
        
        />
      
      
        <Labels variant="default" size="default" > 
          {t("City")}
        </Labels>
          <Inputs
          variant={"default"}
          id="city"
          name="city"
        
        />
      
      
        <Labels variant="default" size="default" >
          {t("State")}
        </Labels>
          <Inputs
          variant={"default"}
          id="state"
          name="state"
        
        />
      
      
        <Labels variant="default" size="default" >
          {t("Country")}
        </Labels>
          <Inputs
          variant={"default"}
          id="country"
          name="country"
          
        />
      
      
        <Labels variant="default" size="default" > 
          {t("Description")}
        </Labels>
        <TextAreas
          variant={"default"}
          id="description"
          name="description"
          placeholder="Provide a description of the jobsite and the purpose for adding it."
        />
      
      
        <Labels variant="default" size="default" > 
          {t("Comments")}
        </Labels>
          <TextAreas
          id="comment"
          name="comment"
        
        />
      
      <Buttons variant={"green"} size={null} type="submit">
        {t("Submit")}
      </Buttons>
    </Forms>
  );
  };