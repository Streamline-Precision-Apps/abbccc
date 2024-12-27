"use client";
import { Buttons } from "../(reusable)/buttons";
import { Grids } from "../(reusable)/grids";
import { Holds } from "../(reusable)/holds";
import { TextAreas } from "../(reusable)/textareas";
import { Texts } from "../(reusable)/texts";
import { Titles } from "../(reusable)/titles";
import { useTranslations } from "next-intl";

export default function Comment({
  handleClick,
  setCommentsValue,
  commentsValue,
}: {
  commentsValue: string;
  handleClick: () => void;
  clockInRole: string | undefined;
  setCommentsValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const t = useTranslations("Clock");

  return (
    <Holds className="h-full w-full">
      <Grids rows={"7"} gap={"5"} className="my-5 h-full w-full">
        <Holds className="row-start-1 row-end-2 h-full w-full justify-center">
          <Titles size={"h3"}>{t("PleaseLeaveACommentOfWhatYouDid")}</Titles>
        </Holds>
        <Holds className="h-full row-span-6">
          <Grids rows={"5"} gap={"2"}>
            <Holds className="row-span-4 h-full w-full items-center relative">
              <TextAreas
                onChange={(e) => {
                  setCommentsValue(e.target.value);
                }}
                placeholder={t("TodayIDidTheFollowing")}
                className="w-[90%] h-full"
                maxLength={40}
                style={{ resize: "none" }}
              />

              <Texts
                size={"p2"}
                className={`${
                  commentsValue.length === 40
                    ? "text-red-500 absolute bottom-5 left-2"
                    : "absolute bottom-5 left-[10%]"
                }`}
              >
                {commentsValue.length}/40
              </Texts>
            </Holds>

            <Holds className="row-span-1 h-full w-full justify-center">
              <Buttons
                onClick={() => {
                  handleClick();
                }}
                background={"lightBlue"}
                className="w-[90%] h-5/6"
              >
                <Titles size={"h3"}>{t("Submit")}</Titles>
              </Buttons>
            </Holds>
          </Grids>
        </Holds>
      </Grids>
    </Holds>
  );
}
