"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";

const sidebar = ({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) => {
  return (
    <>
      {/* If the side bar is closed it will show the mini menu */}
      {isOpen ? (
        <Holds background={"white"} className=" h-full w-[28em] ml-5 ">
          <Grids rows={"10"} gap={"5"}>
            <Holds className=" row-span-2 flex-row h-full ">
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
                  position={"left"}
                  titleImg="/logo.svg"
                  titleImgAlt="logo"
                  className="my-auto mr-10"
                />
              </Holds>
            </Holds>
            <Holds className=" row-span-2 h-full mb-5 flex-col">
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
                    <Texts size={"p3"} position={"left"}>
                      Jessica Rabbit
                    </Texts>
                    <Texts size={"p5"} position={"left"}>
                      Admin
                    </Texts>
                  </Holds>
                </Holds>
              </Grids>
            </Holds>
            {/* The first button that says personal */}
            <Holds className=" row-span-5 h-full gap-5 mt-10">
              <Holds>
                <Buttons background={"lightBlue"} className="w-[90%] h-20 ">
                  <Holds position={"row"}>
                    <Holds className="w-32 h-full ">
                      <Images
                        titleImg="/team.svg"
                        titleImgAlt="Personal Icon"
                        className="m-auto"
                        size={"50"}
                      />
                    </Holds>
                    <Texts size={"p3"}>Personnel</Texts>
                    <Holds className="hidden md:flex" size={"30"}>
                      <Images
                        titleImg="/drag.svg"
                        titleImgAlt="draggable icon"
                        className="m-auto"
                        size={"50"}
                      />
                    </Holds>
                  </Holds>
                </Buttons>
              </Holds>
              {/* The button that says Assets */}
              <Holds className="flex items-start justify-between">
                <Buttons background={"lightBlue"} className="w-[90%] h-20 ">
                  <Holds position={"row"}>
                    <Holds className="w-32 h-full ">
                      <Images
                        titleImg="/jobsite.svg"
                        titleImgAlt="Home Icon"
                        className="m-auto"
                        size={"50"}
                      />
                    </Holds>
                    <Texts size={"p3"}>Assets</Texts>
                    <Holds className="hidden md:flex" size={"30"}>
                      <Images
                        titleImg="/drag.svg"
                        titleImgAlt="draggable icon"
                        className="m-auto"
                        size={"50"}
                      />
                    </Holds>
                  </Holds>
                </Buttons>
              </Holds>
              {/* The button that says Reports */}
              <Holds>
                <Buttons background={"lightBlue"} className="w-[90%] h-20 ">
                  <Holds position={"row"}>
                    <Holds className="w-32 h-full ">
                      <Images
                        titleImg="/form.svg"
                        titleImgAlt="Reports Icon"
                        className="m-auto"
                        size={"50"}
                      />
                    </Holds>
                    <Texts size={"p3"}>Reports</Texts>
                    <Holds className="hidden md:flex" size={"30"}>
                      <Images
                        titleImg="/drag.svg"
                        titleImgAlt="draggable icon"
                        className="my-auto flex items-center justify-center "
                        size={"50"}
                      />
                    </Holds>
                  </Holds>
                </Buttons>
              </Holds>
            </Holds>
          </Grids>
        </Holds>
      ) : (
        <Holds background={"white"} className=" h-full w-[10em] ml-5 ">
          <Grids rows={"10"} gap={"5"} className="my-5">
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

              <Holds className=" w-40 h-40 ">
                <Images
                  titleImg="/logo.svg"
                  titleImgAlt="logo"
                  className="my-auto"
                />
              </Holds>

              <Holds className=" w-32 h-32 ">
                <Images
                  titleImg="/person.svg"
                  titleImgAlt="Home Icon"
                  size={"80"}
                  className="m-auto"
                />
              </Holds>
            </Holds>
            <Holds className=" h-full gap-5 mt-10">
              <Holds className="">
                <Buttons background={"lightBlue"} className="w-20 h-20 ">
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
                <Buttons background={"lightBlue"} className="w-20 h-20 ">
                  <Holds position={"row"}>
                    <Images
                      titleImg="/jobsite.svg"
                      titleImgAlt="Assets Icon"
                      className="m-auto"
                      size={"80"}
                    />
                  </Holds>
                </Buttons>
              </Holds>
              <Holds>
                <Buttons background={"lightBlue"} className="w-20 h-20 ">
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
      )}
    </>
  );
};
export default sidebar;
