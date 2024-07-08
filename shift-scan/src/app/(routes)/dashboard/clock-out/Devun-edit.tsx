"use server";

import ClockOutButtons from "@/components/clockOutButtons";
import { useTranslations } from "next-intl";
import User from "./user";

export default async function Dashboard() {
  const t = useTranslations("ClockOutDashboard");
  return (
    <>
      <div className="flex flex-col items-center space-y-4 ">
        {/* <UseModal show={true} onClose={CloseModal} children={<h1>Modal Content</h1>} /> */}
        <User />
        <h1>{t("Banner")}</h1>
        <ClockOutButtons />
        <h2>{t("lN1")}</h2>
      </div>
    </>
  );
}
