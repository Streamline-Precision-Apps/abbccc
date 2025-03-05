import { useNotification } from "@/app/context/NotificationContext";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { useTranslations } from "next-intl";

export function TimesheetReport({
  setStartDate,
  setEndDate,
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
}) {
  const t = useTranslations("Admins");
  const { setNotification } = useNotification();

  const checkEndDate = (endDate: string) => {
    if (new Date(endDate) < new Date(startDate)) {
      setNotification(t("EndDateMustBeAfterStartDate"), "error");
      setEndDate(""); // Clear the invalid end date
    } else {
      setEndDate(endDate);
    }
  };

  const checkStartDate = (newStartDate: string) => {
    const start = new Date(newStartDate);
    const end = new Date(startDate);

    if (start > end) {
      setNotification(t("StartDateMustBeAfterEndDate"), "error");
      setEndDate(""); // Clear the end date if it becomes invalid
    }
    setStartDate(newStartDate);
  };

  return (
    <Holds
      background={"white"}
      className="row-start-2 row-end-11 h-full w-full"
    >
      <Holds position={"row"} className=" justify-between flex flex-wrap gap-2">
        <Holds className="w-full max-w-[200px] ">
          <Labels position={"left"} size={"p6"}>
            {t("StartDate")}
          </Labels>
          <Inputs
            variant={"default"}
            type={"date"}
            value={startDate}
            onChange={(e) => checkStartDate(e.target.value)}
          />
        </Holds>
        <Holds className="w-full max-w-[200px] ">
          <Labels position={"left"} size={"p6"}>
            {t("EndDate")}
          </Labels>
          <Inputs
            variant={"default"}
            type={"date"}
            value={endDate}
            onChange={(e) => checkEndDate(e.target.value)}
          />
        </Holds>
      </Holds>
    </Holds>
  );
}
