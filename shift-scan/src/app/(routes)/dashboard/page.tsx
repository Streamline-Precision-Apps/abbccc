import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Buttons } from "@/components/(reusable)/buttons";
import { AnimatedHamburgerButton } from "@/components/(animations)/hamburgerMenu";
import { Banners } from "@/components/(reusable)/banners";
import { Titles } from "@/components/(reusable)/titles";
import { Texts } from "@/components/(reusable)/texts";
import capitalizeAll from "@/utils/capitalizeAll";
import Capitalize from "@/utils/captitalize";
import WidgetSection from "@/components/widgetSection";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import DbWidgetSection from "./dbWidgetSection";

export default async function Dashboard() {
 //------------------------------------------------------------------------
  // Authentication: Get the current user
  const session = await auth();
  const t = await getTranslations("Home");
  if (!session) {
    // Redirect or return an error if the user is not authenticated
    redirect('/signin');
  }

  const user = session.user;
  const userId = session.user.id;
  const permission = session.user.permission;

  // Get the current language from cookies
  const lang = cookies().get("locale");
  const locale = lang ? lang.value : "en";

  const date = new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="bg-gradient-to-b from-app-dark-blue to-app-blue pb-3 pt-10 h-dvh">
        <div className="w-[95%] sm:w-[85%] md:w-[75%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] h-full mx-auto">
          <div className="bg-green-300 h-full rounded-xl grid grid-rows-7">
            <div className="bg-pink-300 rounded-xl w-[100%] mx-auto row-span-1">
              <Holds position={"row"}
               className="">
                <Holds size={"30"}>
                  <Images 
                  titleImg="/logo.svg" 
                  titleImgAlt="logo" 
                  position={"left"} 
                  background={"none"} 
                  size={"80"}
                  className="m-2"/>
                </Holds>
                <Holds size={"70"}>
                  <AnimatedHamburgerButton/>
                </Holds>
              </Holds>
            </div>
            <div className="bg-blue-500 rounded-xl w-[100%] mx-auto row-span-1">
              <Holds className="">
                <Banners position={"flex"}>
                  <Titles text={"white"} size={"h1"}>{t("Banner")}</Titles>
                  <Texts text={"white"} size={"p4"}>{t("Date", { date: capitalizeAll(date) })}</Texts>
                </Banners>
              </Holds>
            </div>
            <div className="bg-white rounded-xl w-[100%] mx-auto row-span-5">
              <div className="w-[90%] mx-auto py-4">
                <Holds 
                position={"row"}
                className="row-span-1 col-span-2">
                  <Buttons 
                  href="/dashboard/qr-generator" 
                  background={"lightBlue"}
                  size={"widgetSm"}>
                    <Holds className="my-2">
                      <Images titleImg="/qr.svg" titleImgAlt="QR Code" background={"none"} size={"40"}/>
                      <Texts size={"p4"}>{t("QrGenerator")}</Texts>
                    </Holds>
                  </Buttons>
                  <Buttons 
                  href="/dashboard/myTeam" 
                  background={"lightBlue"}
                  size={"widgetSm"}>
                    <Holds className="my-2">
                      <Images titleImg="/team.svg" titleImgAlt="my team" background={"none"} size={"40"}/>
                      <Texts size={"p4"}>{t("MyTeam")}</Texts>
                    </Holds>
                  </Buttons>
                </Holds>
                <Holds 
                position={"row"}
                className="row-span-1 col-span-2">
                  <Buttons
                    background={"orange"}
                    size={"widgetSm"}
                    href="/dashboard/switch-jobs">
                    <Holds className="my-2">
                      <Images
                        titleImg="/jobsite.svg"
                        titleImgAlt="Jobsite Icon"
                        size={"40"}
                      ></Images>
                      <Texts size={"p4"}>{t("SwitchJobs")}</Texts>
                    </Holds>
                  </Buttons>
                  <Buttons
                  href="/dashboard/equipment"
                  background={"green"}
                  size={"widgetSm"}>
                    <Holds className="my-2">
                      <Images
                        titleImg="/equipment.svg"
                        titleImgAlt="Equipment Icon"
                        size={"40"}
                      ></Images>
                      <Texts size={"p4"}>{t("Equipment")}</Texts>
                    </Holds>
                  </Buttons>
                </Holds>
            <Holds 
            position={"row"}
            className="row-span-1 col-span-2">
              <Buttons
                href="/dashboard/forms"
                background={"green"}
                size={"widgetSm"}
              >
                <Holds className="my-2">
                  <Images
                    titleImg="/form.svg"
                    titleImgAlt="Forms Icon"
                    size={"40"}
                  ></Images>
                  <Texts size={"p4"}>{t("Forms")}</Texts>
                </Holds>
              </Buttons>
              <Buttons
                href="/dashboard/clock-out"
                background={"red"}
                size={"widgetSm"}
              >
                <Holds className="my-2">
                  <Images
                    titleImg="/clock-out.svg"
                    titleImgAlt="Clock Out Icon"
                    size={"40"}
                  ></Images>
                  <Texts size={"p4"}>{t("ClockOut")}</Texts>
                </Holds>
              </Buttons>
            </Holds>
                {/* <DbWidgetSection session={session} locale={locale}/> */}
              </div>
            </div>
          </div>
        </div>
    </div>
    // <Bases>
    //   <Contents>
    //     <Holds background={"white"}>
    //       <Contents width={"section"} height={"page"}>
    //         <Holds position={"row"} className="">
    //           <Holds size={"30"}>
    //             <Images 
    //             titleImg="/logo.svg" 
    //             titleImgAlt="logo" 
    //             position={"left"} 
    //             background={"none"} 
    //             size={"full"} />
    //           </Holds>
    //           <Holds size={"70"}>
    //             <AnimatedHamburgerButton/>
    //           </Holds>
    //         </Holds>
    //         <Holds className="">
    //           <Banners position={"flex"}>
    //             <Titles text={"black"} size={"h1"}>{t("Banner")}</Titles>
    //             <Texts text={"black"} size={"p4"}>{t("Date", { date: capitalizeAll(date) })}</Texts>
    //           </Banners>
    //         </Holds>
    //         <Holds size={"full"}>
    //           <Texts text={"black"} size={"p2"}>
    //             {t("Name", {
    //               firstName: Capitalize(user.firstName),
    //               lastName: Capitalize(user.lastName),
    //             })}
    //           </Texts>
    //         </Holds>
    //         <DbWidgetSection session={session} locale={locale}/> 
    //       </Contents>
    //     </Holds>
    //   </Contents>
    // </Bases>
  
  );
}
