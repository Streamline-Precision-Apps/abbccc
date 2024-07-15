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
  const t = useTranslations("page1");
  const { breakTime, setBreakTime } = useSavedBreakTime();

  const handler = () => {
    setToggle(!display);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (display) {
      timer = setInterval(() => {
        setBreakTime((prevBreakTime) => prevBreakTime + 1);
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
        className="mb-2 flex justify-center m-auto items-center space-x-12 w-11/12 h-36 text-white bg-app-dark-blue rounded-lg lg:space-x-12 lg:h-20"
      >
        <h2 className="text-4xl">Break Time: </h2>
        <span className="w-1/4 bg-white text-2xl text-black py-3 px-2 rounded border-2 border-black rounded-2xl lg:text-2xl lg:p-3">
          {formatTime(breakTime)}
        </span>
      </button>
    </>
  ) : (
    <div className="w-11/12 mx-auto">
      <ViewHoursComponent toggle={setToggle} />
    </div>
  );
}
