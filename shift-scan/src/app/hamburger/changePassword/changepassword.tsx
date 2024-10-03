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
import PasswordStrengthIndicator from "@/components/(signup)/passwordStrengthIndicator";

export default function ChangePassword({ userId }: { userId: string }) {
  const t = useTranslations("Hamburger");
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const route = useRouter();

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 5000); // Banner disappears after 5 seconds

      return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    }
  }, [showBanner]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validatePassword(newPassword)) {
      setBannerMessage(
        "Password must be at least 6 characters long, contain at least 1 number, 1 symbol."
      );
      setShowBanner(true);
      setNewPassword("");
      setConfirmPassword("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setBannerMessage("Passwords do not match!");
      setShowBanner(true);
      setNewPassword("");
      setConfirmPassword("");
      return;
    }
    const formData = new FormData(event.currentTarget);
    const hashed = await hash(newPassword, 10);
    console.log(formData);
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
    const minLength = 6;
    const hasNumber = /\d/;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      password.length >= minLength &&
      hasNumber.test(password) &&
      hasSymbol.test(password)
    );
  };

  return (
    <Holds className="row-span-7 h-full">
      <Forms
        onSubmit={handleSubmit}
        className="h-full flex flex-col items-center justify-between"
      >
        <Grids className="grid grid-rows-10 gap-4 w-full">
          {/* Start of grid container 1 rows - 10 */}
          {showBanner ? (
            <Holds
              background={"red"}
              position={"center"}
              size={"full"}
              className="py-2"
            >
              <Texts size={"p6"}>{bannerMessage}</Texts>
            </Holds>
          ) : (
            <Holds position={"center"} size={"full"} className="row-span-1">
              <Texts size={"p6"}></Texts>
            </Holds>
          )}
          <Holds className="h-full row-span-5" background={"white"}>
            <Contents width={"section"}>
              <Holds>
                <Holds className="py-4">
                  <Titles>Secure your account</Titles>
                </Holds>
                <Holds>
                  <Texts size={"p5"}>
                    Password must be at least 8 characters long, and include 1
                    symbol and 1 number.
                  </Texts>
                </Holds>
              </Holds>
              <Holds className="my-auto">
                <Labels htmlFor="new-password">
                  {t("NewPassword")}
                  <Inputs
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Labels>
                <Holds>
                  <Holds>
                    <PasswordStrengthIndicator password={newPassword} />
                  </Holds>
                </Holds>
              </Holds>
            </Contents>
          </Holds>

          <Holds className="h-full row-span-3" background={"white"}>
            <Contents width={"section"}>
              <Holds className="my-auto">
                <Labels htmlFor="confirm-password">
                  {t("ConfirmPassword")}
                </Labels>
                <Inputs
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Holds>
            </Contents>
          </Holds>
          <Holds className="h-full row-span-1">
            <Contents width={"section"}>
              <Buttons background={"orange"} className="py-2" type="submit">
                <Titles size={"h6"}>{t("ChangePassword")}</Titles>
              </Buttons>
            </Contents>
          </Holds>
          {/* End of grid container 1 rows - 10 */}
        </Grids>
      </Forms>
    </Holds>
  );
}
