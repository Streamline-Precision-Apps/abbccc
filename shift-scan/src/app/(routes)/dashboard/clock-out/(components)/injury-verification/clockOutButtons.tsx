"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import "@/app/globals.css";
import { useState } from "react";

const ClockOutButtons = () => {
  const t = useTranslations("ClockOutButtons");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleNavigation = async (bt: string) => {
    try {
      // bt = buttonType
      console.log(`Navigating to /dashboard/clock-out/log?bt=${bt}`); // Debug line
      router.push(`/dashboard/clock-out/log?bt=${bt}`);
    } catch (err) {
      console.error("Navigation error:", err);
      setError("Failed to navigate. Please try again.");
    }
  };

  const handleHomeNavigation = async () => {
    try {
      router.push("/dashboard");
    } catch (err) {
      console.error("Navigation error:", err);
      setError("Failed to navigate. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 grid-rows-2 gap-4">
      {error && <div className="text-red-500">{error}</div>}
      <button
        className="bg-orange-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded"
        onClick={() => handleNavigation("b")} // b = break
      >
        {t("Break")}
      </button>

      <button
        className="bg-red-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded"
        onClick={() => handleNavigation("ewd")} // ewd = end work day
      >
        {t("End")}
      </button>

      <button
        className="bg-blue-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded"
        onClick={handleHomeNavigation}
      >
        {t("Home")}
      </button>
    </div>
  );
};

export default ClockOutButtons;
