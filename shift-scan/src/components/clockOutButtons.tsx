"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import "@/app/globals.css";

const ClockOutButtons = () => {
  // TODO: Add Translations
  const t = useTranslations("ClockOutButtons");
  const router = useRouter();
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 ">
      <button
        className="bg-orange-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded"
        onClick={() => {
          router.push(`/clock-out/before-you-go${`?q=break-page`}`);
        }}
      >
        {/* {t("Take a break")} */}
        Take a break
      </button>

      <button
        className="bg-red-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded"
        onClick={() => {
          router.push(`/clock-out/before-you-go${`?q=end-work-day`}`);
        }}
      >
        {/* {t("End work day")} */}
        End work day
      </button>

      <button
        className="bg-blue-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded"
        onClick={() => {}}
      >
        {/* {t("Return home")} */}
        Return home
      </button>
    </div>
  );
};

export default ClockOutButtons;
