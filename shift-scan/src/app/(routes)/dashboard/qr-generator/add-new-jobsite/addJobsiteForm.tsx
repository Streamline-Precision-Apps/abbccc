  import React, { useState, useEffect } from "react";
  import { Buttons } from "@/components/(reusable)/buttons";
  import { createJobsite, jobExists } from "@/actions/jobsiteActions";
  import { useTranslations } from "next-intl";
  import { Forms } from "@/components/(reusable)/forms";
  import { Labels } from "@/components/(reusable)/labels";
  import { Inputs } from "@/components/(reusable)/inputs";
  import { TextAreas } from "@/components/(reusable)/textareas";


  const AddJobsiteForm: React.FC<{}> = () => {
  const t = useTranslations("addJobsiteForm");
  const [qrCode, setQrCode] = useState("");

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

  return (
    <Forms action={createJobsite} variant="default" size="default">
      <Labels variant="default" size="default" > Temporary Site ID </Labels>
      <Inputs id="id" name="id" type="text" value={qrCode} disabled />

        <Labels variant="default" size="default" >
          {t("Name")}
          </Labels> 
        <Inputs
          id="jobsite_name"
          name="jobsite_name"
          type="text"
        
        />
      
      <Labels variant="default" size="default" >
          {t("StreetNumber")}
          </Labels> 
        <Inputs
          variant={"default"}
          id="street_number"
          name="street_number"
        />
      
      
      <Labels variant="default" size="default" >
          {t("StreetName")}
          </Labels> 
          <Inputs
          variant={"default"}
          id="street_name"
          name="street_name"
        
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
          id="jobsite_description"
          name="jobsite_description"
          placeholder="Provide a description of the jobsite and the purpose for adding it."
        />
      
      
        <Labels variant="default" size="default" > 
          {t("Comments")}
        </Labels>
          <TextAreas
          id="jobsite_comments"
          name="jobsite_comments"
        
        />
      
      <Buttons variant="green" size="default" type="submit">
        {t("Submit")}
      </Buttons>
    </Forms>
  );
  };
  export default AddJobsiteForm;
