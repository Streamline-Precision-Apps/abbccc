"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Submit } from "@/actions/equipmentActions";
import { useTranslations } from "next-intl";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Inputs } from "@/components/(reusable)/inputs";
import { Forms } from "@/components/(reusable)/forms";
import { useEffect, useState } from "react";
import Spinner from "@/components/(animations)/spinner";

type EquipmentLogs = {
    userId: string | undefined;
}

export default function EquipmentLogContent({ userId }: EquipmentLogs) {
    const [loading, setLoading] = useState(true); 
    const [logs, setLogs] = useState<any[]>([]);
    const t = useTranslations("EquipmentContent");
    const total = logs.length;
    const completed = logs.filter((log) => log.isCompleted).length;
    const green = total - completed;

    useEffect(() => {
        if (!userId) return; // Only fetch data if userId is available
        
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/getCheckedList");
                if (response.ok) {
                    const data = await response.json();
                    setLogs(data);
                } else {
                    console.error("Failed to fetch logs");
                }
            } catch (error) {
                console.error("Error fetching logs:", error);
            }
            finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [userId]); // Dependency on userId

    return (
        <Holds>
            {loading ? (
                // animated spinner
                <Spinner />
            ) : (
                <>
                    {green === 0 && total !== 0 ? (
                        <Forms action={Submit}>
                            <Buttons type="submit" background={"lightBlue"} size={null}>
                                {t("SubmitAll")}
                            </Buttons>
                            <Inputs type="hidden" name="id" value={userId} />
                            <Inputs type="hidden" name="submitted" value={"true"} />
                        </Forms>
                    ) : null}
                    {total === 0 ? <Texts>{t("NoCurrent")}</Texts> : null}
                    {logs.map((log) => (
                        <Buttons
                            background={log.isCompleted ? "green" : "orange"}
                            size={null}
                            href={`/dashboard/equipment/${log.id}`}
                            key={log.id}
                        >
                            {log.Equipment?.name}
                        </Buttons>
                    ))}
                </>
            )}
            </Holds>
    );
}