"use client";
import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useState } from "react";
// change back to async later
export default function Admins() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const handleClockClick = () => {
    setIsOpen2(!isOpen2);
  };
  return (
    <Bases className="pb-5">
      <Grids rows={"10"} cols={"5"} gap={"5"} className="h-full">
        {/* If the side bar is closed it will show the mini menu */}

        {!isOpen ? (
          <Holds
            background={"white"}
            className="col-start-0 col-end-1 row-span-10 h-full w-full ml-5 "
          >
            <Grids rows={"10"} gap={"5"} className="my-10">
              <Holds className="row-span-4 h-full">
                <Holds className="w-24">
                  <Buttons background={"none"} size={"50"} onClick={toggle}>
                    <Images
                      titleImg="/expandLeft.svg"
                      titleImgAlt="arrow left"
                      className="m-auto"
                    />
                  </Buttons>
                </Holds>

                <Holds className="w-32 h-32 ">
                  <Images
                    titleImg="/logo.svg"
                    titleImgAlt="logo"
                    className="my-auto"
                  />
                </Holds>

                <Holds className="w-32 h-32">
                  <Images
                    titleImg="/person.svg"
                    titleImgAlt="Home Icon"
                    size={"80"}
                    className="m-auto"
                  />
                </Holds>
              </Holds>
              <Holds className="row-span-7 h-full gap-10 mt-10">
                <Holds className="">
                  <Buttons background={"lightBlue"} className="w-24 h-24 ">
                    <Holds position={"row"}>
                      <Images
                        titleImg="/team.svg"
                        titleImgAlt="Personal Icon"
                        className="m-auto"
                      />
                    </Holds>
                  </Buttons>
                </Holds>
                <Holds>
                  <Buttons background={"lightBlue"} className="w-24 h-24 ">
                    <Holds position={"row"}>
                      <Images
                        titleImg="/jobsite.svg"
                        titleImgAlt="Home Icon"
                        className="m-auto"
                      />
                    </Holds>
                  </Buttons>
                </Holds>
                <Holds>
                  <Buttons background={"lightBlue"} className=" w-24 h-24 ">
                    <Holds position={"row"}>
                      <Images
                        titleImg="/form.svg"
                        titleImgAlt="Reports Icon"
                        className="m-auto"
                      />
                    </Holds>
                  </Buttons>
                </Holds>
              </Holds>
            </Grids>
          </Holds>
        ) : (
          <Holds
            background={"white"}
            className="col-start-0 col-end-2 row-span-10 h-full w-full ml-10 "
          >
            {/* If the side bar is closed it will show the mini menu */}
            <Grids rows={"10"} gap={"5"}>
              <Holds className="row-span-2 flex-row h-full">
                <Holds>
                  <Buttons background={"none"} size={"20"} onClick={toggle}>
                    <Images
                      titleImg="/expandLeft.svg"
                      titleImgAlt="arrow left"
                      className="rotate-180"
                    />
                  </Buttons>
                </Holds>

                <Holds className="w-[600px] h-[600px]">
                  <Images
                    titleImg="/logo.svg"
                    titleImgAlt="logo"
                    className="my-auto mr-10"
                  />
                </Holds>
              </Holds>
              <Holds className="row-span-1 h-full mb-5 flex-col">
                <Grids rows={"1"} cols={"3"}>
                  <Holds className="col-span-1 h-full">
                    <Images
                      titleImg="/person.svg"
                      titleImgAlt="Home Icon"
                      size={"80"}
                      className="m-auto"
                    />
                  </Holds>
                  <Holds className="col-span-2">
                    <Holds className="flex-col">
                      <Texts size={"p2"} position={"left"}>
                        Jessica Rabbit
                      </Texts>
                      <Texts size={"p4"} position={"left"}>
                        Admin
                      </Texts>
                    </Holds>
                  </Holds>
                </Grids>
              </Holds>
              <Holds className="row-span-7 h-full gap-10 mt-10">
                <Holds className="">
                  <Buttons background={"lightBlue"} className="w-11/12 h-24 ">
                    <Holds position={"row"}>
                      <Images
                        titleImg="/team.svg"
                        titleImgAlt="Personal Icon"
                        size={"30"}
                        className="m-auto"
                      />
                      <Texts size={"p2"}>Home</Texts>
                      <Images
                        titleImg="/drag.svg"
                        titleImgAlt="draggable icon"
                        size={"30"}
                        className="m-auto"
                      />
                    </Holds>
                  </Buttons>
                </Holds>
                <Holds>
                  <Buttons background={"lightBlue"} className="w-11/12 h-24 ">
                    <Holds position={"row"}>
                      <Images
                        titleImg="/jobsite.svg"
                        titleImgAlt="Home Icon"
                        size={"30"}
                        className="m-auto"
                      />
                      <Texts size={"p2"}>Assets</Texts>
                      <Images
                        titleImg="/drag.svg"
                        titleImgAlt="draggable icon"
                        size={"30"}
                        className="m-auto"
                      />
                    </Holds>
                  </Buttons>
                </Holds>
                <Holds>
                  <Buttons background={"lightBlue"} className="w-11/12 h-24 ">
                    <Holds position={"row"}>
                      <Images
                        titleImg="/form.svg"
                        titleImgAlt="Reports Icon"
                        size={"30"}
                        className="m-auto"
                      />
                      <Texts size={"p2"}>Reports</Texts>
                      <Images
                        titleImg="/drag.svg"
                        titleImgAlt="draggable icon"
                        size={"30"}
                        className="m-auto"
                      />
                    </Holds>
                  </Buttons>
                </Holds>
              </Holds>
            </Grids>
          </Holds>
        )}
        {!isOpen ? (
          <>
            {!isOpen2 ? (
              <>
                <Holds className="col-start-1 col-end-6 row-span-1 h-full w-full">
                  <Holds background={"white"} className=" w-11/12 h-full">
                    <Grids gap={"5"} className="h-full">
                      <Holds
                        background={"lightBlue"}
                        className="col-start-1 col-end-4 rounded  h-full"
                      >
                        <Texts>Banner messages go here</Texts>
                      </Holds>
                      <Holds
                        background={"white"}
                        className="col-start-4 col-end-5 h-full"
                      >
                        <Holds position={"row"} className="m-auto">
                          <Holds size={"50"}>
                            <Images
                              titleImg={"/clock.svg"}
                              titleImgAlt={"clock"}
                              size={"50"}
                            />
                          </Holds>
                          <Holds size={"50"}>
                            <Images
                              titleImg="/expandLeft.svg"
                              titleImgAlt="Home Icon"
                              className="m-auto rotate-90 cursor-pointer"
                              size={"50"}
                              onClick={handleClockClick}
                            />
                          </Holds>
                        </Holds>
                      </Holds>
                    </Grids>
                  </Holds>
                </Holds>
              </>
            ) : (
              <>
                <Holds className="col-start-1 col-end-6 row-span-2 h-full w-full">
                  <Holds background={"white"} className=" w-11/12 h-full">
                    <Grids rows={"2"} className="h-full">
                      <Holds
                        background={"lightBlue"}
                        className="col-start-1 col-end-6 rounded h-full w-full"
                      >
                        <Titles className="m-auto h-full">
                          Banner messages go here
                        </Titles>
                      </Holds>
                      <Holds
                        background={"white"}
                        className="col-start-1 col-end-6 h-full w-full flex-row"
                      >
                        <Grids cols={"10"} gap={"5"} className="h-full">
                          <Holds
                            position={"row"}
                            className="col-start-1 col-end-6 m-auto gap-4"
                          >
                            <Holds>
                              <Images
                                titleImg={"/clock.svg"}
                                titleImgAlt={"clock"}
                                size={"50"}
                              />
                            </Holds>
                            <Holds className="m-auto" position={"left"}>
                              <Labels size={"p3"} type="title">
                                Current Jobsite
                              </Labels>
                              <Inputs
                                name="jobsite"
                                type="text"
                                className="h-8"
                              />
                            </Holds>
                            <Holds className="m-auto">
                              <Labels size={"p3"} type="title">
                                Current Cost Code
                              </Labels>
                              <Inputs
                                name="jobsite"
                                type="text"
                                className="h-8"
                              />
                            </Holds>
                          </Holds>

                          <Holds
                            position={"row"}
                            className="m-auto col-start-8 col-end-11"
                          >
                            <Holds className="m-auto w-full flex justify-end">
                              <Buttons background={"lightBlue"} className="">
                                <Texts size={"p6"}>start day</Texts>
                              </Buttons>
                            </Holds>
                            <Holds>
                              <Images
                                titleImg="/expandLeft.svg"
                                titleImgAlt="Home Icon"
                                className="m-auto rotate-[270deg] cursor-pointer"
                                size={"30"}
                                onClick={handleClockClick}
                              />
                            </Holds>
                          </Holds>
                        </Grids>
                      </Holds>
                    </Grids>
                  </Holds>
                </Holds>
              </>
            )}
          </>
        ) : (
          // when the side bar is open
          <>
            {!isOpen2 ? (
              <>
                <Holds className="col-start-2 col-end-6 row-span-1 h-full w-full">
                  <Holds background={"white"} className=" w-11/12 h-full">
                    <Grids gap={"5"} className="h-full">
                      <Holds
                        background={"lightBlue"}
                        className="col-start-1 col-end-4 rounded  h-full"
                      >
                        <Texts>Banner messages go here</Texts>
                      </Holds>
                      <Holds
                        background={"white"}
                        className="col-start-4 col-end-5 h-full"
                      >
                        <Holds position={"row"} className="m-auto">
                          <Holds size={"50"}>
                            <Images
                              titleImg={"/clock.svg"}
                              titleImgAlt={"clock"}
                              size={"50"}
                            />
                          </Holds>
                          <Holds size={"50"}>
                            <Images
                              titleImg="/expandLeft.svg"
                              titleImgAlt="Home Icon"
                              className="m-auto rotate-90 cursor-pointer"
                              size={"50"}
                              onClick={handleClockClick}
                            />
                          </Holds>
                        </Holds>
                      </Holds>
                    </Grids>
                  </Holds>
                </Holds>
              </>
            ) : (
              <>
                <Holds className="col-start-2 col-end-6 row-span-2 h-full w-full">
                  <Holds background={"white"} className=" w-11/12 h-full">
                    <Grids rows={"2"} className="h-full">
                      <Holds
                        background={"lightBlue"}
                        className="col-start-1 col-end-6 rounded h-full w-full"
                      >
                        <Titles className="m-auto h-full">
                          Banner messages go here
                        </Titles>
                      </Holds>
                      <Holds
                        background={"white"}
                        className="col-start-1 col-end-6 h-full w-full flex-row"
                      >
                        <Grids cols={"10"} gap={"5"} className="h-full">
                          <Holds
                            position={"row"}
                            className="col-start-1 col-end-6 m-auto gap-4"
                          >
                            <Holds>
                              <Images
                                titleImg={"/clock.svg"}
                                titleImgAlt={"clock"}
                                size={"50"}
                              />
                            </Holds>
                            <Holds className="m-auto" position={"left"}>
                              <Labels size={"p3"} type="title">
                                Current Jobsite
                              </Labels>
                              <Inputs
                                name="jobsite"
                                type="text"
                                className="h-8"
                              />
                            </Holds>
                            <Holds className="m-auto">
                              <Labels size={"p3"} type="title">
                                Current Cost Code
                              </Labels>
                              <Inputs
                                name="jobsite"
                                type="text"
                                className="h-8"
                              />
                            </Holds>
                          </Holds>

                          <Holds
                            position={"row"}
                            className="m-auto col-start-8 col-end-11"
                          >
                            <Holds className="m-auto w-full flex justify-end">
                              <Buttons background={"lightBlue"} className="">
                                <Texts size={"p6"}>start day</Texts>
                              </Buttons>
                            </Holds>
                            <Holds>
                              <Images
                                titleImg="/expandLeft.svg"
                                titleImgAlt="Home Icon"
                                className="m-auto rotate-[270deg] cursor-pointer"
                                size={"30"}
                                onClick={handleClockClick}
                              />
                            </Holds>
                          </Holds>
                        </Grids>
                      </Holds>
                    </Grids>
                  </Holds>
                </Holds>
              </>
            )}
          </>
        )}
        {!isOpen && !isOpen2 ? (
          <Holds className="row-start-2 row-end-11 col-start-1 col-end-6 h-full w-full">
            <Holds background={"lightBlue"} className="w-11/12 h-full">
              <Texts>Dashboard</Texts>
            </Holds>
          </Holds>
        ) : null}
        {isOpen && !isOpen2 ? (
          <Holds className="row-start-2 row-end-11 col-start-2 col-end-6 h-full w-full">
            <Holds background={"lightBlue"} className="w-11/12 h-full">
              <Texts>Dashboard</Texts>
            </Holds>
          </Holds>
        ) : null}
        {isOpen2 && !isOpen ? (
          <Holds className="row-start-3 row-end-11 col-start-1 col-end-6 h-full w-full">
            <Holds background={"lightBlue"} className="w-11/12 h-full">
              <Texts>Dashboard</Texts>
            </Holds>
          </Holds>
        ) : null}

        {isOpen && isOpen2 ? (
          <Holds className="row-start-3 row-end-11 col-start-2 col-end-6 h-full w-full">
            <Holds background={"lightBlue"} className="w-11/12 h-full">
              <Texts>Dashboard</Texts>
            </Holds>
          </Holds>
        ) : null}
      </Grids>
    </Bases>
  );
}
