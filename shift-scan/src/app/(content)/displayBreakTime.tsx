"use client";
import { useTranslations } from "next-intl";
import ViewHoursComponent from "@/app/(content)/hoursControl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Texts } from "@/components/(reusable)/texts";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";

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
      <Buttons onClick={handler} background={"darkBlue"}>
        <Grids cols={"10"} rows={"3"}>
          <Holds className="col-start-1 col-end-6 row-span-3">
            <Texts text={"white"} size={"p2"}>
              {t("Break")}
            </Texts>
          </Holds>
          <Holds
            background={"white"}
            className="col-start-7 col-end-10 row-start-2 row-end-3 py-4 md:py-6 lg:py-8 border-[3px] border-black rounded-[10px] h-full"
          >
            <Holds className="h-full flex items-center justify-center">
              <Texts text={"black"} size={"p6"}>
                {formatTime(getBreakTime)}
              </Texts>
            </Holds>
          </Holds>
        </Grids>
      </Buttons>
    </>
  ) : (
    <div>
      <ViewHoursComponent toggle={setToggle} />
    </div>
  );
}
