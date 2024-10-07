"use client";
import React, { useEffect, useState } from "react";
import { Modals } from "@/components/(reusable)/modals";
import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";

export default function SignOutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Hamburger");

  const signoutHandler = () => {
    setIsOpen(false);
  };

  return (
    <Holds className="py-5">
      <Holds size={"full"}>
        <Buttons
          onClick={() => setIsOpen(true)}
          background={"red"}
          size={"full"}
          className="py-2"
        >
          <p>{t("SignOut")}</p>
        </Buttons>
      </Holds>

      <Modals
        handleClose={signoutHandler}
        isOpen={isOpen}
        type="signOut"
        variant={"default"}
        size={"sm"}
      >
        {t("SignOutConfirmation")}
      </Modals>
    </Holds>
  );
}
