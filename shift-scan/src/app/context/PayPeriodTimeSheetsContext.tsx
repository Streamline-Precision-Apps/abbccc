// This is used to store the timesheets for the whole pay period. It is used to display the daily hours in the home screen.

"use client";
import { PayPeriodTimesheets } from "@/lib/types";
import React, { createContext, useState, ReactNode, useContext } from "react";

interface PayPeriodTimeSheetProps {
  payPeriodTimeSheet: PayPeriodTimesheets[] | null;
  setPayPeriodTimeSheets: (
    payPeriodTimeSheets: PayPeriodTimesheets[] | null
  ) => void; // Corrected here
}

const PayPeriodTimeSheet = createContext<PayPeriodTimeSheetProps | undefined>(
  undefined
);

export const PayPeriodTimeSheetProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // creates a state
  const [payPeriodTimeSheet, setPayPeriodTimeSheet] = useState<
    PayPeriodTimesheets[] | null
  >(null);
  // when the provider is called it will return the value below
  return (
    <PayPeriodTimeSheet.Provider
      value={{
        payPeriodTimeSheet,
        setPayPeriodTimeSheets: setPayPeriodTimeSheet,
      }}
    >
      {" "}
      {/* Corrected here */}
      {children}
    </PayPeriodTimeSheet.Provider>
  );
};
// this is used to get the value
export const usePayPeriodTimeSheet = () => {
  const context = useContext(PayPeriodTimeSheet);
  if (context === undefined) {
    throw new Error(
      "PayPeriodTimeSheet must be used within a PayPeriodTimeSheetProvider"
    );
  }
  return context;
};
