import { PayPeriodTimesheets } from "@/lib/types";
import { useMemo, useEffect, useState } from "react";
import { usePayPeriodHours } from "../context/PayPeriodHoursContext";

export const UseTotalPayPeriodHours = (
  payPeriodSheets: PayPeriodTimesheets[]
) => {
  const { setPayPeriodHours } = usePayPeriodHours();

  const totalHours = useMemo(() => {
    if (!payPeriodSheets.length) return 0;
    return payPeriodSheets
      .filter((sheet) => sheet.startTime !== null)
      .reduce(
        (total, sheet) =>
          total +
          (new Date(sheet.endTime).getTime() -
            new Date(sheet.startTime).getTime()) /
            (1000 * 60 * 60),
        0
      );
  }, [payPeriodSheets]);

  useEffect(() => {
    setPayPeriodHours(totalHours.toFixed(1));
  }, [totalHours, setPayPeriodHours]);
};
