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

const PayPeriodTimesheetsSchema = z.object({
  startTime: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid date format",
  }),
  duration: z.number().nullable(),
});
// Zod schema for API response for pay period timesheets
const PayPeriodSheetsArraySchema = z.array(PayPeriodTimesheetsSchema);

export default function AdminHome() {
  const [loading, setLoading] = useState(false);
  const { payPeriodHours, setPayPeriodHours } = usePayPeriodHours();
  const { setPayPeriodTimeSheets } = usePayPeriodTimeSheet();
  const [toggle, setToggle] = useState(true);
  const [payPeriodSheets, setPayPeriodSheets] = useState<PayPeriodTimesheets[]>(
    []
  );

  useEffect(() => {
    const storedSheets = localStorage.getItem("payPeriodSheets");
    if (storedSheets) {
      setPayPeriodSheets(JSON.parse(storedSheets));
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/getPayPeriodTimeSheets");
      const data = await response.json();

      const validatedData = PayPeriodSheetsArraySchema.parse(data);
      const transformedData = validatedData.map((item) => ({
        ...item,
        startTime: new Date(item.startTime),
      }));

      localStorage.setItem("payPeriodSheets", JSON.stringify(transformedData)); // Cache in localStorage
      setPayPeriodSheets(transformedData);
      setPayPeriodTimeSheets(transformedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(
          "Validation error in fetched pay period sheets:",
          error.errors
        );
      } else {
        console.error("PayPeriod-Fetch", error);
      }
    } finally {
      setLoading(false);
    }
  }, [setPayPeriodTimeSheets]);

  useEffect(() => {
    if (!payPeriodSheets.length) fetchData();
  }, [fetchData, payPeriodSheets.length]);

  const totalPayPeriodHours = useMemo(() => {
    return payPeriodSheets
      .filter((sheet) => sheet.duration !== null)
      .reduce((total, sheet) => total + (sheet.duration ?? 0), 0);
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
      ) : toggle === true ? (
        <Holds className="w-full h-full flex items-center justify-center">
          <Holds
            background={"darkBlue"}
            className="h-fit border-0 w-[90%] md:w-[80%] lg:w-[70%] xl:w-[50%]  "
          >
            <Holds className="w-full h-full pt-2">
              <Holds className="w-full px-2">
                <Images
                  titleImg="/x.svg"
                  titleImgAlt="adminHome"
                  className="w-[6%] sm:w-[3%] md:w-[3%] lg:w-[3%] p-[1px] bg-app-red rounded"
                  position={"right"}
                  onClick={() => setToggle(!toggle)}
                />
                {toggle && <AdminHours />}
              </Holds>
              <Holds
                background={"white"}
                className=" h-[15%] p-4 rounded-t-none flex items-center justify-center"
              >
                <Texts className="text-center ">
                  Total hours this pay period: {payPeriodHours}
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
              titleImg="/calendar.svg"
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
