"use client";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Buttons } from "@/components/(reusable)/buttons";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { FormEvent, useEffect, useState, useRef } from "react";
import { setUserPassword } from "@/actions/userActions";
import { hash } from "bcryptjs";
// import { useRouter } from "next/navigation";
import { Contents } from "@/components/(reusable)/contents";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Images } from "@/components/(reusable)/images";
import { ProgressBar } from "./progressBar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const ResetPassword = ({
  userId,
  handleNextStep,
  totalSteps,
  currentStep,
}: {
  userId: string;
  handleNextStep: () => void;
  totalSteps: number;
  currentStep: number;
}) => {
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

  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const viewPasscode1 = () => {
    setViewSecret1(!viewSecret1);
  };
  const viewPasscode2 = () => {
    setViewSecret2(!viewSecret2);
  };

  const handleSubmitPassword = () => {
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

    setIsSubmitting(true);
    try {
      await setUserPassword(formData);
      handleNextStep(); // Proceed to the next step only if the image upload is successful
    } catch (error) {
      console.error("Error updating password:", error);
      setBannerMessage(
        "There was an error updating your password. Please try again."
      );
      setShowBanner(true);
    } finally {
      setIsSubmitting(false);
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
      className="h-full first:mr-1 last:ml-1 border-black border-[3px] rounded-[10px] justify-center"
    >
      <Texts size="p5" className="p-2">
        {label}
      </Texts>
    </Holds>
  );

  const handlePasswordValid = () => {
    const passed = eightChar && oneNumber && oneSymbol;
    if (!passed) {
      setIsPasswordValid(false);
      return;
    }

    setIsPasswordValid(true);
  };

  return (
    <div className="w-screen h-screen grid grid-rows-10 gap-1">
      <div className="h-full flex flex-col justify-end row-span-2 gap-1 pb-4">
        <Texts text={"white"} className="justify-end" size={"sm"}>
          {t("ChoosePasswordTitle")}
        </Texts>
      </div>
      <div className="h-full row-span-8 flex flex-col bg-white border border-zinc-300 p-4 ">
        <div className="max-w-[600px] w-full flex flex-col mx-auto h-full gap-4">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          <form
            ref={useFormRef}
            onSubmit={handleSubmit}
            className="h-full flex flex-col items-center"
          >
            <Holds background={"white"} className="h-full">
              <Holds position="row">
                <Labels size={"p3"} htmlFor="new-password">
                  {t("NewPassword")}
                </Labels>
                <Images
                  titleImg={viewSecret1 ? "/eye.svg" : "/eyeSlash.svg"}
                  titleImgAlt={t("EyeImageAlt")}
                  background="none"
                  size="10"
                  onClick={viewPasscode1}
                />
              </Holds>
              <Input
                type={viewSecret1 ? "text" : "password"}
                id="new-password"
                value={newPassword}
                onChange={(e) => {
                  handlePasswordChange(e.target.value);
                  setNewPassword(e.target.value);
                  handlePasswordValid();
                }}
                autoCapitalize={"off"}
              />
              {/* Password requirements message */}
              {newPassword && (!eightChar || !oneNumber || !oneSymbol) && (
                <div className="text-xs text-red-600 mt-1">
                  {t("PasswordRequirements")}
                  <ul className="list-disc ml-5">
                    {!eightChar && <li>{t("LengthRequirement")}</li>}
                    {!oneNumber && <li>{t("NumberRequirement")}</li>}
                    {!oneSymbol && <li>{t("SymbolRequirement")}</li>}
                  </ul>
                </div>
              )}
              <div className="my-4" />
              <Holds position="row" className="">
                <Labels size={"p3"} htmlFor="confirm-password">
                  {t("ConfirmPassword")}
                </Labels>
                <Images
                  titleImg={viewSecret2 ? "/eye.svg" : "/eyeSlash.svg"}
                  titleImgAlt={t("EyeImageAlt")}
                  background="none"
                  size="10"
                  onClick={viewPasscode2}
                />
              </Holds>
              <Input
                type={viewSecret2 ? "text" : "password"}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  handlePasswordValid();
                }}
                autoCapitalize={"off"}
              />
              {/* Confirm password match message */}
              {confirmPassword && newPassword !== confirmPassword && (
                <div className="text-xs text-red-600 mt-1">
                  {t("PasswordMismatchError")}
                </div>
              )}
            </Holds>
          </form>

          <div>
            <Button
              size={"lg"}
              onClick={() => handleSubmitPassword()}
              className="bg-app-dark-blue text-white rounded-lg p-2 w-full"
              disabled={isSubmitting} // Disable the button while submitting
            >
              <p>{isSubmitting ? `${t("Submitting")}` : `${t("Next")}`}</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
