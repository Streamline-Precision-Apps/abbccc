"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useEffect, useState } from "react";
import Signature from "./(components)/injury-verification/Signature";
import Checkbox from "./(components)/injury-verification/checkBox";
import { useTranslations } from "next-intl";
import { InjuryReportContent } from "./(components)/injury-report/injuryReportContent";
import { Titles } from "@/components/(reusable)/titles";
import { useScanData } from "@/app/context/JobSiteContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useSavedClockInTime } from "@/app/context/ClockInTimeContext";
import { useSavedBreakTime } from "@/app/context/SavedBreakTimeContext";
import { useSavedUserData } from "@/app/context/UserContext";
import { useSavedTimeSheetData } from "@/app/context/TimeSheetIdContext";
import { useRouter } from "next/navigation";
import { updateTimeSheet, GetAllTimeSheets } from "@/actions/timeSheetActions";
import { Banners } from "@/components/(reusable)/banners";
import { setAuthStep } from "@/app/api/auth";
import { Texts } from "@/components/(reusable)/texts";
import { Clock } from "@/components/clock";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";

export default function ClockOut() {

    const [step, incrementStep] = useState(1); 
    const [path, setPath] = useState("ClockOut");
    const router = useRouter();
    const t = useTranslations("clock-out");
    const [checked, setChecked] = useState(false);
    const [signatureBlob, setSignatureBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [banner, setBanner ] = useState("");
    const { scanResult } = useScanData();
    const { savedCostCode } = useSavedCostCode();
    const { savedUserData } = useSavedUserData();
    const { savedTimeSheetData } = useSavedTimeSheetData();
    const jobsite = localStorage.getItem("jobSite");
    const costCode = localStorage.getItem("costCode");
    const ts = localStorage.getItem("savedtimeSheetData");
    const timesheet = JSON.parse(ts || "{}");
    const timesheeetId = (timesheet.id).toString();
    const breakTimeSec = localStorage.getItem("breakTime");
    const breakTimeTotal = breakTimeSec ? (parseFloat(breakTimeSec) / 3600): null;
    const time = new Date().getTime();

    const handleSignatureEnd = (blob: Blob) => {
        if (blob) {
            setSignatureBlob(blob);
        } else {
            setError(t("SignatureFailure"));
        }
    };
    
    useEffect(() => {
        if (step === 4 && path === "Injury" ){
            setPath("ClockOut");
            incrementStep(1);
        }
        if (step === 3 && path === "ClockOut" ){
            setPath("ClockOut");
            incrementStep(1);
        }

    }, [step, path]);

    const handleCheckboxChange = (newChecked: boolean) => {
        setChecked(newChecked);
    };

    const handleNextStep = () => {
        incrementStep(step + 1);
    };

    const handlePath = () => {
        setPath("Injury");
        handleNextStep();
    };

    // this handle updates the time sheet to have all parts required for the user 
    // then displays them to the user. After a successfull submission, the user is redirected to the dashboard and local storage is cleared
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        let duration = 0.00;
        const date = await updateTimeSheet(new FormData(event.currentTarget));
        const retrieve = (date?.date)?.toString();
        if (retrieve ){
        const data = await GetAllTimeSheets(retrieve);
        
        duration = data?.reduce((total, timeSheet) => {
            return total + (timeSheet.duration ?? 0);
        }, 0);
    }
        
        setAuthStep("");
        setBanner(`Timecard Submitted! ${duration?.toFixed(2)} total hours && ${breakTimeTotal?.toFixed(2)} total break time used. You will be redirected soon!`);
        setTimeout(() => {
        router.push("/");
        setBanner("")
        localStorage.removeItem("breakTime"); // Clear local storage
        setAuthStep("removeLocalStorage");
        }, 5000);
        
    } catch (error) {
        console.error("Failed to submit the time sheet:", error);
    }
    };
    
    // this is the base page for clock out, it allows you to confirm no injury or report an injury
    if (step === 1) {
        
        return (
                <Bases variant={"default"}>
                    <Contents size={"default"}>
                    <Sections size={"default"}>
                    <TitleBoxes
                        title={t("InjuryVerification")}
                        titleImg="/new/end-day.svg"
                        titleImgAlt="Team"
                        variant={"row"}
                        size={"default"}
                        type="row"
                    />

                    <Sections size={"titleBox"}>
                    <Titles size={"h3"}>{t("SignBelow")}</Titles>
                    <Signature onEnd={handleSignatureEnd} />
                    {signatureBlob && <p>{t("SignatureCaptured")}</p>}
                    </Sections>
                    
                    <Sections size={"titleBox"}>
                    <Contents variant={"rowCenter"}>
                    <Titles size={"h4"}>{t("SignatureVerify")}</Titles>
                        <Checkbox checked={checked} onChange={handleCheckboxChange} />
                    </Contents>
                        </Sections>
                    {error && <div className="text-red-500">{error}</div>}
                    <div>
                        {checked ? (
                        <Buttons variant={"green"} size={"widgetMed"} onClick={handleNextStep} >
                            <Titles size={"h3"}>{t("Continue")}</Titles>
                            </Buttons>
                        ) : (
                        <Buttons variant={"red"} size={"widgetMed"}  onClick={handlePath} >
                            <Titles size={"h3"}>{t("ReportInjury")}</Titles>
                        </Buttons>
                        )}
                    </div>
                    </Sections>
                    </Contents>
                    </Bases>
        );
        // this is the base page for clock out, it allows you to report an injury and you submit it to the database then redirects user to final clock out screen 
        // have a button to go back to previous page router back is not working
    } else if (step === 2 && path === "Injury") {
        return (
            <Bases variant={"default"}>
                    <Contents size={"default"}>
                    <Sections size={"titleBox"}>
                    <TitleBoxes
                        title={t("InjuryVerification")}
                        titleImg="/new/injury.svg"
                        titleImgAlt="Team"
                        variant={"row"}
                        size={"default"}
                        type="row"
                    />
                    </Sections>
                <Sections size={"dynamic"}>
                <InjuryReportContent handleNextStep={handleNextStep} />
                </Sections>
                </Contents>
                </Bases>
        );
    } else if (step === 2 && path ==="ClockOut" || step === 3 && path ==="Injury") {
        return (
            <Bases>
            <Banners variant={banner.length > 0 ? "green" : "default"} >
            {banner}
            </Banners>
            <Contents>
            <Sections size={"dynamic"}>
            <TitleBoxes title={t("Bye")} titleImg={"/new/end-day.svg"} titleImgAlt={""} variant={"row"} size={"default"} type="row" />

            <Contents variant={"default"}>
            <Texts>{t("ClockOutDate")} {new Date().toLocaleDateString()}</Texts>
            <Texts>
            {t("Jobsite")} {scanResult?.data || jobsite}
            </Texts>
            <Texts>
            {t("CostCode")} {savedCostCode || costCode}
            </Texts>

            <Forms onSubmit={handleSubmit}>
            <Buttons
            variant={"green"}
            size={"widgetLg"}
            >
            <Clock time={time} />
            </Buttons>
            {/* Hidden inputs */}
            <Inputs type="hidden" name="id" value={savedTimeSheetData?.id || timesheeetId} readOnly/>
            <Inputs type="hidden" name="end_time" value={new Date().toString()} readOnly/>
            <Inputs type="hidden" name="timesheet_comments" value={""} readOnly />
            <Inputs type="hidden" name="app_comments" value={""} readOnly />
            {/* uses this to verfy the person clocking out in server action */}
            <Inputs type="hidden" name="user_id" value={savedUserData?.id || ""} readOnly />
            </Forms>

            </Contents>
            </Sections>
            </Contents>
            </Bases>
        );
    } else {
        return null;
    }

}