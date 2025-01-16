"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
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
        size={"page"}
      >
        <Holds background={"white"}>
          <Grids rows={"5"}>
            <Holds className="row-span-1 h-full">
              <Texts size={"p1"}>Current Shift Comment</Texts>
            </Holds>
            <Holds className="row-span-3 h-full">
              <TextAreas
                placeholder="Write a 40 character Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={9}
                maxLength={40}
                style={{ resize: "none" }}
              />
            </Holds>
            <Holds position={"row"} className="row-span-1 h-full space-x-4">
              <Holds>
                <Buttons
                  background={"orange"}
                  onClick={() => handleCOButton2()}
                >
                  <Texts size={"p3"}>Submit</Texts>
                </Buttons>
              </Holds>
              <Holds>
                <Buttons
                  background={"red"}
                  onClick={() => setIsModal2Open(false)}
                >
                  <Texts size={"p3"}>Cancel</Texts>
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
