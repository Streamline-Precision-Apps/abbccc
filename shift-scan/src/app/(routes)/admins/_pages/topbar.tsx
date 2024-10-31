"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { getAuthStep } from "@/app/api/auth";

const Topbar = ({
  isOpen2,
  handleClockClick,
  page,
  setPage,
  setIsOpen,
  setIsSwitch,
  setIsBreak,
  setIsEndofDay,
}: {
  isOpen2: boolean;
  handleClockClick: () => void;
  page: number;
  setPage: (page: number) => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsSwitch: (isOpen: boolean) => void;
  setIsBreak: (isOpen: boolean) => void;
  setIsEndofDay: (isOpen: boolean) => void;
}) => {
  return (
    <>
      {!isOpen2 ? (
        <>
          <Holds className=" h-[15%] pb-4 w-full">
            <Holds position={"row"} className="w-[98%] h-full m-auto">
              {page === 0 ? (
                <Holds
                  background={"lightBlue"}
                  className="flex flex-row justify-center items-center rounded border-[3px] border-black w-[90%] h-full relative"
                >
                  {/* Closed Banner */}
                  <Titles className="h-full">Banner messages go here</Titles>
                </Holds>
              ) : (
                <>
                  <Holds
                    background={"lightBlue"}
                    className="flex flex-row justify-center items-center rounded border-[3px] border-black w-[90%] h-full relative"
                  >
                    {/* Opened Banner */}

                    <Holds className="w-[10%] absolute left-5">
                      <Holds position={"row"} className="hidden md:flex">
                        <Images
                          titleImg={
                            page === 1
                              ? "/team.svg"
                              : page === 2
                              ? "/jobsite.svg"
                              : page === 3
                              ? "/form.svg"
                              : ""
                          }
                          size={"60"}
                          titleImgAlt="current Icon"
                          className="my-auto cursor-pointer  "
                        />

                        <Titles size={"h4"} className="h-full ml-2 ">
                          {page === 1
                            ? "Personnel"
                            : page === 2
                            ? "Assets"
                            : page === 3
                            ? "Reports"
                            : ""}
                        </Titles>
                      </Holds>
                    </Holds>
                    <Titles size={"h4"} className="h-full">
                      Closed Banner messages go here
                    </Titles>

                    <Holds className="w-10 absolute right-5">
                      <Images
                        titleImg="/x.svg"
                        titleImgAlt="Home Icon"
                        className="my-auto cursor-pointer "
                        size={"90"}
                        onClick={page !== 0 ? () => setPage(0) : () => null}
                      />
                    </Holds>
                  </Holds>
                </>
              )}

              <Holds
                background={"white"}
                className="col-start-4 col-end-5 w-[10%] h-[80%] flex-row rounded-l-none"
              >
                <Holds position={"row"} className="my-auto">
                  <Holds size={"50"}>
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
            <Holds className=" w-[98%] h-full">
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
                        value={
                          localStorage
                            .getItem("jobSite")
                            ?.toString()
                            .slice(0, 10) || "{}"
                        }
                        disabled
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
                        value={
                          localStorage.getItem("costCode")?.toString() || "{}"
                        }
                        disabled
                      />
                    </Holds>
                  </Holds>
                </Holds>

                {/* we will need to add a conditional here to determine if they are clocked in or not */}
                {getAuthStep() === "success" ? (
                  <Holds position={"row"} className="my-auto  w-[40%] ">
                    <Holds
                      size={"80"}
                      position={"right"}
                      className="my-auto w-full flex flex-row space-x-4 justify-end"
                    >
                      <Buttons
                        background={"orange"}
                        className=""
                        onClick={() => setIsOpen(true)}
                      >
                        <Texts size={"p6"}>Switch</Texts>
                      </Buttons>
                      <Buttons
                        background={"lightBlue"}
                        className=""
                        onClick={() => setIsOpen(true)}
                      >
                        <Texts size={"p6"}>Break</Texts>
                      </Buttons>
                      <Buttons
                        background={"red"}
                        className="mr-2"
                        onClick={() => setIsOpen(true)}
                      >
                        <Texts size={"p6"}>End Day</Texts>
                      </Buttons>
                    </Holds>
                    <Holds position={"right"} size={"20"}>
                      <Images
                        titleImg="/expandLeft.svg"
                        titleImgAlt="Home Icon"
                        className="m-auto rotate-[270deg] cursor-pointer h-16 w-16"
                        onClick={handleClockClick}
                        position={"right"}
                      />
                    </Holds>
                  </Holds>
                ) : (
                  <Holds
                    position={"row"}
                    className="my-auto mx-2 space-x-4 w-[40%] md:[30%] lg:w-[40%]"
                  >
                    <Holds
                      position={"right"}
                      className="my-auto w-full flex justify-end"
                    >
                      <Buttons
                        background={"green"}
                        className="w-[50px] p-1 md:w-[70px] h-fit lg:w-[100px] "
                        onClick={() => setIsOpen(true)}
                      >
                        <Texts size={"p6"}>start day</Texts>
                      </Buttons>
                    </Holds>
                    <Holds position={"right"}>
                      <Images
                        titleImg="/expandLeft.svg"
                        titleImgAlt="Home Icon"
                        className="m-auto rotate-[270deg] cursor-pointer h-16 w-fit"
                        onClick={handleClockClick}
                        position={"right"}
                      />
                    </Holds>
                  </Holds>
                )}
              </Holds>
            </Holds>
          </Holds>
        </>
      )}
    </>
  );
};

export default Topbar;
