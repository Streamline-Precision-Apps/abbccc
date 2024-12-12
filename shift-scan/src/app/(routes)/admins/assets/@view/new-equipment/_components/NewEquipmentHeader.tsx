"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";

export function NewEquipmentHeader({
  // createEquipment,
  comment,
  equipmentName,
  setComment,
  setEquipmentName,
}: {
  comment?: string;
  equipmentName?: string;
  setComment?: Dispatch<SetStateAction<string>>;
  setEquipmentName?: Dispatch<SetStateAction<string>>;
}) {
  const t = useTranslations("Admins");
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);

  const openComment = () => {
    setIsCommentSectionOpen(!isCommentSectionOpen);
  };

  return (
    <Holds
      background={"white"}
      className={
        isCommentSectionOpen
          ? `row-span-3 col-span-2 h-full`
          : `row-span-1 col-span-2 h-full`
      }
    >
      <Holds position={"row"} className="h-full w-full">
        {isCommentSectionOpen ? (
          <Contents width={"95"} position={"row"}>
            <Grids
              rows={"5"}
              cols={"5"}
              gap={"2"}
              className=" h-full w-full py-4"
            >
              <Holds className="w-full row-start-1 row-end-2 col-start-1 col-end-4">
                <Inputs
                  type="text"
                  value={equipmentName}
                  onChange={(e) => {
                    setEquipmentName?.(e.target.value);
                  }}
                  placeholder={t("EnterYourEquipmentName")}
                  variant={"matchSelects"}
                  className=" my-auto"
                />
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
                  placeholder={t("EnterYourComment")}
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
          <Grids rows={"2"} cols={"5"} className=" h-full w-full p-4">
            <Holds className="w-full row-start-1 row-end-3 col-start-1 col-end-4 ">
              <Inputs
                type="text"
                value={equipmentName}
                placeholder={t("EnterYourEquipmentName")}
                onChange={(e) => {
                  setEquipmentName?.(e.target.value);
                }}
                variant={"titleFont"}
                className=" my-auto"
              />
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
        )}
      </Holds>
    </Holds>
  );
}
