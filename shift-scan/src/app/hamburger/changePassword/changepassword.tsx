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
    if (newPassword !== confirmPassword) {
      setBannerMessage("Passwords do not match!");
      setShowBanner(true);
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

  return (
    <Holds className="row-span-7 h-full">
      <Forms
        onSubmit={handleSubmit}
        className="h-full flex flex-col items-center justify-between my-5"
      >
        <Grids size={"settings"}>
          {showBanner ? (
            <Holds
              background={"red"}
              className="row-span-1"
              position={"center"}
              size={"full"}
            >
              <Labels>{bannerMessage}</Labels>
            </Holds>
          ) : null}
          <Holds className="h-full row-span-4" background={"white"}>
            <Contents width={"section"}>
              <Holds className="mt-auto mb-2 ">
                <Labels htmlFor="new-password">
                  {t("NewPassword")}
                  <Inputs
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Labels>
              </Holds>
              <Holds position={"row"} className="mb-auto grid grid-cols-10">
                <Holds className="col-span-2">
                  <Texts size={"p6"} position={"left"}>
                    Strength:
                  </Texts>
                </Holds>
                <Holds className="col-span-8 gap-1">
                  <Holds className="w-full">
                    <Holds
                      className="h-fit"
                      background={
                        newPassword.length < 8
                          ? "red"
                          : newPassword.length < 12
                          ? "orange"
                          : "green"
                      }
                      size={
                        newPassword.length < 8
                          ? "40"
                          : newPassword.length < 12
                          ? "60"
                          : "full"
                      }
                      position={"left"}
                    >
                      <Texts size={"p6"} position={"center"}>
                        {newPassword.length < 8
                          ? "Weak"
                          : newPassword.length < 12
                          ? "Medium"
                          : "Strong"}
                      </Texts>
                    </Holds>
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
              <Buttons background={"orange"} className="p-2" type="submit">
                <Titles>{t("ChangePassword")}</Titles>
              </Buttons>
            </Contents>
          </Holds>
        </Grids>
      </Forms>
    </Holds>
  );
}
