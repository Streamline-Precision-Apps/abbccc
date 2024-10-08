"use client";
import React, { useEffect, useState } from "react";
import { Modals } from "@/components/(reusable)/modals";
import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";

import { Titles } from "@/components/(reusable)/titles";

export default function SignOutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Hamburger");

  const signoutHandler = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Holds className=" mt-10 ">
        <Buttons
          onClick={() => setIsOpen(true)}
          background={"red"}
          size={"full"}
          className="p-3 "
        >
          <Titles size={"h4"}>{t("SignOut")}</Titles>
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
    </>
  );
}
