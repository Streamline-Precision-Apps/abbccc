"use client";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Buttons } from "@/components/(reusable)/buttons";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Forms } from "@/components/(reusable)/forms";
import { FormEvent, useEffect, useState } from "react";
import { setUserPassword } from "@/actions/userActions";
import { hash } from "bcryptjs";
import { useRouter } from "next/navigation";
import { Contents } from "@/components/(reusable)/contents";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Images } from "@/components/(reusable)/images";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";

export default function ChangePassword({ userId }: { userId: string }) {
  const t = useTranslations("Hamburger");
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [eightChar, setEightChar] = useState(false);
  const [oneNumber, setOneNumber] = useState(false);
  const [oneSymbol, setOneSymbol] = useState(false);

  const [viewSecret1, setViewSecret1] = useState(false);
  const [viewSecret2, setViewSecret2] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const route = useRouter();

  const viewPasscode1 = () => {
    setViewSecret1(!viewSecret1);
  };
  const viewPasscode2 = () => {
    setViewSecret2(!viewSecret2);
  };

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 8000); // Banner disappears after 5 seconds

      return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    }
  }, [showBanner]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword.length === 0) {
      setBannerMessage("Invalid. New Password cannot be empty.");
      setShowBanner(true);
      return;
    }

    if (confirmPassword.length === 0) {
      setBannerMessage("Invalid. Confirm Password cannot be empty.");
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

    if (newPassword !== confirmPassword) {
      setBannerMessage("Invalid. Passwords do not match!");
      setShowBanner(true);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const hashed = await hash(newPassword, 10);
    formData.append("id", userId);
    formData.append("password", hashed);

    try {
      await setUserPassword(formData);
      route.push("/hamburger/settings");
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
    <Holds position="row" className="space-x-2">
      <Holds
        background={passed ? "green" : "red"}
        className="w-1 rounded-full my-auto"
      ></Holds>
      <Texts size="p6">{label}</Texts>
    </Holds>
  );

  return (
    <>
      <Holds
        background={"white"}
        size={"full"}
        className="row-start-1 row-end-2 h-full"
      >
        <TitleBoxes>
          <Holds position={"row"} className="w-full justify-center ">
            <Titles size={"h2"}>Change Password</Titles>
            <Images
              titleImg="/key.svg"
              titleImgAlt="Change Password Icon"
              className=" w-8 h-8 pl-2"
            />
          </Holds>
        </TitleBoxes>
      </Holds>
      <Holds className=" row-start-2 row-span-8 h-full ">
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
            <Holds background={"white"} className="w-full h-full">
              <Contents width={"section"}>
                <Grids rows={"7"} gap={"5"} className="h-full py-5">
                  {/* New password section */}
                  <Holds background={"darkBlue"} className="row-span-1 h-full">
                    <Texts position="left" text={"white"} size="p6">
                      Password Strength Criteria:
                    </Texts>
                    <Holds
                      background="white"
                      className="rounded-xl h-full mt-2 "
                    >
                      <Contents width={"section"}>
                        <Holds position="row" className="my-auto">
                          <PasswordCriteria passed={oneNumber} label="123" />
                          <PasswordCriteria passed={oneSymbol} label="Symbol" />
                          <PasswordCriteria
                            passed={eightChar}
                            label="(8) Length"
                          />
                        </Holds>
                      </Contents>
                    </Holds>
                  </Holds>
                  <Holds
                    background="white"
                    className="row-start-2 row-end-7 h-full"
                  >
                    <Holds className=" w-full pb-4">
                      <Holds position="row" className="w-full">
                        <Labels size={"p4"} htmlFor="new-password">
                          {t("NewPassword")}
                        </Labels>
                        <Images
                          titleImg={viewSecret1 ? "/eye.svg" : "/eyeSlash.svg"}
                          titleImgAlt="eye"
                          background="none"
                          size="10"
                          position="right"
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
                    </Holds>
                    <Holds className="w-full">
                      <Holds position="row" className="h-full">
                        <Labels size={"p4"} htmlFor="confirm-password">
                          {t("ConfirmPassword")}
                        </Labels>
                        <Images
                          titleImg={viewSecret2 ? "/eye.svg" : "/eyeSlash.svg"}
                          titleImgAlt="eye"
                          background="none"
                          size="10"
                          onClick={viewPasscode2}
                        />
                      </Holds>
                      <Inputs
                        type={viewSecret2 ? "text" : "password"}
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Holds>
                  </Holds>

                  {/* Confirm password section */}

                  {/* Submit button section */}
                  <Holds className="row-start-7 row-end-8">
                    <Buttons background="orange" type="submit" className="py-2">
                      <Titles size="h4">{t("ChangePassword")}</Titles>
                    </Buttons>
                  </Holds>
                </Grids>
              </Contents>
            </Holds>
          </Forms>
        </Holds>
      </Holds>
    </>
  );
}
