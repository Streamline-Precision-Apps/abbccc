"use client";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Buttons } from "@/components/(reusable)/buttons";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Forms } from "@/components/(reusable)/forms";
import { FormEvent, useEffect, useState, useRef } from "react";
import { setUserPassword } from "@/actions/userActions";
import { hash } from "bcryptjs";
import { useRouter } from "next/navigation";
import { Contents } from "@/components/(reusable)/contents";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Images } from "@/components/(reusable)/images";

const ResetPassword = ({   userId,
  handleNextStep,
} : {
  userId: string;
  handleNextStep: () => void}) => {
  const t = useTranslations("SignUpPassword");
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [eightChar, setEightChar] = useState(false);
  const [oneNumber, setOneNumber] = useState(false);
  const [oneSymbol, setOneSymbol] = useState(false);

  const [viewSecret1, setViewSecret1] = useState(false);
  const [viewSecret2, setViewSecret2] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const useFormRef = useRef<HTMLFormElement>(null);
  const route = useRouter();

  const viewPasscode1 = () => {
    setViewSecret1(!viewSecret1);
  };
  const viewPasscode2 = () => {
    setViewSecret2(!viewSecret2);
  };

  const handleSubmitClick = () => {
    useFormRef.current?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
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
      setBannerMessage(t("NewPasswordEmptyError"));
      setShowBanner(true);
      return;
    }

    if (confirmPassword.length === 0) {
      setBannerMessage(t("ConfirmPasswordEmptyError"));
      setShowBanner(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setBannerMessage(t("PasswordMismatchError"));
      setShowBanner(true);
      return;
    }

    if (!validatePassword(newPassword)) {
      setBannerMessage(t("PasswordLengthError"));
      setShowBanner(true);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const hashed = await hash(newPassword, 10);
    formData.append("id", userId);
    formData.append("password", hashed);

    try {
      await setUserPassword(formData);
      handleNextStep();
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
      <Holds
      background={passed ? "green" : "red"}
      className=" border-black border-[3px] rounded-[10px]"
      >
        <Texts size="p5" className="p-2">{label}</Texts>
      </Holds>
  );

  return (
    <Grids rows={"10"} gap={"5"} className="h-full mb-5">
      <Holds background={"white"} className="row-span-1 h-full justify-center">
        <Titles size={"h1"}>{t("ChoosePasswordTitle")}</Titles>
      </Holds>
      <Holds background={"white"} className="row-span-8 h-full p-3">
          <form
          ref={useFormRef}
          onSubmit={handleSubmit}
          className="h-full flex flex-col items-center"
          >
            {/* <Grids rows={"5"} gap={"5"} className="h-full"> */}
            <Contents width={"section"} className="">
                <Holds background={"white"}>
                  <Texts size="p2">{t("ChooseNewPassword")}</Texts>
                </Holds>
                <Holds background={"white"} className="my-5">
                  <Texts position="left" size="p4">{t("PasswordRequirements")}</Texts>
                  <Holds position="row" className="">
                    <PasswordCriteria passed={oneNumber} label={t("NumberRequirement")}/>
                    <PasswordCriteria passed={oneSymbol} label={t("SymbolRequirement")}/>
                    <PasswordCriteria passed={eightChar} label={t("LengthRequirement")}/>
                    </Holds>
                    {showBanner && (
                      <Contents width={"section"}>
                    <Holds
                    background="red"
                    size="full"
                    >
                      <Texts size="p6">{bannerMessage}</Texts>
                    </Holds>
                    </Contents>
                    )}
                </Holds>
                <Holds background={"white"} className="h-full">
                  <Holds position="row">
                    <Labels htmlFor="new-password">{t("NewPassword")}</Labels>
                    <Images
                    titleImg={viewSecret1 ? "/eye.svg" : "/eye-slash.svg"}
                    titleImgAlt={t("EyeImageAlt")}
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
                  <Holds position="row" className="">
                    <Labels htmlFor="confirm-password">{t("ConfirmPassword")}</Labels>
                    <Images
                    titleImg={viewSecret2 ? "/eye.svg" : "/eye-slash.svg"}
                    titleImgAlt={t("EyeImageAlt")}
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
              </Contents>
            {/* </Grids> */}
          </form>
        </Holds>
        <Holds className="row-span-1 h-full">
          <Buttons background={"orange"} onClick={() => handleSubmitClick()}>
          <Titles>{t("Next")}</Titles>
        </Buttons>
      </Holds>
    </Grids>
  );
};

export default ResetPassword;