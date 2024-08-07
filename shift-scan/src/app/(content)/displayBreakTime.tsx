"use client";
import { useTranslations } from "next-intl";
import ViewHoursComponent from "@/app/(content)/hoursControl";
import { useSavedBreakTime } from "@/app/context/SavedBreakTimeContext";
import { useEffect } from "react";

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
      <button
        onClick={handler}
      >
        <h2>{t('Break')}</h2>
        <span>
          {formatTime(getBreakTime)}
        </span>
      </button>
    </>
  ) : (
    <div>
      <ViewHoursComponent toggle={setToggle} />
    </div>
  );
}
