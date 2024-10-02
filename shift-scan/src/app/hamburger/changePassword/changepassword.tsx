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
    <Holds background={"white"} className="row-span-5 h-full">
      <Forms
        onSubmit={handleSubmit}
        className="h-full flex flex-col items-center justify-between my-5"
      >
        {showBanner ? (
          <Holds
            background={"green"}
            className="row-span-1"
            position={"center"}
            size={"full"}
          >
            <Labels>{bannerMessage}</Labels>
          </Holds>
        ) : (
          <Holds
            background={"white"}
            className="row-span-1"
            position={"center"}
            size={"full"}
          >
            <Labels></Labels>
          </Holds>
        )}
        <Holds size={"80"} className=" ">
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
        <Holds size={"80"} className="">
          <Labels htmlFor="confirm-password">{t("ConfirmPassword")}</Labels>
          <Inputs
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Holds>
        <Holds size={"40"} position={"center"} className="">
          <Buttons background={"orange"} className="p-2" type="submit">
            {t("ChangePassword")}
          </Buttons>
        </Holds>
      </Forms>
    </Holds>
  );
}
