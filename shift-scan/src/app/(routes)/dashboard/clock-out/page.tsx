"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
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
import { updateTimeSheet } from "@/actions/timeSheetActions";
import { now } from "next-auth/client/_utils";
import { Banners } from "@/components/(reusable)/banners";
import { setAuthStep } from "@/app/api/auth";
import { Texts } from "@/components/(reusable)/texts";
import { Clock } from "@/components/clock";

export default function ClockOut() {

    const [step, incrementStep] = useState(2); //Todo: change to 1 after testing
    const [path, setPath] = useState("ClockOut");
    const router = useRouter();
    const t = useTranslations("clock-out");
    const [checked, setChecked] = useState(false);
    const [signatureBlob, setSignatureBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [banner, setBanner ] = useState("");
    const { scanResult } = useScanData();
    const { savedCostCode } = useSavedCostCode();
    // const { breakTime } = useSavedBreakTime();
    const { savedUserData } = useSavedUserData();
    const { savedTimeSheetData } = useSavedTimeSheetData();
    const jobsite = localStorage.getItem("jobSite");
    const costCode = localStorage.getItem("costCode");
    const ts = localStorage.getItem("savedtimeSheetData");
    const timesheet = JSON.parse(ts || "{}");
    const timesheeetId = (timesheet.id).toString();
    const breakTimeSec = localStorage.getItem("breakTime");
    const breakTimeTotal = breakTimeSec ? (parseFloat(breakTimeSec) / 3600).toFixed(2) : null;
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

    const handlePreviousStep = () => {
        incrementStep(step - 1);
        if (path === "Injury") {
            setPath("ClockOut");
        }
    };

    // this handle updates the time sheet to have all parts required for the user 
    // then displays them to the user. After a successfull submission, the user is redirected to the dashboard and local storage is cleared
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        const data = await updateTimeSheet(new FormData(event.currentTarget), savedTimeSheetData?.id);
        const duration = data?.duration
        setAuthStep("");
        setBanner(`Timecard Submitted! You will be redirected! \n \n ${duration?.toFixed(2)} total hours worked!`);
        setTimeout(() => {
        router.push("/");
        setBanner("")
        localStorage.removeItem("breakTime"); // Clear local storage
        setAuthStep("removeLocalStorage");
        }, 3000);
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
                        titleImg="/endDay.svg"
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
        //Todo: have a button to go back to previous page router back is not working
    } else if (step === 2 && path === "Injury") {
        return (
            <Bases variant={"default"}>
                    <Contents size={"default"}>
                    <Sections size={"titleBox"}>
                    <TitleBoxes
                        title={t("InjuryVerification")}
                        titleImg="/injury.svg"
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
            <Banners variant={banner.length > 0 ? "green" : "clear"} >
            {banner}
            </Banners>
            <Contents>
            <Sections size={"dynamic"}>
            <TitleBoxes title={t("Bye")} titleImg={"/endDay.svg"} titleImgAlt={""} variant={"row"} size={"default"} type="row" />

            <Contents variant={"default"}>
            <Texts>{t("ClockOutDate")} {new Date().toLocaleDateString()}</Texts>
            <Texts>
            {t("Jobsite")} {scanResult?.data || jobsite}
            </Texts>
            <Texts>
            {t("CostCode")} {savedCostCode || costCode}
            </Texts>

            <form onSubmit={handleSubmit}>
            <Buttons
            variant={"green"}
            size={"widgetLg"}
            >
            <Clock time={time} />
            </Buttons>
            {/* Hidden inputs */}
            <input type="hidden" name="id" value={savedTimeSheetData?.id || timesheeetId} />
            <input type="hidden" name="end_time" value={new Date().toString()} />
            <input
            type="hidden"
            name="total_break_time"
            value={breakTimeTotal?.toString()}
            />
            <input type="hidden" name="timesheet_comments" value={""} />
            <input type="hidden" name="app_comments" value={""} />
            </form>

            </Contents>
            </Sections>
            </Contents>
            </Bases>
        );
    } else {
        return null;
    }

}