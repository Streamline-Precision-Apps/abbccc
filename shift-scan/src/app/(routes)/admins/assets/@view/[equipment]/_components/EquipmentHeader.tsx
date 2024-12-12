"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { Dispatch, SetStateAction, use, useState } from "react";
import { useTranslations } from "next-intl";

type EquipmentHeaderProps = {
  comment?: string;
  equipmentName?: string;
  setComment?: Dispatch<SetStateAction<string>>;
  setEquipmentName?: Dispatch<SetStateAction<string>>;
  isFieldChanged: (
    field:
      | "equipmentName"
      | "equipmentTag"
      | "make"
      | "model"
      | "year"
      | "licensePlate"
      | "registrationExpiration"
      | "mileage"
      | "equipmentStatus"
      | "equipmentDescription"
      | "equipmentCode"
  ) => boolean;
  revertField: (
    field:
      | "equipmentName"
      | "equipmentTag"
      | "make"
      | "model"
      | "year"
      | "licensePlate"
      | "registrationExpiration"
      | "mileage"
      | "equipmentStatus"
      | "equipmentDescription"
      | "equipmentCode"
  ) => void;
};

export function EquipmentHeader({
  comment,
  equipmentName,
  setComment,
  setEquipmentName,
  isFieldChanged,
  revertField,
}: EquipmentHeaderProps) {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const t = useTranslations("Admins");

  const openComment = () => {
    setIsCommentSectionOpen(!isCommentSectionOpen);
  };

  return (
    <Holds
      background={"white"}
      className={
        isCommentSectionOpen
          ? `row-start-1 row-end-4 col-span-2 h-full`
          : `row-start-1 row-end-2 col-span-2 h-full`
      }
    >
      <Holds position={"row"} className="h-full w-full">
        {isCommentSectionOpen ? (
          <Contents width={"95"} className="h-full py-5">
            <Grids rows={"5"} cols={"5"} gap={"5"} className="h-full w-full">
              <Holds className="w-full row-start-1 row-end-2 col-start-1 col-end-4">
                <Holds
                  className="w-full h-full border-[3px] rounded-[10px] border-black"
                  position={"row"}
                >
                  <Holds className="w-5/6 h-full">
                    <Inputs
                      type="text"
                      name="equipmentName"
                      value={equipmentName}
                      minLength={3}
                      maxLength={100}
                      pattern="[A-Za-z0-9\s]+"
                      onChange={(e) => {
                        setEquipmentName?.(e.target.value);
                      }}
                      placeholder={"New Equipment Name"}
                      variant={"matchSelects"}
                      className="my-auto border-none focus:outline-none pl-2"
                    />
                  </Holds>
                  <Holds className="w-1/6 h-full">
                    {isFieldChanged("equipmentName") && (
                      <Images
                        titleImg="/turnBack.svg"
                        titleImgAlt="revert"
                        size={"30"}
                        onClick={() => revertField("equipmentName")}
                        className="cursor-pointer ml-2"
                      />
                    )}
                  </Holds>
                </Holds>
              </Holds>
              <Holds
                position={"row"}
                className="h-full w-full my-1 row-start-2 row-end-3 col-start-1 col-end-2 "
              >
                <Texts size={"p6"} className="mr-2">
                  {t("Comment")}
                </Texts>
                <Images
                  titleImg="/comment.svg"
                  titleImgAlt="comment"
                  size={"30"}
                  onClick={openComment}
                  className="cursor-pointer hover:shadow-black hover:shadow-md"
                />
              </Holds>
              <Holds className="w-full h-full row-start-3 row-end-6 col-start-1 col-end-6">
                <TextAreas
                  placeholder={t("EnterComment")}
                  value={comment}
                  onChange={(e) => {
                    setComment?.(e.target.value);
                  }}
                  maxLength={40}
                  rows={3}
                  style={{ resize: "none" }}
                />
              </Holds>
            </Grids>
          </Contents>
        ) : (
          <Contents width={"95"} className="h-full py-5">
            <Grids
              rows={"2"}
              cols={"5"}
              gap={"4"}
              className=" h-full w-full p-4"
            >
              <Holds className="w-full row-start-1 row-end-2 col-start-1 col-end-4">
                <Holds
                  className="w-full h-full border-[3px] rounded-[10px] border-black"
                  position={"row"}
                >
                  <Holds className="w-5/6 h-full">
                    <Inputs
                      type="text"
                      name="equipmentName"
                      value={equipmentName}
                      onChange={(e) => {
                        setEquipmentName?.(e.target.value);
                      }}
                      pattern="[A-Za-z0-9\s]+"
                      minLength={3}
                      maxLength={100}
                      placeholder={"New Equipment Name"}
                      variant={"matchSelects"}
                      className="my-auto border-none focus:outline-none pl-2"
                    />
                  </Holds>
                  <Holds className="w-1/6 h-full">
                    {isFieldChanged("equipmentName") && (
                      <Images
                        titleImg="/turnBack.svg"
                        titleImgAlt="revert"
                        size={"40"}
                        onClick={() => revertField("equipmentName")}
                        className="cursor-pointer ml-2"
                      />
                    )}
                  </Holds>
                </Holds>
              </Holds>
              <Holds
                position={"row"}
                className="h-full w-full row-start-2 row-end-3 col-start-6 col-end-7 "
              >
                <Texts size={"p6"} className="mr-2">
                  {t("Comment")}
                </Texts>
                <Images
                  titleImg="/comment.svg"
                  titleImgAlt="comment"
                  size={"40"}
                  onClick={openComment}
                  className="cursor-pointer hover:shadow-black hover:shadow-md"
                />
              </Holds>
            </Grids>
          </Contents>
        )}
      </Holds>
    </Holds>
  );
}
