"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import DashboardButtons from "@/components/dashboard-buttons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { Titles } from "@/components/(reusable)/titles";
import { Headers } from "@/components/(reusable)/headers";
import { Banners } from "@/components/(reusable)/banners";
import { Texts } from "@/components/(reusable)/texts";
import { Footers } from "@/components/(reusable)/footers";
import { CustomSession, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useSavedUserData } from "@/app/context/UserContext";
import { useDBJobsite, useDBCostcode, useDBEquipment} from "@/app/context/dbCodeContext";
import { useRecentDBJobsite, useRecentDBCostcode, useRecentDBEquipment} from "@/app/context/dbRecentCodesContext";
import { getAuthStep, isDashboardAuthenticated } from "@/app/api/auth";
import { ClockProcessProps, Logs } from "@/lib/clockprocess";
import { Contents } from "@/components/(reusable)/contents";

export default function Content({
locale,
jobCodes,
costCodes,
equipment,
recentJobSites,
recentCostCodes,
recentEquipment,
logs,
}: ClockProcessProps) {
const t = useTranslations("dashboard");
const router = useRouter();
const { data: session } = useSession() as { data: CustomSession | null };
const { setSavedUserData } = useSavedUserData();
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
name: "",
firstName: "",
lastName: "",
permission: "",
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
if (!isDashboardAuthenticated()) {
    console.log("Not authenticated");
    console.log(getAuthStep());
    router.push("/"); // Redirect to login page if not authenticated
}
if (getAuthStep() !== "success") {
    router.push("/"); // Redirect to QR page if steps are not followed
}
}, []);



useEffect(() => {
if (session && session.user) {
    setSavedUserData({ id: session.user.id });
    setData({
    id: session.user.id,
    name: session.user.name,
    firstName: session.user.firstName,
    lastName: session.user.lastName,
    permission: session.user.permission,
    });
}
}, [session]);

return session ? (
<Bases variant={"default"}>
    <Contents variant={"default"} size={"default"}>
        <Sections variant={"default"} size={"dynamic"}>
            <Contents variant={"header"} size={"test"}>
                <Headers variant={"relative"} size={"default"}></Headers>
            </Contents>
            <Banners variant={"default"}>
                <Titles variant={"default"} size={"h1"}>{t("Banner")}</Titles>
                <Texts variant={"default"} size={"p1"}>{date}</Texts>
            </Banners>
            <Texts variant={"name"} size={"p1"}>{t("Name", { firstName: user.firstName, lastName: user.lastName })}</Texts>
            <DashboardButtons logs={logs} locale={locale}/>
            {/* <Footers >{t("lN1")}</Footers> */}
        </Sections>
    </Contents>
</Bases>
) : (
<></>
);
}

