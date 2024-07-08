"use client";

import { useTranslations } from "next-intl";

export default function User() {
  const t = useTranslations("ClockOutDashboard");
  const user = { firstName: "John", lastName: "Doe", date: "2022-01-01" };
  return (
    <div>
      <h2>
        {t("Name", { firstName: user.firstName, lastName: user.lastName })}
      </h2>
      <h2>{t("Date", { date: user.date })}</h2>
    </div>
  );
}
