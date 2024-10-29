"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";

const Topbar = ({
  isOpen,
  isOpen2,
  handleClockClick,
}: {
  isOpen: boolean;
  isOpen2: boolean;
  handleClockClick: () => void;
}) => {
  return (
    <>
      {!isOpen2 ? (
        <>
          <Holds className=" h-[15%] py-2 w-full">
            <Holds position={"row"} className="w-[95%] h-full m-auto">
              <Holds
                background={"lightBlue"}
                className=" flex justify-center rounded border-[3px] border-black w-[90%] h-full"
              >
                <Texts className="h-full">Closed Banner messages go here</Texts>
              </Holds>
              <Holds
                background={"white"}
                className="col-start-4 col-end-5 w-[10%] h-[80%] flex-row rounded-l-none"
              >
                <Holds position={"row"} className="my-auto">
                  <Holds size={"70"}>
                    <Images titleImg={"/clock.svg"} titleImgAlt={"clock"} />
                  </Holds>
                  <Holds size={"50"}>
                    <Images
                      titleImg="/expandLeft.svg"
                      titleImgAlt="Home Icon"
                      className="my-auto rotate-90 cursor-pointer"
                      size={"50"}
                      onClick={handleClockClick}
                    />
                  </Holds>
                </Holds>
              </Holds>
            </Holds>
          </Holds>
        </>
      ) : (
        <>
          <Holds className="h-[25%] py-2 w-full">
            <Holds className=" w-[95%] h-full">
              <Holds
                background={"lightBlue"}
                className="rounded h-full w-full border-[3px] border-black"
              >
                <Titles className="m-auto h-full">
                  Open Banner messages go here
                </Titles>
              </Holds>
              <Holds
                background={"white"}
                className=" h-full py-2 w-[99%] flex justify-start flex-row rounded"
              >
                <Holds position={"row"} className="my-auto w-[50%] ">
                  <Holds position={"center"}>
                    <Images
                      titleImg={"/clock.svg"}
                      titleImgAlt={"clock"}
                      size={"40"}
                    />
                  </Holds>
                  <Holds>
                    <Labels size={"p3"} type="title">
                      Current Jobsite
                    </Labels>
                    <Inputs
                      name="jobsite"
                      type="text"
                      className="h-8 w-[150px]"
                    />
                  </Holds>
                  <Holds>
                    <Labels size={"p3"} type="title">
                      Current Cost Code
                    </Labels>
                    <Inputs
                      name="jobsite"
                      type="text"
                      className="h-8 w-[150px]"
                    />
                  </Holds>
                </Holds>
                <Holds className="w-[50%]"></Holds>

                <Holds
                  position={"row"}
                  className="my-auto mx-2 space-x-4 w-[20%]"
                >
                  <Holds
                    position={"right"}
                    className="m-auto w-full flex justify-end"
                  >
                    <Buttons background={"lightBlue"} className="">
                      <Texts size={"p6"}>start day</Texts>
                    </Buttons>
                  </Holds>
                  <Holds position={"right"} size={"30"}>
                    <Images
                      titleImg="/expandLeft.svg"
                      titleImgAlt="Home Icon"
                      className="m-auto rotate-[270deg] cursor-pointer"
                      onClick={handleClockClick}
                      position={"right"}
                    />
                  </Holds>
                </Holds>
              </Holds>
            </Holds>
          </Holds>
        </>
      )}
    </>
  );
};

export default Topbar;
