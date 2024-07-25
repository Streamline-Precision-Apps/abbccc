import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export const User = () => {
  const t = useTranslations("ManagerButtons");
  const router = useRouter();
  const loadClockOutPage = () => {
    router.push("/dashboard/clock-out");
  };
  function loadPage(href : string) {
    router.push(href);
  }
  return (
    <>
      <button
        className="bg-orange-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded"
        onClick={() => loadPage("/dashboard/switch-jobs")}>  
        {t("SwitchJobs")}
      </button>

      <button
        className="bg-green-300 hover:bg-gray-400 text-gray-800 font-semibold py-8 px-16 border border-gray-400  font-bold rounded"
        onClick={() => loadPage("/dashboard/equipment")}>  
        {t("Equipment")}
      </button>

      <button
        className="bg-blue-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded"
        onClick={() => {
          // < link to the Forms page />
        }}
      >
        {t("Forms")}
      </button>

      <button
        className="bg-red-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded"
        onClick={() => {
          loadClockOutPage();
        }}
      >
        {t("ClockOut")}
      </button>
    </>
  );
};
