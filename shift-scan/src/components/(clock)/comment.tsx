"use client";
import { Buttons } from "../(reusable)/buttons";
import { Grids } from "../(reusable)/grids";
import { Holds } from "../(reusable)/holds";
import { Images } from "../(reusable)/images";
import { Labels } from "../(reusable)/labels";
import { TextAreas } from "../(reusable)/textareas";
import { Texts } from "../(reusable)/texts";
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
  const c = useTranslations("Clock");

  const returnRoute = () => {
    window.history.back();
  };

  return (
    <Holds background={"white"} className="h-full w-full">
      <Grids rows={"7"} gap={"5"} className="mb-5 h-full w-full">
        <Holds className="row-start-1 row-end-2 h-full w-full justify-center">
          <Grids rows={"1"} cols={"5"} gap={"3"} className=" h-full w-full">
            <Holds
              className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
              onClick={returnRoute}
            >
              <Images
                titleImg="/turnBack.svg"
                titleImgAlt="back"
                position={"left"}
              />
            </Holds>
          </Grids>
        </Holds>

        <Holds className="row-start-2 row-end-4 h-full w-full justify-center relative">
          <Holds className="h-full w-[90%] relative">
            <Labels size={"p4"} htmlFor="comment">
              {c("PreviousJobComment")}
            </Labels>
            <TextAreas
              value={commentsValue}
              onChange={(e) => {
                setCommentsValue(e.target.value);
              }}
              placeholder={c("TodayIDidTheFollowing")}
              className="w-full h-full"
              maxLength={40}
              style={{ resize: "none" }}
            />

            <Texts
              size={"p2"}
              className={`${
                commentsValue.length === 40
                  ? "text-red-500 absolute bottom-5 right-2"
                  : "absolute bottom-5 right-2"
              }`}
            >
              {commentsValue.length}/40
            </Texts>
          </Holds>
        </Holds>

        <Holds
          position={"row"}
          className="row-start-7 row-end-8 h-full space-x-4"
        >
          <Holds>
            <Buttons
              background={"orange"}
              onClick={() => handleClick()}
              className="w-[90%] h-full py-3"
            >
              <Texts size={"p3"}>{c("Next")}</Texts>
            </Buttons>
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
