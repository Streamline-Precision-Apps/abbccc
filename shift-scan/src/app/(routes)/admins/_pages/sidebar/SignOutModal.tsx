"use client";
import { signOut } from "next-auth/react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";

type Props = {
  setIsOpenSignOut: () => void;
};
export default function SignOutModal({ setIsOpenSignOut }: Props) {
  const t = useTranslations("Admins");
  return (
    <Holds background={"white"} className=" h-full p-4">
      <Holds className="my-auto h-1/3">
        <Texts size={"p4"} className="mb-4">
          {t("SignOutQuestion")}
        </Texts>
      </Holds>
      <Holds className=" flex flex-row gap-10">
        <Buttons
          type="button"
          onClick={async () => {
            setIsOpenSignOut(); // Close the modal
            await signOut({
              redirect: true,
              callbackUrl: "/signin", // Specify the redirection URL
            });
          }}
          className="close-btn"
          background={"green"}
          size={"full"}
        >
          <Titles size={"h3"}>{t("Yes")}</Titles>
        </Buttons>
        <Buttons
          type="button"
          onClick={() => setIsOpenSignOut()}
          className="close-btn"
          background={"red"}
          size={"full"}
        >
          <Titles size={"h3"}>{t("Cancel")}</Titles>
        </Buttons>
      </Holds>
    </Holds>
  );
}
