"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [page, setPage] = useState(0);
  const [username, setUsername] = useState<string>("");
  const { data: session } = useSession();
  const permission = session?.user.permission;
  const router = useRouter();

  useEffect(() => {
    setUsername(`${session?.user.firstName} ${session?.user.lastName}`);
  }, [session?.user.firstName, session?.user.lastName]);
  return (
    <>
      {/* If the side bar is closed it will show the mini menu */}
      {isOpen ? (
        <Holds background={"white"} className=" h-full w-[20em] ml-3 ">
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
                <Holds
                  className="col-span-1 h-full"
                  onClick={() => router.push("/admins/settings")}
                >
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
                      {username}
                    </Texts>
                    <Texts size={"p5"} position={"left"}>
                      {permission}
                    </Texts>
                  </Holds>
                </Holds>
              </Grids>
            </Holds>
            {/* The first button that says personal */}
            <Holds className=" row-span-5 h-full gap-5 mt-10">
              <Holds>
                <Buttons
                  className={`
                    ${
                      page === 1 ? "bg-slate-400 " : "bg-app-blue"
                    } w-[90%] h-12 `}
                  href="/admins/employees"
                >
                  <Holds position={"row"} className="justify-evenly">
                    <Holds className="w-1/3 h-full ">
                      <Images
                        titleImg="/team.svg"
                        titleImgAlt="Personal Icon"
                        className="m-auto"
                        size={"50"}
                      />
                    </Holds>
                    <Texts size={"p6"}>Personnel</Texts>
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
                <Buttons
                  className={`
                    ${
                      page === 2 ? "bg-slate-400 " : "bg-app-blue"
                    } w-[90%] h-12 `}
                  href="/admins/assets"
                >
                  <Holds position={"row"} className="justify-evenly">
                    <Holds className="w-1/3 h-full ">
                      <Images
                        titleImg="/jobsite.svg"
                        titleImgAlt="Home Icon"
                        className="m-auto"
                        size={"50"}
                      />
                    </Holds>
                    <Texts size={"p6"}>Assets</Texts>
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
                <Buttons
                  className={`
                    ${
                      page === 3 ? "bg-slate-400 " : "bg-app-blue"
                    } w-[90%] h-12 `}
                  href="/admins/reports"
                >
                  <Holds position={"row"} className="justify-evenly">
                    <Holds className="w-1/3 h-full ">
                      <Images
                        titleImg="/form.svg"
                        titleImgAlt="Reports Icon"
                        className="m-auto"
                        size={"50"}
                      />
                    </Holds>
                    <Texts size={"p6"}>Reports</Texts>
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
        <Holds background={"white"} className=" h-full w-[5em] ml-3 ">
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

              <Holds className=" w-24 h-24 ">
                <Images
                  titleImg="/logo.svg"
                  titleImgAlt="logo"
                  className="my-auto"
                />
              </Holds>

              <Holds
                className="  w-24 h-24 "
                onClick={() => router.push("/admins/settings")}
              >
                <Images
                  titleImg="/person.svg"
                  titleImgAlt="Home Icon"
                  size={"80"}
                  className="m-auto"
                />
              </Holds>
            </Holds>
            <Holds className=" h-full gap-5 mt-10">
              <Holds>
                <Buttons
                  className={`
                    ${page === 1 ? "bg-slate-400 " : "bg-app-blue"} w-12 h-12 `}
                  href="/admins/employees"
                >
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
                <Buttons
                  className={`
                    ${page === 2 ? "bg-slate-400 " : "bg-app-blue"} w-12 h-12 `}
                  href="/admins/assets"
                >
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
                <Buttons
                  className={`
                    ${page === 3 ? "bg-slate-400 " : "bg-app-blue"} w-12 h-12 `}
                  href="/admins/reports"
                >
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
