"use client";
import { setUserPassword } from "@/actions/userActions";
import { useNotification } from "@/app/context/NotificationContext";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { hash } from "bcryptjs";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";

type Props = {
  setIsOpenChangePassword: () => void;
};
export default function PasswordModal({ setIsOpenChangePassword }: Props) {
  const t = useTranslations("Admins");
  const { setNotification } = useNotification();
  const { data: session } = useSession();
  const userId = session?.user.id;
  // change password modal props
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [eightChar, setEightChar] = useState(false);
  const [oneNumber, setOneNumber] = useState(false);
  const [oneSymbol, setOneSymbol] = useState(false);
  const [viewSecret1, setViewSecret1] = useState(false);
  const [viewSecret2, setViewSecret2] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      setBannerMessage(t("InvalidNewPassword"));
      setShowBanner(true);
      return;
    }

    if (confirmPassword.length === 0) {
      setBannerMessage(t("InvalidConfirmPassword"));
      setShowBanner(true);
      return;
    }

    if (!validatePassword(newPassword)) {
      setBannerMessage(t("InvalidPassword"));
      setShowBanner(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setBannerMessage(t("InvalidPasswordMatch"));
      setShowBanner(true);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const hashed = await hash(newPassword, 10);
    formData.append("id", userId ?? "");
    formData.append("password", hashed);

    if (userId === "") {
      setBannerMessage(t("InvalidUserEmpty"));
      setShowBanner(true);
      return;
    }
    try {
      await setUserPassword(formData);
      setIsOpenChangePassword();
      setNotification(t("PasswordUpdated"), "success");
    } catch (error) {
      console.error("Error updating password:", error);
      setNotification(t("PasswordNotUpdated"), "error");
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
  // end of change password modal
  return (
    <Holds background={"white"} className=" h-full px-4 ">
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
        <Grids rows={"6"} gap={"5"} className="h-full">
          {/* New password section */}

          <Holds background="white" className="row-span-2 h-full">
            <Contents width="section">
              <Holds className="my-auto w-full">
                <Holds position="row" className="">
                  <Labels htmlFor="new-password">{t("NewPassword")}</Labels>
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
              </Holds>
            </Contents>
          </Holds>

          {/* Confirm password section */}
          <Holds className="row-span-4 h-full" background="white">
            <Contents width="section">
              <Holds className="my-auto w-full">
                <Holds position="row" className="h-full">
                  <Labels htmlFor="confirm-password">
                    {t("ConfirmPassword")}
                  </Labels>
                  <Images
                    titleImg={viewSecret2 ? "/eye.svg" : "/eye-slash.svg"}
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
            </Contents>
          </Holds>
          <Holds background={"darkBlue"} className="row-span-1 h-full">
            <Texts position="left" text={"white"} size="p4">
              {t("PasswordStrength")}
            </Texts>
            <Holds background="white" className="rounded-xl h-full ">
              <Contents width={"section"}>
                <Holds position="row" className="my-auto">
                  <PasswordCriteria passed={oneNumber} label={t("Numbers")} />
                  <PasswordCriteria passed={oneSymbol} label={t("Symbols")} />
                  <PasswordCriteria passed={eightChar} label={t("Length")} />
                </Holds>
              </Contents>
            </Holds>
          </Holds>

          {/* Submit button section */}
          <Holds className="row-span-2 h-full">
            <Holds className="my-auto flex justify-between">
              <Contents width="section" className="flex gap-4">
                {/* Submit Button */}
                <Buttons background="green" type="submit" className="py-2">
                  <Titles size="h4">{t("ChangePassword")}</Titles>
                </Buttons>

                {/* Cancel Button */}
                <Buttons
                  background={"lightBlue"}
                  type="button" // Prevents triggering form submission
                  className="py-2"
                  onClick={() => {
                    // Logic to close the modal or reset form
                    setIsOpenChangePassword();
                  }}
                >
                  <Titles size="h4">{t("Cancel")}</Titles>
                </Buttons>
              </Contents>
            </Holds>
          </Holds>
        </Grids>
      </Forms>
    </Holds>
  );
}
