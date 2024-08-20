"use client";
import { useTranslations } from "next-intl";
import ViewHoursComponent from "@/app/(content)/hoursControl";
import { useSavedPayPeriodHours } from "../context/SavedPayPeriodHours";
import { useSavedDailyHours } from "../context/SavedDailyHours";
import { Buttons } from "@/components/(reusable)/buttons";

// Assuming User has at least these fields, adjust accordingly

interface HoursProps {
  display: boolean;
  setToggle: (toggle: boolean) => void;
}

export default function Hours({ setToggle, display }: HoursProps) {
  const t = useTranslations("Home");
  const { payPeriodHours } = useSavedPayPeriodHours();
  
  const handler = () => {
    setToggle(!display);
  };

  return display ? (
    <>
      <Buttons 
        onClick={handler} 
        variant={"darkBlue"} 
        size={"hours"}
      >
        <h2>{t("PayPeriodHours")} </h2>
        <span>
          {payPeriodHours}
        </span>
      </Buttons>
    </>
  ) : (
    <div className="col-span-2">
      <ViewHoursComponent toggle={setToggle} />
    </div>
  );
}
