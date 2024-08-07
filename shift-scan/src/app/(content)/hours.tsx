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
      <Buttons onClick={handler} variant={"darkBlue"} size={"default"}>
        <h2 className="text-4xl">{t("PayPeriodHours")} </h2>
        <span className="w-1/4 bg-white text-2xl text-black py-3 px-2 rounded border-2 border-black rounded-2xl lg:text-2xl lg:p-3 ">
          {payPeriodHours}
        </span>
      </Buttons>
    </>
  ) : (
    <div className="w-11/12 mx-auto">
      <ViewHoursComponent toggle={setToggle} />
    </div>
  );
}
