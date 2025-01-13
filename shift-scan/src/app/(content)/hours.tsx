"use client";
import { useTranslations } from "next-intl";
import ViewHoursComponent from "@/app/(content)/hoursControl";
import { usePayPeriodHours } from "../context/PayPeriodHoursContext";
import { Buttons } from "@/components/(reusable)/buttons";
import { Texts } from "@/components/(reusable)/texts";
import { Holds } from "@/components/(reusable)/holds";
import Spinner from "@/components/(animations)/spinner";
import { Contents } from "@/components/(reusable)/contents";

// Assuming User has at least these fields, adjust accordingly

type HoursProps = {
  display: boolean;
  setToggle: (toggle: boolean) => void;
  loading: boolean;
};

export default function Hours({ setToggle, display, loading }: HoursProps) {
  const t = useTranslations("Home");
  const { payPeriodHours } = usePayPeriodHours();

  const handler = () => {
    setToggle(!display);
  };
  if (loading)
    return (
      <Buttons background={"darkBlue"} onClick={handler}>
        <Contents width={"section"}>
          <Holds position={"row"} className="my-auto">
            <Holds className="w-[60%]">
              <Texts text={"white"} size={"p2"}>
                {t("PayPeriodHours")}
              </Texts>
            </Holds>
            <Holds background={"white"} className="py-1 w-[40%]">
              <Spinner size={30} />
            </Holds>
          </Holds>
        </Contents>
      </Buttons>
    );

  return display ? (
    <Buttons background={"darkBlue"} onClick={handler}>
      <Contents width={"section"}>
        <Holds position={"row"} className="my-auto ">
          <Holds className="w-[60%]">
            <Texts text={"white"} size={"p2"}>
              {t("PayPeriodHours")}
            </Texts>
          </Holds>
          <Holds background={"white"} className="py-1 w-[40%]">
            <Texts text={"black"} size={"p4"}>
              {payPeriodHours} {t("Unit")}
            </Texts>
          </Holds>
        </Holds>
      </Contents>
    </Buttons>
  ) : (
    <ViewHoursComponent toggle={setToggle} />
  );
}
