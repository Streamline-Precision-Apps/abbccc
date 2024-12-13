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

export default function EditTagHeader({
  editedItem,
  commentText,
  editFunction,
  editCommentFunction,
}: {
  editedItem: string;
  commentText: string;
  editFunction?: Dispatch<SetStateAction<string>>;
  editCommentFunction?: Dispatch<SetStateAction<string>>;
}) {
  const t = useTranslations("Admins");
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);

  const openComment = () => {
    setIsCommentSectionOpen(!isCommentSectionOpen);
  };
  return (
    <Holds
      background={"white"}
      className={`w-full h-full col-span-2 ${
        isCommentSectionOpen ? "row-span-3" : "row-span-1"
      }`}
    >
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
                value={editedItem}
                onChange={(e) => {
                  editFunction?.(e.target.value);
                }}
                placeholder={t("EditTagName")}
                variant={"titleFont"}
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
                value={commentText ? commentText : ""}
                onChange={(e) => {
                  editCommentFunction?.(e.target.value);
                }}
                maxLength={40}
                rows={4}
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
              value={editedItem}
              placeholder={t("EditTagName")}
              onChange={(e) => {
                editFunction?.(e.target.value);
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
  );
}
