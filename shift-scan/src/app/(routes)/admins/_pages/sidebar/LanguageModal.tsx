"use client";
"use client";
import { setLocale } from "@/actions/cookieActions";
import { setUserLanguage } from "@/actions/userActions";
import { Buttons } from "@/components/(reusable)/buttons";
import { Forms } from "@/components/(reusable)/forms";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useSession } from "next-auth/react";
import { useState, useEffect, FormEvent } from "react";

type Props = {
  setIsOpenLanguageSelector: () => void;
};

export default function LanguageModal({ setIsOpenLanguageSelector }: Props) {
  const { data: session } = useSession();
  const userId = session?.user.id;
  // language selector modal
  const [language, setLanguage] = useState("en");
  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const response = await fetch(`/api/getSettings`);
        if (response.ok) {
          const data = await response.json();
          setLanguage(data.language);
        } else {
          console.error("Error fetching language:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching language:", error);
      }
    };
    fetchLanguage();
  }, [userId]);

  const handleLanguageChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("id", userId ?? "");
    const response = await setUserLanguage(formData);
    if (response === "en") {
      await setLocale(false);
    } else {
      await setLocale(true);
    }
    setIsOpenLanguageSelector();
  };

  // end of language selector modal

  return (
    <Holds background={"white"} className=" h-full w-full p-4">
      <Forms onSubmit={handleLanguageChange} className="h-full w-full">
        <Texts size={"p4"} className="mb-4">
          Select A Language
        </Texts>
        <Holds className="my-auto h-1/3">
          <Selects
            id="language"
            name="language"
            className="w-full"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
            }}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </Selects>
        </Holds>
        <Holds className="flex justify-between gap-5">
          <Buttons background={"green"} type="submit" className="py-2">
            <Titles size="h4">Change Language</Titles>
          </Buttons>
          <Buttons
            background={"lightBlue"}
            type="button" // Prevents triggering form submission
            className="py-2"
            onClick={() => {
              // Logic to close the modal or reset form
              setIsOpenLanguageSelector();
            }}
          >
            <Titles size="h4">Cancel</Titles>
          </Buttons>
        </Holds>
      </Forms>
    </Holds>
  );
}
