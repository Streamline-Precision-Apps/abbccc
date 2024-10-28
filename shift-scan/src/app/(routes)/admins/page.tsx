"use client";
import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useState } from "react";
// change back to async later
export default function Admins() {
  return (
    <Bases>
      <Grids rows={"10"} cols={"5"} gap={"5"} className="h-full">
        <Sidebar />
      </Grids>
    </Bases>
  );
}

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <>
      {/* If the side bar is closed it will show the mini menu */}
      {!isOpen ? (
        <Holds
          background={"white"}
          className="col-start-0 col-end-1 row-span-10 h-full w-full ml-10 "
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
    </>
  );
}
