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
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import { CCTags } from "@/lib/types";
import { Selects } from "@/components/(reusable)/selects";

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
  const [tags, setTags] = useState<CCTags[]>([]);
  const [selectedTags, setSelectedTags] = useState<CCTags[]>([]);

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

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const allTagsRes = await fetch(`/api/getAllTags`);
        const allTags = await allTagsRes.json();
        setTags(allTags as CCTags[]);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const addTag = (tagId: string) => {
    const tag = tags.find((t) => t.id === tagId);
    if (tag && !selectedTags.some((t) => t.id === tagId)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const removeTag = (tagId: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  return (
    <Forms
      action={createJobsite}
      onSubmit={(e) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        // Add selectedTags to the FormData
        selectedTags.forEach((tag) => formData.append("tags", tag.id));

        setBanner(true);
        setBannerText("Created Jobsite Successfully");
        handler();

        // Call server action
        createJobsite(formData)
          .then(() => handleRoute())
          .catch((error) => {
            console.error("Error creating jobsite:", error);
            setBannerText("Error: Failed to create jobsite");
          });
      }}
    >
      <Holds background={"white"} className="my-5">
        <Contents width={"section"} className="mt-2 mb-5">
          <Labels size={"p4"}>
            {t("Temporary")}
            <Inputs id="qrId" name="qrId" type="text" value={qrCode} readOnly />
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
        </Contents>
      </Holds>
      <Holds background={"white"} className="my-5">
        <Contents width={"section"} className="mt-2 mb-5">
          <Titles size={"h3"} className="my-2">
            {t("AddressInformation")}
          </Titles>
          <Labels size={"p4"}>
            {t("Address")}
            <Inputs
              variant={"default"}
              id="address"
              name="address"
              placeholder={`${t("Address")} `}
            />
          </Labels>
          <Labels size={"p4"}>
            {t("City")}
            <Inputs
              variant={"default"}
              id="city"
              name="city"
              placeholder={t("CityTitle")}
            />
          </Labels>
          <Holds position={"row"} className="gap-3">
            <Holds>
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
            <Holds>
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
        </Contents>
      </Holds>

      <Holds background={"white"} className="my-5">
        <Contents width={"section"} className="mt-2 mb-5">
          <Titles size={"h3"} className="my-2">
            {t("SelectCostCodeTags")}
          </Titles>
          <Holds position={"row"} className="flex items-center gap-2">
            <Holds className="w-3/4">
              <Selects
                id="tags"
                name="tags"
                className="p-2 border rounded"
                onChange={(e) => addTag(e.target.value)}
              >
                <option value="">{t("SelectTag")}</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </Selects>
            </Holds>
            <Holds className="w-1/4">
              <Buttons
                type="button"
                background={"green"}
                className="p-2"
                onClick={() => {
                  const select = document.getElementById(
                    "tags"
                  ) as HTMLSelectElement;
                  if (select?.value) addTag(select.value);
                }}
              >
                {t("AddTag")}
              </Buttons>
            </Holds>
          </Holds>

          <Holds className="mt-4">
            <Holds className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map((tag) => (
                <Holds
                  position={"row"}
                  key={tag.id}
                  className=" gap-2 p-2 border rounded bg-gray-100 w-1/3"
                >
                  <Holds className="w-full">
                    <span>{tag.name}</span>
                  </Holds>
                  <Buttons
                    type="button"
                    onClick={() => removeTag(tag.id)}
                    background={"none"}
                    className="text-red-500 "
                  >
                    X
                  </Buttons>
                </Holds>
              ))}
            </Holds>
          </Holds>
        </Contents>
      </Holds>
      <Holds background={"white"} className="my-5">
        <Contents width={"section"} className="mt-2 mb-5">
          <Titles size={"h3"} className="my-2">
            {t("Description")}
          </Titles>
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
        </Contents>
      </Holds>
      <Holds>
        <Contents width={"section"} className="my-5">
          <Buttons background={"green"} type="submit" className="p-2">
            <Titles size={"h3"}>{t("CreateNew")}</Titles>
          </Buttons>
        </Contents>
      </Holds>
    </Forms>
  );
}
