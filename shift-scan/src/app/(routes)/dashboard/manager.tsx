import { useTranslations } from "next-intl";

export const Manager = () => {
  const t = useTranslations("ManagerButtons");
  return (
    <>
      <button
        className="bg-blue-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded"
        onClick={() => {
          // < link to my team page  />
        }}
      >
        {t("MyTeam")}
      </button>

      <button
        className="bg-blue-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400  font-bold rounded"
        onClick={() => {
          // < link to QR generator page />
        }}
      >
        {t("QrGenerator")}
      </button>
    </>
  );
};
