"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import DashboardButtons from "@/components/dashboard-buttons";
import {
  clearAuthStep,
  getAuthStep,
  isDashboardAuthenticated,
} from "@/app/api/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { Images } from "@/components/(reusable)/images";
import { Modals } from "@/components/(reusable)/modals";
import { Headers } from "@/components/(reusable)/headers";
import { Banners } from "@/components/(reusable)/banners";
import { Texts } from "@/components/(reusable)/texts";
import { Footers } from "@/components/(reusable)/footers";
import { CustomSession, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useSavedUserData } from "@/app/context/UserContext";
import { useDBJobsite, useDBCostcode, useDBEquipment } from "@/app/context/dbCodeContext";


type jobCodes = {
id: number;
jobsite_id: string;
jobsite_name: string;
}
type CostCode = {
id: number;
cost_code: string;
cost_code_description: string;
}

type equipment = {
id: string;
qr_id: string;
name: string;
}

interface clockProcessProps{
jobCodes: jobCodes[];
CostCodes: CostCode[];
equipment: equipment[];
recentJobSites: jobCodes[];
recentCostCodes: CostCode[];
recentEquipment: equipment[];
};

export default function Content( { jobCodes, CostCodes, equipment, recentJobSites, recentCostCodes, recentEquipment }: clockProcessProps) {

const [isOpen, setIsOpen] = useState(false);
const t = useTranslations("dashboard");
const router = useRouter();
const { data: session } = useSession() as { data: CustomSession | null };
const { setSavedUserData } = useSavedUserData();
const date = new Date().toLocaleDateString( 'en-US', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'long' });
const { jobsiteResults, setJobsiteResults } = useDBJobsite();
const { costcodeResults, setCostcodeResults } = useDBCostcode();
const { equipmentResults, setEquipmentResults } = useDBEquipment();

const [user, setData] = useState<User>({
id: "",
name: "",
firstName: "",
lastName: "",
permission: "",
});

useEffect(() => {
    if (jobsiteResults.length === 0 || costcodeResults.length === 0 || equipmentResults.length === 0) {
    setJobsiteResults(jobCodes);
    setCostcodeResults(CostCodes);
    setEquipmentResults(equipment);
    }
}, [jobCodes, CostCodes, equipment, jobsiteResults, costcodeResults, equipmentResults]);


useEffect(() => {
if (!isDashboardAuthenticated()) {
    console.log("Not authenticated");
    console.log(getAuthStep());
    // router.push('/'); // Redirect to login page if not authenticated
}
if (getAuthStep() !== "success") {
    router.push("/"); // Redirect to QR page if steps are not followed
}
}, []);

useEffect(() => {
const handlePopstate = () => {
    if (isDashboardAuthenticated()) {
    window.location.href = "/dashboard";
    }
};
// Attach beforeunload event listener
window.addEventListener("beforeunload", handleBeforeUnload);

// Attach popstate event listener (for handling back navigation)
window.addEventListener("popstate", handlePopstate);
return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
    window.removeEventListener("popstate", handlePopstate);
};
}, []);

useEffect(() => {
if (session && session.user) {
    setSavedUserData({
    id: session.user.id,
    });
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
<Bases variant={"default"} size={"default"}>
    <Sections size={"default"}>
    <Headers variant={"relative"} size={"default"}></Headers>
    <Banners variant={"default"} size={"default"}>
        <Titles variant={"default"} size={"h1"}>{t("Banner")}</Titles>
        <Texts variant={"default"} size={"p1"}>{date}</Texts>
    </Banners>
    <Texts variant={"name"} size={"p1"}>{t("Name", { firstName: user.firstName, lastName: user.lastName })}</Texts>
    <DashboardButtons />
    <Footers >{t("lN1")}</Footers>
    </Sections>
</Bases>
) : (
<></>
);
}

function handleBeforeUnload(this: Window, ev: BeforeUnloadEvent) {
throw new Error("Function not implemented.");
}