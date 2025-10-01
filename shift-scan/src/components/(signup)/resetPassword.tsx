"use client";
import { useTranslations } from "next-intl";
import { Holds } from "@/components/(reusable)/holds";
import { Labels } from "@/components/(reusable)/labels";
import { FormEvent, useEffect, useState, useRef } from "react";
import { setUserPassword } from "@/actions/userActions";
import { hash } from "bcryptjs";
// import { useRouter } from "next/navigation";
import { Texts } from "@/components/(reusable)/texts";
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
  // Shared password scoring function (copied from changePassword)
  function getPasswordScore(password: string) {
    let score = 0;
    if (password.length >= 8) score++; // Length
    if (/[A-Z]/.test(password)) score++; // Uppercase letters
    if (/[a-z]/.test(password)) score++; // Lowercase letters
    if (/[0-9]/.test(password)) score++; // Number
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++; // Special character
    return score;
  }

  const t = useTranslations("SignUpPassword");
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [score, setScore] = useState(0);
  const [eightChar, setEightChar] = useState(false);
  const [oneNumber, setOneNumber] = useState(false);
  const [oneSymbol, setOneSymbol] = useState(false);
  const [oneCapital, setOneCapital] = useState(false);
  const [oneLower, setOneLower] = useState(false);

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
      new Event("submit", { bubbles: true, cancelable: true }),
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
        "There was an error updating your password. Please try again.",
      );
      setShowBanner(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validatePassword = (password: string) => {
    // Updated to use password score like in changePassword
    return getPasswordScore(password) >= 3;
  };

  const handlePasswordChange = (
    password: string,
    confirmPasswordValue: string,
  ) => {
    // Updated to match changePassword validation criteria
    setEightChar(password.length >= 8);
    setOneNumber(/\d/.test(password));
    setOneSymbol(/[!@#$%^&*(),.?":{}|<>]/.test(password));
    setOneCapital(/[A-Z]/.test(password));
    setOneLower(/[a-z]/.test(password));

    // Ready to submit if score >= 3 and passwords match
    if (getPasswordScore(password) >= 3 && password === confirmPasswordValue) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  };

  // PasswordStrengthBar component (copied from changePassword)
  function PasswordStrengthBar({ password }: { password: string }) {
    // Use shared scoring function
    const score = getPasswordScore(password);
    const colors = [
      "bg-gray-400",
      "bg-red-400",
      "bg-orange-400",
      "bg-yellow-400",
      "bg-green-400",
      "bg-green-600",
    ];
    const labels = [
      "Strength",
      "Very Weak",
      "Weak",
      "Fair",
      "Strong",
      "Very Strong",
    ];

    // Update parent score state using useEffect to avoid setState during render
    useEffect(() => {
      setScore(score);
    }, [score]);

    return (
      <div className="w-full flex flex-col gap-1" aria-live="polite">
        <div className="w-full h-2 rounded bg-gray-200 overflow-hidden">
          <div
            className={`h-2 rounded transition-all duration-300 ${colors[score]}`}
            style={{ width: `${(score / 5) * 100}%` }}
          ></div>
        </div>
        <span className={`text-xs font-medium text-right text-opacity-80`}>
          {labels[score]}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-[100vh] overflow-y-auto flex flex-col gap-1">
      <div className="w-full h-[10vh] flex flex-col justify-end gap-1 pb-4">
        <Texts text={"white"} className="justify-end" size={"sm"}>
          {t("ChoosePasswordTitle")}
        </Texts>
      </div>
      <div className="h-[90vh] flex flex-col bg-white border border-zinc-300 p-4 overflow-y-auto no-scrollbar">
        <div className="max-w-[600px] w-[95%] px-2 flex flex-col mx-auto h-full gap-4">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          <form
            ref={useFormRef}
            onSubmit={handleSubmit}
            className="h-full max-h-[50vh] flex flex-col items-center"
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
                  setNewPassword(e.target.value);
                  handlePasswordChange(e.target.value, confirmPassword);
                }}
                autoCapitalize={"off"}
              />

              {/* Password Strength Bar */}
              <div className="w-full pb-1 mt-2">
                <PasswordStrengthBar password={newPassword} />
              </div>

              <ul className="list-disc list-inside">
                <li
                  className={`flex items-center gap-2 text-xs transition-colors duration-200 ${oneCapital ? "text-green-600 " : "text-red-600"}`}
                  aria-live="polite"
                >
                  {oneCapital ? (
                    <span aria-label="Has capital letter">✓</span>
                  ) : (
                    <span aria-label="Missing capital letter">✗</span>
                  )}
                  {t("CapitalCriteriaLabel") || "At least one capital letter"}
                </li>
                <li
                  className={`flex items-center gap-2 text-xs transition-colors duration-200 ${oneLower ? "text-green-600 " : "text-red-600"}`}
                  aria-live="polite"
                >
                  {oneLower ? (
                    <span aria-label="Has lowercase letter">✓</span>
                  ) : (
                    <span aria-label="Missing lowercase letter">✗</span>
                  )}
                  {t("LowerCriteriaLabel") || "At least one lowercase letter"}
                </li>
                <li
                  className={`flex items-center gap-2 text-xs transition-colors duration-200 ${oneNumber ? "text-green-600 " : "text-red-600"}`}
                  aria-live="polite"
                >
                  {oneNumber ? (
                    <span aria-label="Has number">✓</span>
                  ) : (
                    <span aria-label="Missing number">✗</span>
                  )}
                  {t("NumberCriteriaLabel") || "At least one number"}
                </li>
                <li
                  className={`flex items-center gap-2 text-xs transition-colors duration-200 ${oneSymbol ? "text-green-600 " : "text-red-600"}`}
                  aria-live="polite"
                >
                  {oneSymbol ? (
                    <span aria-label="Has special character">✓</span>
                  ) : (
                    <span aria-label="Missing special character">✗</span>
                  )}
                  {t("SpecialCharacterCriteriaLabel") ||
                    "At least one special character"}
                </li>
                <li
                  className={`flex items-center gap-2 text-xs transition-colors duration-200 ${eightChar ? "text-green-600 " : "text-red-600"}`}
                  aria-live="polite"
                >
                  {eightChar ? (
                    <span aria-label="Has minimum length">✓</span>
                  ) : (
                    <span aria-label="Too short">✗</span>
                  )}
                  {t("LengthCriteriaLabel") || "At least 8 characters"}
                </li>
              </ul>

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
                  handlePasswordChange(newPassword, e.target.value);
                }}
                autoCapitalize={"off"}
              />
              <ul className="list-disc list-inside mt-1">
                <li
                  className={`flex items-center gap-2 text-xs transition-colors duration-200 ${newPassword && confirmPassword && newPassword === confirmPassword ? "text-green-600" : "text-red-600"}`}
                  aria-live="polite"
                >
                  {newPassword &&
                  confirmPassword &&
                  newPassword === confirmPassword ? (
                    <span aria-label="Passwords match">✓</span>
                  ) : (
                    <span aria-label="Passwords do not match">✗</span>
                  )}
                  {t("PasswordsMatch")}
                </li>
              </ul>
            </Holds>
          </form>

          <div className="flex flex-col mb-4">
            <Button
              className={isPasswordValid ? "bg-app-dark-blue" : "bg-gray-400"}
              onClick={handleSubmitPassword}
              disabled={isSubmitting || !isPasswordValid}
            >
              <p className="text-white font-semibold text-base">
                {isSubmitting ? `${t("Submitting")}` : `${t("Next")}`}
              </p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
