import { Holds } from "@/components/(reusable)/holds";
import EmptyView from "../../../_pages/EmptyView";
import { useTranslations } from "next-intl";

export default function Jobsitemain() {
  const t = useTranslations("Admins");
  return (
    <Holds className="w-full h-full ">
      <EmptyView Children={<h1>{t("SelectAJobsiteToView")}</h1>} />
    </Holds>
  );
}
