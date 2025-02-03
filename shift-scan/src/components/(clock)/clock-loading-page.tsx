"use client";

import { useTranslations } from "next-intl";
import { Contents } from "../(reusable)/contents";
import { Grids } from "../(reusable)/grids";
import { Holds } from "../(reusable)/holds";
import { Images } from "../(reusable)/images";
import Spinner from "../(animations)/spinner";

export default function ClockLoadingPage({
  handleReturnPath,
}: {
  handleReturnPath: () => void;
}) {
  return (
    <Holds background={"white"} className="h-full w-full animate-pulse">
      <Contents width={"section"}>
        <Grids rows={"7"} gap={"5"} className="h-full w-full my-5">
          <Holds className="row-start-1 row-end-2 h-full w-full justify-center ">
            <Grids rows={"2"} cols={"5"} gap={"3"} className="h-full w-full">
              <Holds
                className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
                onClick={handleReturnPath}
              >
                <Images
                  titleImg="/turnBack.svg"
                  titleImgAlt="back"
                  position={"left"}
                />
              </Holds>
            </Grids>
          </Holds>
          <Holds className="flex justify-center items-center h-full w-full row-start-2 row-end-7 col-span-5">
            <Spinner size={70} />
          </Holds>
        </Grids>
      </Contents>
    </Holds>
  );
}
