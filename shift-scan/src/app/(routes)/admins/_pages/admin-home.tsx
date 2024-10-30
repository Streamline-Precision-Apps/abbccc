"use client";
import Spinner from "@/components/(animations)/spinner";
import { Holds } from "@/components/(reusable)/holds";
import AdminHours from "./AdminHours";
import { Texts } from "@/components/(reusable)/texts";
import { useEffect, useMemo, useState } from "react";
import { usePayPeriodHours } from "@/app/context/PayPeriodHoursContext";
import { usePayPeriodTimeSheet } from "@/app/context/PayPeriodTimeSheetsContext";
import { PayPeriodTimesheets } from "@/lib/types";
import { z } from "zod";

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
  const [payPeriodSheets, setPayPeriodSheets] = useState<PayPeriodTimesheets[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getPayPeriodTimeSheets");
        const data = await response.json();
        console.log(data);

        // Validate fetched data with Zod
        const validatedData = PayPeriodSheetsArraySchema.parse(data);
        const transformedData = validatedData.map((item) => ({
          ...item,
          startTime: new Date(item.startTime),
        }));
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
    };

    fetchData();
  }, [setPayPeriodTimeSheets]);

  // Calculate total pay period hours
  const totalPayPeriodHours = useMemo(() => {
    return payPeriodSheets
      .filter((sheet: PayPeriodTimesheets) => sheet.duration !== null)
      .reduce(
        (total, sheet: PayPeriodTimesheets) => total + (sheet.duration ?? 0),
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
      ) : (
        <Holds className="w-full h-full flex items-center justify-center">
          <Holds
            background={"darkBlue"}
            className="h-fit border-0 w-[90%] md:w-[70%] lg:w-[60%] xl:w-[40%]  "
          >
            <Holds className="w-full h-full pt-4">
              <Holds className="w-full  px-2">
                <AdminHours />
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
      )}
    </Holds>
  );
}
