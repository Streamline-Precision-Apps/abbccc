"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import DashboardButtons from "@/components/dashboard-buttons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/Holds";
import { Titles } from "@/components/(reusable)/titles";
import { Headers } from "@/components/(reusable)/headers";
import { Banners } from "@/components/(reusable)/banners";
import { Texts } from "@/components/(reusable)/texts";
import { Footers } from "@/components/(reusable)/footers";
import { clockProcessProps, CustomSession, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useDBJobsite, useDBCostcode, useDBEquipment} from "@/app/context/dbCodeContext";
import { useRecentDBJobsite, useRecentDBCostcode, useRecentDBEquipment} from "@/app/context/dbRecentCodesContext";
import { getAuthStep} from "@/app/api/auth";
import { Logs } from "@/lib/types";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";

export default function Content({
locale,
jobCodes,
costCodes,
equipment,
recentJobSites,
recentCostCodes,
recentEquipment,
logs,
}: clockProcessProps) {
const t = useTranslations("dashboard");
const router = useRouter();
const { data: session } = useSession() as { data: CustomSession | null };
const date = new Date().toLocaleDateString(locale, {
year: "numeric",
month: "short",
day: "numeric",
weekday: "long",
});
const { jobsiteResults, setJobsiteResults } = useDBJobsite();
const {
recentlyUsedJobCodes,
setRecentlyUsedJobCodes,
} = useRecentDBJobsite();
const { costcodeResults, setCostcodeResults } = useDBCostcode();
const {
recentlyUsedCostCodes,
setRecentlyUsedCostCodes,
} = useRecentDBCostcode();
const { equipmentResults, setEquipmentResults } = useDBEquipment();
const {
recentlyUsedEquipment,
setRecentlyUsedEquipment,
} = useRecentDBEquipment();
const [equipmentLogsResults, setEquipmentLogsResults] = useState<Logs[]>([]);

const [user, setData] = useState<User>({
id: "",
firstName: "",
lastName: "",
permission: undefined,
});

useEffect(() => {
if (jobsiteResults.length === 0) {
    setJobsiteResults(jobCodes);
}
if (costcodeResults.length === 0) {
    setCostcodeResults(costCodes);
}
if (equipmentResults.length === 0) {
    setEquipmentResults(equipment);
}
if (recentlyUsedJobCodes.length === 0) {
    setRecentlyUsedJobCodes(recentJobSites);
}
if (recentlyUsedCostCodes.length === 0) {
    setRecentlyUsedCostCodes(recentCostCodes);
}
if (recentlyUsedEquipment.length === 0) {
    setRecentlyUsedEquipment(recentEquipment);
}
if (logs.length > 0) {
    setEquipmentLogsResults(logs);
}
}, [
jobCodes,
costCodes,
equipment,
recentJobSites,
recentCostCodes,
recentEquipment,
jobsiteResults,
costcodeResults,
equipmentResults,
recentlyUsedJobCodes,
recentlyUsedCostCodes,
recentlyUsedEquipment,
logs,
]);

useEffect(() => {
if (getAuthStep() !== "success") {
    router.push("/"); // Redirect to QR page if steps are not followed
}
}, []);



useEffect(() => {
if (session && session.user) {
    setData({
    id: session.user.id,
    firstName: session.user.firstName,
    lastName: session.user.lastName,
    permission: session.user.permission,
    });
}
}, [session]);

return session ? (
<Bases variant={"default"}>
    <Contents variant={"default"} size={"default"}>
        <Holds variant={"default"} size={"homepage"}>
            <Contents variant={"header"} size={"test"}>
                <Headers variant={"relative"} size={"default"}></Headers>
            </Contents>
            <Banners variant={"default"}>
                <Titles variant={"bannerMessage"} size={"h1"}>{t("Banner")}</Titles>
                <Texts variant={"bannerDate"} size={"p2"}>{date}</Texts>
            </Banners>
            <Contents variant={"name"} size={"test"}>
                <Texts variant={"name"} size={"p1"}>{t("Name", { firstName: user.firstName, lastName: user.lastName })}</Texts>
            </Contents>
            <Grids variant={"widgets"} size={"default"}>
                <DashboardButtons logs={logs} locale={locale}/>
            </Grids>
        </Holds>
    </Contents>
</Bases>
) : (
<></>
);
}

