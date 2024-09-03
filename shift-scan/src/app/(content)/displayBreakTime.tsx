"use client";
import { useTranslations } from "next-intl";
import ViewHoursComponent from "@/app/(content)/hoursControl";
import { useSavedBreakTime } from "@/app/context/SavedBreakTimeContext";
import { useEffect } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Texts } from "@/components/(reusable)/texts";
import { Contents } from "@/components/(reusable)/contents";

interface BreakTimeProps {
  display: boolean;
  setToggle: (toggle: boolean) => void;
}

export default function DisplayBreakTime({
  setToggle,
  display,
}: BreakTimeProps) {
  const t = useTranslations("Home");
  const { breakTime: getBreakTime, setBreakTime } = useSavedBreakTime();

  const handler = () => {
    setToggle(!display);
  };

  useEffect(() => {
    const savedBreakTime = localStorage.getItem("breakTime");
    if (savedBreakTime) {
      setBreakTime(parseInt(savedBreakTime, 10));
    }
  }, [setBreakTime]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (display) {
      timer = setInterval(() => {
        setBreakTime((prevBreakTime) => {
          const newBreakTime = prevBreakTime + 1;
          localStorage.setItem("breakTime", newBreakTime.toString());
          return newBreakTime;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [display, setBreakTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return display ? (
    <>
      <Buttons 
        onClick={handler} 
        variant={"darkBlue"} 
        size={"hours"}
      >
        <Texts variant={"totalHours"} size={"p0"}>{t('Break')}</Texts>
        <Contents variant={"white"} size={"hoursBtn"}>
        <Texts variant={"default"} size={"p2"}>
          {formatTime(getBreakTime)}
        </Texts>
        </Contents>
      </Buttons>
    </>
  ) : (
    <div>
      <ViewHoursComponent toggle={setToggle} />
    </div>
  );
}
