"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";

export function RequestFooter({
  SubmitButton,
  handlePendingEdit,
}: {
  SubmitButton: boolean;
  handlePendingEdit: () => void;
}) {
  const t = useTranslations("Admins");
  return (
    <Holds background={"white"} className="w-full h-full col-span-2">
      <Grids cols={"5"} gap={"5"} className="w-full h-full p-3">
        <Buttons
          disabled={!SubmitButton}
          background={`${SubmitButton ? "green" : "grey"}`}
          className="col-start-5 col-end-6"
          onClick={() => handlePendingEdit()}
        >
          <Titles size={"h4"}>{t("Submit")}</Titles>
        </Buttons>
      </Grids>
    </Holds>
  );
}
