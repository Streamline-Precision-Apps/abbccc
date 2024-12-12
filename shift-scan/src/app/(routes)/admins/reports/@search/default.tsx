import { Holds } from "@/components/(reusable)/holds";
import { useTranslations } from "next-intl";

export default function ReportDefault() {
  const t = useTranslations("Admins");
  return (
    <Holds>
      <h1>{t("Reports")}</h1>
    </Holds>
  );
}
