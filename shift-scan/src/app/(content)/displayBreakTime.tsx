"use client";
import { useTranslations } from "next-intl";
import ViewHoursComponent from "@/app/(content)/hoursControl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Texts } from "@/components/(reusable)/texts";
import { Holds } from "@/components/(reusable)/holds";

type BreakTimeProps = {
  display: boolean;
  setToggle: (toggle: boolean) => void;
  getBreakTime: number;
};

export default function DisplayBreakTime({
  setToggle,
  display,
  getBreakTime,
}: BreakTimeProps) {
  const t = useTranslations("Home");

  const handler = () => {
    setToggle(!display);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return display ? (
    <>
      <Buttons onClick={handler} background={"orange"}>
        <Holds position={"row"} className="my-auto p-4">
          <Holds className="w-3/4">
            <Texts text={"black"} size={"p2"}>
              {t("Break")}
            </Texts>
          </Holds>
          <Holds
            background={"white"}
            className="w-1/4 py-2 border-[3px] border-black rounded-[10px] "
          >
            <Texts text={"black"} size={"p6"}>
              {formatTime(getBreakTime)}
            </Texts>
          </Holds>
        </Holds>
      </Buttons>
    </>
  ) : (
    <div>
      <ViewHoursComponent toggle={setToggle} />
    </div>
  );
}
