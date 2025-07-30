"use client";
import Spinner from "@/components/(animations)/spinner";
import { Holds } from "@/components/(reusable)/holds";
import AdminHours from "./AdminHours";
import { Texts } from "@/components/(reusable)/texts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePayPeriodHours } from "@/app/context/PayPeriodHoursContext";
import { usePayPeriodTimeSheet } from "@/app/context/PayPeriodTimeSheetsContext";
import { PayPeriodTimesheets } from "@/lib/types";
import { z } from "zod";
import { Images } from "@/components/(reusable)/images";
import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";

const PayPeriodTimesheetsSchema = z.object({
  startTime: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    error: "Invalid date format",
  }),
  endTime: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    error: "Invalid date format",
  }),
});

const PayPeriodSheetsArraySchema = z.array(PayPeriodTimesheetsSchema);

export default function AdminHome() {
  const [loading, setLoading] = useState(false);
  const { payPeriodHours, setPayPeriodHours } = usePayPeriodHours();
  const { setPayPeriodTimeSheets } = usePayPeriodTimeSheet();
  const [toggle, setToggle] = useState(true);
  const [payPeriodSheets, setPayPeriodSheets] = useState<PayPeriodTimesheets[]>(
    []
  );

  const t = useTranslations("Admins");

  // Load cached sheets from localStorage
  useEffect(() => {
    const storedSheets = localStorage.getItem("payPeriodSheets");
    if (storedSheets) {
      setPayPeriodSheets(JSON.parse(storedSheets));
    }
  }, []);

  // Fetch data from the API
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/getPayPeriodTimeSheets");
      const data = await response.json();

      // Validate and transform the data
      const validatedData = PayPeriodSheetsArraySchema.parse(data);
      const transformedData = validatedData.map((item) => ({
        ...item,
        startTime: new Date(item.startTime),
        endTime: new Date(item.endTime),
      }));
      // Cache in localStorage
      localStorage.setItem("payPeriodSheets", JSON.stringify(transformedData));
      setPayPeriodSheets(transformedData);
      setPayPeriodTimeSheets(transformedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error in fetched pay period sheets:", error);
      } else {
        console.error("Error fetching pay period timesheets:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [setPayPeriodTimeSheets]);

  // Fetch data if no sheets are loaded
  useEffect(() => {
    if (!payPeriodSheets.length) fetchData();
  }, [fetchData, payPeriodSheets.length]);

  // Calculate total hours using the duration field
  const totalPayPeriodHours = useMemo(() => {
    if (!payPeriodSheets.length) return 0;
    return payPeriodSheets
      .filter(
        (sheet: PayPeriodTimesheets) =>
          sheet.startTime !== null || sheet.endTime !== null
      )
      .reduce(
        (total, sheet: PayPeriodTimesheets) =>
          total +
          (new Date(sheet.endTime).getTime() -
            new Date(sheet.startTime).getTime()) /
            (1000 * 60 * 60),
        0
      );
  }, [payPeriodSheets]);

  useEffect(() => {
    setPayPeriodHours(totalPayPeriodHours.toFixed(2));
  }, [totalPayPeriodHours, setPayPeriodHours]);

  return (
    <Holds className="w-full h-full">
      {loading ? (
        <Holds size={"40"} className="h-3/4">
          <Holds className="w-full h-full py-4">
            <Spinner />
          </Holds>
        </Holds>
      ) : toggle ? (
        <Holds className="w-full h-full flex items-center justify-center">
          <Holds
            background={"darkBlue"}
            className="h-fit border-0 w-[90%] md:w-[80%] lg:w-[70%] xl:w-[50%]"
          >
            <Holds className="w-full h-full pt-2">
              <Holds className="w-full px-2">
                <Images
                  titleImg="/statusDeniedFilled.svg"
                  titleImgAlt="adminHome"
                  className="w-[6%] sm:w-[3%] md:w-[3%] lg:w-[3%] p-px bg-app-red rounded-sm"
                  position={"right"}
                  onClick={() => setToggle(!toggle)}
                />
                {toggle && <AdminHours />}
              </Holds>
              <Holds
                background={"white"}
                className="h-[15%] p-4 rounded-t-none flex items-center justify-center"
              >
                <Texts className="text-center">
                  {t("Totalhoursthispayperiod")} {payPeriodHours}
                </Texts>
              </Holds>
            </Holds>
          </Holds>
        </Holds>
      ) : (
        <Holds className="w-full h-full flex items-end justify-end px-4">
          <Buttons
            background={"darkBlue"}
            onClick={() => setToggle(!toggle)}
            position={"right"}
            className="w-fit h-fit rounded-2xl"
          >
            <Images
              titleImg={"/Calendar.svg"}
              titleImgAlt="adminHome"
              className="m-auto p-1"
              size={"60"}
            />
          </Buttons>
        </Holds>
      )}
    </Holds>
  );
}
