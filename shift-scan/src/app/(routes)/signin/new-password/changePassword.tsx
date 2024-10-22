"use client";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Buttons } from "@/components/(reusable)/buttons";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Forms } from "@/components/(reusable)/forms";
import { FormEvent, useEffect, useState } from "react";
import { hash } from "bcryptjs";
import { useRouter } from "next/navigation";
import { Contents } from "@/components/(reusable)/contents";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Images } from "@/components/(reusable)/images";
import { useSearchParams } from "next/navigation";
import { resetUserPassword } from "@/actions/reset";

export default function ChangePassword() {
  const t = useTranslations("Hamburger");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [eightChar, setEightChar] = useState(false);
  const [oneNumber, setOneNumber] = useState(false);
  const [oneSymbol, setOneSymbol] = useState(false);

  const [viewSecret1, setViewSecret1] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const route = useRouter();

  const viewPasscode1 = () => {
    setViewSecret1(!viewSecret1);
  };

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 8000); // Banner disappears after 5 seconds

      return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    }
  }, [showBanner]);

  // add this to validate they have a token for the request
  if (!token) {
    //     route.push("/signin");
    //     return null;
  }
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword.length === 0) {
      setBannerMessage("Invalid. New Password cannot be empty.");
      setShowBanner(true);
      return;
    }

    if (!validatePassword(newPassword)) {
      setBannerMessage(
        "Invalid. Password must be at least 8 characters long, contain 1 number, and 1 symbol."
      );
      setShowBanner(true);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const hashed = await hash(newPassword, 10);
    // formData.append("id", userId ?? "");
    formData.append("token", token ?? "");
    formData.append("password", hashed);

    try {
      await resetUserPassword(formData);
      route.push("/signin");
    } catch (error) {
      console.error("Error updating password:", error);
      setBannerMessage(
        "There was an error updating your password. Please try again."
      );
      setShowBanner(true);
    }
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      password.length >= minLength &&
      hasNumber.test(password) &&
      hasSymbol.test(password)
    );
  };

  const handlePasswordChange = (password: string) => {
    setEightChar(password.length >= 8);
    setOneNumber(/\d/.test(password));
    setOneSymbol(/[!@#$%^&*(),.?":{}|<>]/.test(password));
  };

  const PasswordCriteria = ({
    passed,
    label,
  }: {
    passed: boolean;
    label: string;
  }) => (
    <Holds position="row" className="space-x-4">
      <Holds
        background={passed ? "green" : "red"}
        className="w-1 rounded-full my-auto"
      ></Holds>
      <Texts size="p6">{label}</Texts>
    </Holds>
  );

  return (
    <Holds className="h-full">
      <Forms
        onSubmit={handleSubmit}
        className="h-full flex flex-col items-center justify-between"
      >
        {showBanner && (
          <Holds
            background="red"
            position="absolute"
            size="full"
            className="rounded-none"
          >
            <Texts size="p6">{bannerMessage}</Texts>
          </Holds>
        )}

        {/* Start of grid container */}
        <Grids className="grid grid-rows-9 gap-4 w-full">
          {/* New password section */}
          <Holds className="row-span-5 h-full" background="white">
            <Contents width="section">
              <Holds className="my-auto h-full">
                <Holds position="row">
                  <Labels htmlFor="new-password" className="py-2">
                    {t("NewPassword")}
                  </Labels>
                  <Images
                    titleImg={viewSecret1 ? "/eye.svg" : "/eye-slash.svg"}
                    titleImgAlt="eye"
                    background="none"
                    size="10"
                    onClick={viewPasscode1}
                  />
                </Holds>
                <Inputs
                  type={viewSecret1 ? "text" : "password"}
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => {
                    handlePasswordChange(e.target.value);
                    setNewPassword(e.target.value);
                  }}
                />
                <Holds background={"darkBlue"}>
                  <Texts position="left" text={"white"} size="p3">
                    Password Strength:
                  </Texts>

                  <Holds
                    background="white"
                    className="justify-between my-auto p-2 rounded"
                  >
                    <PasswordCriteria passed={oneNumber} label="123" />
                    <PasswordCriteria passed={oneSymbol} label="Symbol" />
                    <PasswordCriteria passed={eightChar} label="(8) Length" />
                  </Holds>
                </Holds>
              </Holds>
            </Contents>
          </Holds>

          {/* Submit button section */}
          <Holds className="row-span-2 h-full ">
            <Holds className="my-auto">
              <Contents width="section">
                <Buttons background="orange" type="submit" className="py-2">
                  <Titles size="h4">{t("ChangePassword")}</Titles>
                </Buttons>
              </Contents>
            </Holds>
          </Holds>
        </Grids>
      </Forms>
    </Holds>
  );
}
