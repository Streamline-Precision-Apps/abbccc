import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";

export default function TimesheetDescription() {
  const t = useTranslations("TimesheetDescription");

  return (
    <Holds className="h-fit w-full gap-1 px-4">
      <Texts size={"lg"} text={"white"} className="text-left font-bold">
        Timesheets Management
      </Texts>
      <Texts size={"sm"} text={"white"} className="text-left text-white">
        Create, manage, and track timesheet submissions
      </Texts>
    </Holds>
  );
}
