"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { NModals } from "@/components/(reusable)/newmodals";
import PasswordModal from "./sidebar/PasswordModal";
import LanguageModal from "./sidebar/LanguageModal";
import SignOutModal from "./sidebar/SignOutModal";
import { useTranslations } from "next-intl";

const Sidebar = () => {
  const t = useTranslations("Admins");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [username, setUsername] = useState<string>("");
  const { data: session } = useSession();
  const userId = session?.user.id;
  const permission = session?.user.permission;
  const router = useRouter();

  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
  const [isOpenLanguageSelector, setIsOpenLanguageSelector] = useState(false);
  const [isOpenSignOut, setIsOpenSignOut] = useState(false);

  const isPersonnelPage = pathname.includes("/admins/personnel");
  const isAssetsPage = pathname.includes("/admins/assets");
  const isReportsPage = pathname.includes("/admins/reports");
  const inboxPage = pathname.includes("/admins/inbox");

  useEffect(() => {
    setUsername(`${session?.user.firstName} ${session?.user.lastName}`);
  }, [session?.user.firstName, session?.user.lastName]);
  return (
    <>
      {/*----------------------------------------------------------------------------------------------------------*/}
      {/*------------------------------- Displays the full extended sidebar ---------------------------------------*/}
      {/*----------------------------------------------------------------------------------------------------------*/}
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
                  onClick={() => router.push(`/admins/personnel/${userId}`)}
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
            <Holds className=" row-span-4 h-full gap-5 mt-10">
              <Holds>
                <Buttons
                  className={`
                    ${
                      isPersonnelPage ? "bg-app-gray " : "bg-app-blue"
                    } w-[90%] h-12 `}
                  href="/admins/personnel"
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
                    <Texts size={"p6"}>{t("Personnel")}</Texts>
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
                      isAssetsPage ? "bg-app-gray " : "bg-app-blue"
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
                    <Texts size={"p6"}>{t("Assets")}</Texts>
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
                      isReportsPage ? "bg-app-gray " : "bg-app-blue"
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
                    <Texts size={"p6"}>{t("Reports")}</Texts>
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
              {/* The button that says Reports */}
              <Holds>
                <Buttons
                  className={`
                    ${
                      inboxPage ? "bg-app-gray " : "bg-app-blue"
                    } w-[90%] h-12 `}
                  href="/admins/inbox"
                >
                  <Holds position={"row"} className="justify-evenly">
                    <Holds className="w-1/3 h-full ">
                      <Images
                        titleImg="/inbox.svg"
                        titleImgAlt="Inbox Icon"
                        className="m-auto"
                        size={"50"}
                      />
                    </Holds>
                    <Texts size={"p6"}>{t("Inbox")}</Texts>
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
            <Holds
              position={"row"}
              className="row-start-9 row-end-11 h-full gap-3 px-4"
            >
              {/*----------------------------------------------------------------------------------------------------------*/}
              {/*----------------------------------------------------------------------------------------------------------*/}
              {/* This is the password button */}
              <Buttons
                background={"white"}
                size={"50"}
                onClick={() => {
                  setIsOpenChangePassword(true);
                }}
                className="py-1"
              >
                <Images
                  titleImg="/key.svg"
                  titleImgAlt="Change Password Icon"
                  className="m-auto "
                />
              </Buttons>
              <NModals
                size={"medH"}
                isOpen={isOpenChangePassword}
                handleClose={() => setIsOpenChangePassword(false)}
              >
                <PasswordModal
                  setIsOpenChangePassword={() => setIsOpenChangePassword(false)}
                />
              </NModals>
              {/*----------------------------------------------------------------------------------------------------------*/}
              {/*----------------------------------------------------------------------------------------------------------*/}
              {/* This is the language button */}
              <Buttons
                background={"white"}
                size={"50"}
                onClick={() => {
                  setIsOpenLanguageSelector(true);
                }}
                className="py-1"
              >
                <Images
                  titleImg="/language.svg"
                  titleImgAlt="Language Settings Icon"
                  className="m-auto"
                />
              </Buttons>
              <NModals
                size={"medM"}
                isOpen={isOpenLanguageSelector}
                handleClose={() => setIsOpenLanguageSelector(false)}
              >
                <LanguageModal
                  setIsOpenLanguageSelector={() =>
                    setIsOpenLanguageSelector(false)
                  }
                />
              </NModals>
              {/*----------------------------------------------------------------------------------------------------------*/}
              {/*----------------------------------------------------------------------------------------------------------*/}
              {/* This is the sign out button */}
              <Buttons
                background={"white"}
                size={"50"}
                onClick={() => {
                  setIsOpenSignOut(true);
                }}
                className=""
              >
                <Images
                  titleImg="/end-day.svg"
                  titleImgAlt="Sign Out Icon"
                  className="m-auto p-2"
                />
              </Buttons>
              <NModals
                isOpen={isOpenSignOut}
                handleClose={() => setIsOpenSignOut(false)}
              >
                <SignOutModal
                  setIsOpenSignOut={() => setIsOpenSignOut(false)}
                />
              </NModals>
              {/*----------------------------------------------------------------------------------------------------------*/}
              {/*----------------------------------------------------------------------------------------------------------*/}
            </Holds>
          </Grids>
        </Holds>
      ) : (
        <Holds background={"white"} className=" h-full w-[5em] ml-3 ">
          {/*----------------------------------------------------------------------------------------------------------*/}
          {/*------------------------------------- Displays the mini menu --------------------------------------------*/}
          {/*----------------------------------------------------------------------------------------------------------*/}
          <Grids rows={"10"} gap={"5"} className="my-5">
            <Holds className="row-span-4 h-full">
              <Holds className="w-24">
                <Buttons background={"none"} size={"50"} onClick={toggle}>
                  <Images
                    titleImg="/drag.svg"
                    titleImgAlt="menu icon"
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
                onClick={() => router.push(`/admins/personnel/${userId}`)}
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
                    ${
                      isPersonnelPage ? "bg-app-gray " : "bg-app-blue"
                    } w-12 h-12 `}
                  href="/admins/personnel"
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
                    ${
                      isAssetsPage ? "bg-app-gray " : "bg-app-blue"
                    } w-12 h-12 `}
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
                    ${
                      isReportsPage ? "bg-app-gray " : "bg-app-blue"
                    } w-12 h-12 `}
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
              <Holds>
                <Buttons
                  className={`
                    ${inboxPage ? "bg-app-gray " : "bg-app-blue"} w-12 h-12 `}
                  href="/admins/inbox"
                >
                  <Holds position={"row"}>
                    <Images
                      titleImg="/inbox.svg"
                      titleImgAlt="Inbox Icon"
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
export default Sidebar;
