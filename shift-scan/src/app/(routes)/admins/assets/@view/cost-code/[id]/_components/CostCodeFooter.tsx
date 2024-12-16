"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";

export function EditCostCodeFooter({
  handleEditForm,
  deleteCostCode,
}: {
  handleEditForm: () => void;
  deleteCostCode: () => void;
}) {
  const t = useTranslations("Admins");
  return (
    <Holds
      background={"white"}
      className="w-full h-full row-span-1 col-span-2 "
    >
      <Grids cols={"4"} gap={"4"} className="w-full h-full p-4">
        <Holds className=" col-start-1 col-end-2 ">
          <Buttons
            background={"red"}
            className="py-2"
            onClick={() => {
              deleteCostCode();
            }}
          >
            <Titles size={"h6"}>{t("DeleteCostCode")}</Titles>
          </Buttons>
        </Holds>

        <Holds className="col-start-4 col-end-5 ">
          <Buttons
            className={"py-2 bg-app-green"}
            onClick={() => handleEditForm()}
          >
            <Titles size={"h6"}>{t("SubmitEdit")}</Titles>
          </Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}
