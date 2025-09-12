import { useEffect, useState } from "react";
import { z } from "zod";
import { UseTotalPayPeriodHours } from "@/app/(content)/calculateTotal";
import { fetchWithOfflineCache } from "@/utils/offlineApi";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

type PayPeriodTimesheets = {
  startTime: Date; // Correct field name
  endTime: Date;
};

const PayPeriodTimesheetsSchema = z.object({
  startTime: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid date format",
  }),
  endTime: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid date format",
  }),
});
const PayPeriodSheetsArraySchema = z.array(PayPeriodTimesheetsSchema);

export const usePayPeriodData = (
  setPayPeriodTimeSheets: (
    payPeriodTimeSheets: PayPeriodTimesheets[] | null,
  ) => void,
) => {
  const [payPeriodSheets, setPayPeriodSheets] = useState<PayPeriodTimesheets[]>(
    [],
  );
  const [pageView, setPageView] = useState("");
  const [loading, setLoading] = useState(true);
  const online = useOnlineStatus();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch pay period timesheets
        const data = await fetchWithOfflineCache(
          "payPeriodTimeSheets",
          () => fetch("/api/getPayPeriodTimeSheets").then(res => res.json())
        );
        const validatedData = PayPeriodSheetsArraySchema.parse(data);

        const transformedData = validatedData.map((item) => ({
          ...item,
          startTime: new Date(item.startTime),
          endTime: new Date(item.endTime),
        }));

        setPayPeriodSheets(transformedData);
        setPayPeriodTimeSheets(transformedData);

        // Fetch page view cookie value
        const pageViewResponse = await fetch(
          "/api/cookies?method=get&name=currentPageView",
        );
        setPageView(pageViewData || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [online, setPayPeriodTimeSheets]); // Re-fetch when online status changes

  // Calculate total pay period hours
  UseTotalPayPeriodHours(payPeriodSheets);

  return { payPeriodSheets, pageView, setPageView, loading };
};
