"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Labels } from "@/components/(reusable)/labels";
import { Modals } from "@/components/(reusable)/modals";
import { NModals } from "@/components/(reusable)/newmodals";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";

export default function ClockOutWidget({
  handleShowManagerButtons,
  setIsModal2Open,
  isModal2Open,
  isModalOpen,
  comment,
  setComment,
  handleCOButton2,
  handleCOButton3,
  handleCloseModal,
}: {
  handleShowManagerButtons: () => void;
  setIsModal2Open: React.Dispatch<React.SetStateAction<boolean>>;
  isModal2Open: boolean;
  isModalOpen: boolean;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  handleCOButton2: () => void;
  handleCOButton3: () => void;
  handleCloseModal: () => void;
}) {
  const t = useTranslations("Widgets");
  const c = useTranslations("Clock");
  return (
    <>
      <Holds className="col-span-2 row-span-1 gap-5 h-full">
        <Buttons background={"orange"} onClick={() => setIsModal2Open(true)}>
          <Holds position={"row"} className="my-auto">
            <Holds size={"60"}>
              <Texts size={"p1"}>{t("Break")}</Texts>
            </Holds>
            <Holds size={"40"}>
              <Images
                titleImg="/break.svg"
                titleImgAlt="Break Icon"
                size={"50"}
              />
            </Holds>
          </Holds>
        </Buttons>
      </Holds>
      <NModals
        isOpen={isModal2Open}
        handleClose={() => setIsModal2Open(false)}
        size={"screen"}
        background={"takeABreak"}
      >
        <Holds background={"white"} className="h-full w-full p-2">
          <Grids rows={"7"} gap={"5"} className="mb-5 h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full w-full justify-center">
              <Grids rows={"1"} cols={"5"} gap={"3"} className=" h-full w-full">
                <Holds
                  className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
                  onClick={() => setIsModal2Open(false)}
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
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={c("TodayIDidTheFollowing")}
                  className="w-full h-full"
                  maxLength={40}
                  style={{ resize: "none" }}
                />

                <Texts
                  size={"p2"}
                  className={`${
                    comment.length === 40
                      ? "text-red-500 absolute bottom-5 right-2"
                      : "absolute bottom-5 right-2"
                  }`}
                >
                  {comment.length}/40
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
                  onClick={() => handleCOButton2()}
                  className="w-[90%] h-full py-3"
                >
                  <Texts size={"p3"}>{c("Next")}</Texts>
                </Buttons>
              </Holds>
            </Holds>
          </Grids>
        </Holds>
      </NModals>

      <Holds className="col-span-2 row-span-1 gap-5 h-full">
        <Buttons background={"red"} onClick={handleCOButton3}>
          <Holds position={"row"} className="my-auto">
            <Holds size={"70"}>
              <Texts size={"p1"}>{t("EndDay")}</Texts>
            </Holds>
            <Holds size={"30"}>
              <Images
                titleImg="/end-day.svg"
                titleImgAlt="End Icon"
                size={"50"}
              />
            </Holds>
          </Holds>
        </Buttons>
      </Holds>
      <Modals
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
        size={"clock"}
      >
        <Bases>
          <Contents>
            <Holds background={"white"} className="h-full">
              <Holds className="h-full py-10">
                <Contents width={"section"}>
                  <Grids rows={"4"} gap={"5"}>
                    <Holds className="h-full span-3 my-auto">
                      <Titles size={"h1"}>{t("Whoops")}</Titles>
                      <br />
                      <Texts size={"p2"}>{t("ReturnToLogOut")}</Texts>
                    </Holds>
                    <Holds className="h-full span-1 my-auto">
                      <Buttons
                        background={"orange"}
                        size={"full"}
                        href={`/dashboard/equipment`}
                      >
                        <Texts size={"p3"}>{t("ClickToLogOut")}</Texts>
                      </Buttons>
                    </Holds>
                  </Grids>
                </Contents>
              </Holds>
            </Holds>
          </Contents>
        </Bases>
      </Modals>
      <Holds className="col-span-2 row-span-1 gap-5 h-full">
        <Buttons background={"lightBlue"} onClick={handleShowManagerButtons}>
          <Holds position={"row"} className="my-auto">
            <Holds size={"60"}>
              <Texts size={"p1"}>{t("GoHome")}</Texts>
            </Holds>
            <Holds size={"40"}>
              <Images
                titleImg="/home.svg"
                titleImgAlt="Home Icon"
                size={"50"}
              />
            </Holds>
          </Holds>
        </Buttons>
      </Holds>
    </>
  );
}
