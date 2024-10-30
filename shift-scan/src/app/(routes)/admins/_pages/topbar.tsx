"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";

const Topbar = ({
  isOpen2,
  handleClockClick,
  page,
  setPage,
}: {
  isOpen2: boolean;
  handleClockClick: () => void;
  page: number;
  setPage: (page: number) => void;
}) => {
  return (
    <>
      {!isOpen2 ? (
        <>
          <Holds className=" h-[15%] pb-4 w-full">
            <Holds position={"row"} className="w-[95%] h-full m-auto">
              {page === 0 ? (
                <Holds
                  background={"lightBlue"}
                  className="flex flex-row justify-center rounded border-[3px] border-black w-[90%] h-full relative"
                >
                  <Texts className="h-full">
                    Closed Banner messages go here
                  </Texts>
                </Holds>
              ) : (
                <>
                  <Holds
                    background={"lightBlue"}
                    className="flex flex-row justify-center rounded border-[3px] border-black w-[90%] h-full"
                  >
                    <Holds>
                      <Texts className="h-full">
                        Closed Banner messages go here
                      </Texts>
                    </Holds>

                    <Images
                      titleImg="/x.svg"
                      titleImgAlt="Home Icon"
                      className="my-auto  cursor-pointer mr-2 w-[2%]  md:w-[2%] lg:w-[2%]"
                      onClick={page !== 0 ? () => setPage(0) : () => null}
                    />
                  </Holds>
                </>
              )}

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
          <Holds className="h-[25%] w-full">
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
                <Holds
                  position={"row"}
                  className="ml-2 my-auto w-[70%] md:w-[70%] lg:w-[60%]"
                >
                  <Holds size={"20"}>
                    <Images
                      titleImg={"/clock.svg"}
                      titleImgAlt={"clock"}
                      className="h-16 w-16"
                      position={"left"}
                    />
                  </Holds>
                  <Holds position={"row"} size={"80"} className="lg:gap-10">
                    <Holds
                      size={"30"}
                      position={"row"}
                      className="mx-2 flex-col lg:flex-row "
                    >
                      <Labels size={"p3"} type="title">
                        J#
                      </Labels>
                      <Inputs
                        name="jobsite"
                        type="text"
                        className="h-8 w-full md:w-[100px] my-auto"
                      />
                    </Holds>
                    <Holds
                      size={"30"}
                      position={"row"}
                      className=" flex-col lg:flex-row "
                    >
                      <Labels size={"p3"} type="title">
                        CC#
                      </Labels>
                      <Inputs
                        name="jobsite"
                        type="text"
                        className="h-8 w-full md:w-[100px] my-auto"
                      />
                    </Holds>
                  </Holds>
                </Holds>
                <Holds className="w-[10%] md:w-[10%] lg:w-[40%] "></Holds>

                <Holds
                  position={"row"}
                  className="my-auto mx-2 space-x-4 w-[20%] md:[30%] lg:w-[20%]"
                >
                  <Holds
                    position={"right"}
                    className="my-auto w-full flex justify-end"
                  >
                    {/* we will need to add a conditional here to determine if they are clocked in or not */}
                    <Buttons
                      background={"lightBlue"}
                      className="w-[50px] md:w-[70px] h-12 lg:w-[100px] md:h-8 "
                    >
                      <Texts size={"p6"}>start day</Texts>
                    </Buttons>
                  </Holds>
                  <Holds position={"right"}>
                    <Images
                      titleImg="/expandLeft.svg"
                      titleImgAlt="Home Icon"
                      className="m-auto rotate-[270deg] cursor-pointer h-16 w-16"
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
