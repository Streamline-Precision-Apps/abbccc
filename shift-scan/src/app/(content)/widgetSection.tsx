"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import DisplayBreakTime from "./displayBreakTime";
import { useEffect, useState } from "react";
import Hours from "./hours";
import { Holds } from "@/components/(reusable)/holds";
import { usePayPeriodTimeSheet } from "../context/PayPeriodTimeSheetsContext";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { PayPeriodTimesheets } from "@/lib/types";
import { z } from "zod";
import { Banners } from "@/components/(reusable)/banners";
import { Titles } from "@/components/(reusable)/titles";
import Capitalize from "@/utils/captitalize";
import capitalizeAll from "@/utils/capitalizeAll";
import Spinner from "@/components/(animations)/spinner";
import { UseTotalPayPeriodHours } from "@/app/(content)/calculateTotal";

const UserSchema = z.object({
  id: z.string(),
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  permission: z.enum(["USER", "ADMIN", "SUPERADMIN", "MANAGER"]).optional(),
  accountSetup: z.boolean().optional(),
  DOB: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

const SessionSchema = z.object({
  user: UserSchema.nullable(),
});

// Zod schema for PayPeriodTimesheets type
const PayPeriodTimesheetsSchema = z.object({
  startTime: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid date format",
  }),
  endTime: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid date format",
  }),
});

// Zod schema for props
const WidgetSectionPropsSchema = z.object({
  session: SessionSchema,
});

// Zod schema for API response for pay period timesheets
const PayPeriodSheetsArraySchema = z.array(PayPeriodTimesheetsSchema);

type Props = {
  session: Session;
  locale: string;
};

export default function WidgetSection({ session, locale }: Props) {
  // Validate the session prop using Zod
  try {
    WidgetSectionPropsSchema.parse({ session });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error in WidgetSection props:", error.errors);
    }
  }
  const date = new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
  });

  const [pageView, setPageView] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const f = useTranslations("Home");
  const w = useTranslations("Widgets");
  const e = useTranslations("Err-Msg");
  const [toggle, setToggle] = useState(true);
  const handleToggle = () => setToggle(!toggle);
  const permission = session.user?.permission;
  const accountSetup = session.user?.accountSetup;
  const t = useTranslations("Home");
  const { setPayPeriodTimeSheets } = usePayPeriodTimeSheet();
  const [payPeriodSheets, setPayPeriodSheets] = useState<PayPeriodTimesheets[]>(
    []
  );
  const user = session.user;
  // all the data will be rendered at once
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Start loading state
        setLoading(true);
        // Fetch pay period timesheets
        const payPeriodResponse = fetch("/api/getPayPeriodTimeSheets")
          .then((res) => res.json())
          .then((data) => {
            const validatedData = PayPeriodSheetsArraySchema.parse(data);
            const transformedData = validatedData.map((item) => ({
              ...item,
              startTime: new Date(item.startTime),
              endTime: new Date(item.endTime),
            }));
            setPayPeriodSheets(transformedData);
            setPayPeriodTimeSheets(transformedData);
          });

        // Fetch cookie value
        const pageViewResponse = fetch(
          "/api/cookies?method=get&name=currentPageView"
        )
          .then((res) => res.json())
          .then((data) => {
            setPageView(data || "");
          });

        // Wait for all API calls to complete
        await Promise.all([payPeriodResponse, pageViewResponse]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Stop loading when all data is loaded
        setLoading(false);
      }
    };

    fetchData();
  }, [setPayPeriodTimeSheets]);

  // moved the calulate total hours here
  UseTotalPayPeriodHours(payPeriodSheets);

  // Handle page redirects in a separate useEffect
  useEffect(() => {
    if (pageView === "dashboard") {
      router.push("/dashboard");
    }
    if (pageView === "removeLocalStorage") {
      setPageView("");
    }
    // Uncomment if necessary
    // if (!accountSetup) {
    //   router.push("/signin/signup");
    // }
  }, [pageView, router, accountSetup]);

  //-----------------------------------------------------------------------

  // Redirect to dashboard if user is an admin

  // if (
  //   session?.user.permission === "ADMIN" ||
  //   (session?.user.permission === "SUPERADMIN" && window.innerWidth >= 820)
  // ) {
  //   router.push("/admins");
  // }
  if (loading) {
    return (
      <>
        <Holds className="row-span-2 bg-app-blue bg-opacity-20 w-full p-10 h-[80%] my-2 rounded-[10px] animate-pulse"></Holds>
        <Holds
          background={"white"}
          className="row-span-5 h-full justify-center items-center animate-pulse"
        >
          <Spinner />
        </Holds>
      </>
    );
  }

  return (
    <>
      <Holds className="row-span-2 bg-app-blue bg-opacity-20 w-full p-4 my-2 rounded-[10px]">
        {pageView === "" && (
          <Banners>
            <Titles text={"white"} size={"h2"}>
              {t("Banner")}
              {t("Name", {
                firstName: Capitalize(user.firstName),
              })}
              !
            </Titles>
            <Texts text={"white"} size={"p3"}>
              {t("Date", { date: capitalizeAll(date) })}
            </Texts>
          </Banners>
        )}
        {pageView === "break" && (
          <Banners>
            <Titles text={"white"} size={"h2"}>
              {t("EnjoyYourBreak")}
            </Titles>
            <Texts text={"white"} size={"p3"}>
              {t("HitReturnToClockBackIn")}
            </Texts>
          </Banners>
        )}
      </Holds>
      <Holds background={"white"} className="row-span-5 h-full">
        <Contents width={"section"} className="py-5">
          <Grids rows={"11"} cols={"2"} gap={"5"}>
            {pageView === "break" ? (
              <>
                {toggle ? (
                  <Holds
                    className={
                      toggle
                        ? "col-span-2 row-span-3 gap-5 h-full"
                        : "col-span-2 row-span-11 gap-5 h-full"
                    }
                  >
                    <DisplayBreakTime
                      setToggle={handleToggle}
                      display={toggle}
                    />
                  </Holds>
                ) : (
                  <Holds className="col-span-2 row-span-11 gap-5 h-full">
                    <Hours
                      setToggle={handleToggle}
                      display={toggle}
                      loading={loading}
                    />
                  </Holds>
                )}
              </>
            ) : (
              <Holds
                className={
                  toggle
                    ? "col-span-2 row-span-3 gap-5 h-full"
                    : "col-span-2 row-span-11 gap-5 h-full"
                }
              >
                <Hours
                  setToggle={handleToggle}
                  display={toggle}
                  loading={loading}
                />
              </Holds>
            )}
            {toggle ? (
              <>
                {(permission === "ADMIN" ||
                  permission === "SUPERADMIN" ||
                  permission === "MANAGER") && (
                  <Holds
                    position={"row"}
                    className="col-span-2 row-span-4 gap-5 h-full"
                  >
                    <Buttons
                      background={"lightBlue"}
                      href="/dashboard/qr-generator"
                    >
                      <Holds>
                        <Images
                          titleImg="/qr.svg"
                          titleImgAlt="QR Code"
                          size={"40"}
                        />
                      </Holds>
                      <Holds>
                        <Texts size={"p3"}>{w("QR")}</Texts>
                      </Holds>
                    </Buttons>
                    <Buttons background={"lightBlue"} href="/dashboard/myTeam">
                      <Holds>
                        <Images
                          titleImg="/team.svg"
                          titleImgAlt="my team"
                          size={"40"}
                        />
                      </Holds>
                      <Holds>
                        <Texts size={"p3"}>{w("MyTeam")}</Texts>
                      </Holds>
                    </Buttons>
                  </Holds>
                )}
                {pageView === "break" ? (
                  <Holds className="col-span-2 row-span-8 gap-5 h-full">
                    <Buttons background={"orange"} href="/break">
                      <Holds className="my-auto">
                        <Holds size={"50"}>
                          <Images
                            titleImg="/clock-in.svg"
                            titleImgAlt="Clock In Icon"
                            size={"70"}
                          />
                        </Holds>
                        <Holds size={"50"}>
                          <Texts size={"p1"}>{f("Clock-btn-break")}</Texts>
                        </Holds>
                      </Holds>
                    </Buttons>
                  </Holds>
                ) : (
                  <Holds
                    className={
                      permission === "ADMIN" ||
                      permission === "SUPERADMIN" ||
                      permission === "MANAGER"
                        ? `col-span-2 row-span-4 gap-5 h-full`
                        : `col-span-2 row-span-8 gap-5 h-full`
                    }
                  >
                    <Buttons background={"green"} href="/clock">
                      {permission === "ADMIN" ||
                      permission === "SUPERADMIN" ||
                      permission === "MANAGER" ? (
                        <Holds position={"row"} className="my-auto">
                          <Holds size={"60"}>
                            <Texts size={"p1"}>{f("Clock-btn")}</Texts>
                          </Holds>
                          <Holds size={"40"}>
                            <Images
                              titleImg="/clock-in.svg"
                              titleImgAlt="Clock In Icon"
                              size={"70"}
                            />
                          </Holds>
                        </Holds>
                      ) : (
                        <Holds className="my-auto">
                          <Holds size={"50"}>
                            <Images
                              titleImg="/clock-in.svg"
                              titleImgAlt="Clock In Icon"
                              size={"70"}
                            />
                          </Holds>
                          <Holds size={"50"}>
                            <Texts size={"p1"}>{f("Clock-btn")}</Texts>
                          </Holds>
                        </Holds>
                      )}
                    </Buttons>
                  </Holds>
                )}
              </>
            ) : null}
          </Grids>
        </Contents>
      </Holds>
    </>
  );
}
