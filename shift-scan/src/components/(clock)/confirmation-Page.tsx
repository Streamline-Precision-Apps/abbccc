"use client";
import { useTranslations } from "next-intl";
import { Titles } from "../(reusable)/titles";
import RedirectAfterDelay from "../redirectAfterDelay";

interface ConfirmationPageProps {
  option: string;
  savedCostCode?: string | null;
  scanResult?: string;
  truckScanData: string | null;
  type: string;
  startingMileage?: number | null;
  locale: string;
}

export const ConfirmationPage = ({
  option,
  savedCostCode,
  scanResult,
  truckScanData,
  type,
  startingMileage,
  locale,
}: ConfirmationPageProps) => {
  const t = useTranslations("Clock");
  return (
    <div>
      <Titles size="h1">{t("Confirmation-job-message-1")}</Titles>
      {option === "break" && (
        <Titles size="h4">Hope you enjoyed your Break!</Titles>
      )}
      {type === "switchJobs" ? (
        <>
          <Titles size="h4">{t("Confirmation-job-message-3")}</Titles>
          <Titles size="h4">{t("Confirmation-job-message-4")}</Titles>
        </>
      ) : (
        <Titles size="h4">{t("Confirmation-job-message-2")}</Titles>
      )}
      <Titles size="h2">
        {t("JobSite-label")} {scanResult}
      </Titles>
      <Titles size="h2">
        {t("CostCode-label")} {savedCostCode}
      </Titles>
      {truckScanData && (
        <Titles size="h2">
          {t("Truck-label")} {truckScanData}
        </Titles>
      )}
      {truckScanData && (
        <Titles size="h2">
          {t("Mileage")} {startingMileage}
        </Titles>
      )}
      <Titles size="h2">
        {t("Confirmation-time")}{" "}
        {new Date().toLocaleDateString(locale, {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })}
      </Titles>
      <RedirectAfterDelay delay={5000} to="/dashboard" />
    </div>
  );
};
