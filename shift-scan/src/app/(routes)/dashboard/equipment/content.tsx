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
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import { useRouter } from "next/navigation";

type EquipmentLogs = {
  userId: string | undefined;
};

export default function EquipmentLogContent({ userId }: EquipmentLogs) {
  const Router = useRouter();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [banner, setBanner] = useState("");
  const t = useTranslations("EquipmentContent");
  const total = logs.length;
  const completed = logs.filter((log) => log.isCompleted).length;
  const green = total - completed;

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [Router, useRouter]);
  const handleSubmit = () => {
    setLogs([]);
    setBanner("Submitted all logs!");
    setTimeout(() => {
      setBanner("");
    }, 4000);
  };

  if (loading) {
    return (
      <Holds className="mt-5">
        <Spinner />
      </Holds>
    );
  }

  return (
    <>
      {banner && (
        <Holds
          position={"absolute"}
          background={"green"}
          className="h-10 w-full rounded-none top-[0%]"
        >
          <Texts
            size={"p6"}
            className="h-full flex justify-center items-center"
          >
            {banner}
          </Texts>
        </Holds>
      )}
      <Contents width={"section"}>
        {total === 0 ? (
          <Holds className="mt-5">
            <Texts>{t("NoCurrent")}</Texts>
          </Holds>
        ) : (
          <Holds className="mt-5">
            <Titles>{t("Current")}</Titles>
          </Holds>
        )}
        <Holds className="mt-5">
          {green === 0 && total !== 0 ? (
            <Forms action={Submit} onSubmit={handleSubmit}>
              <Holds>
                <Buttons
                  size={"30"}
                  type="submit"
                  background={"lightBlue"}
                  className="py-2 mx-auto"
                >
                  {t("SubmitAll")}
                </Buttons>
                <Inputs type="hidden" name="id" value={userId} />
                <Inputs type="hidden" name="submitted" value={"true"} />
              </Holds>
            </Forms>
          ) : (
            <Buttons size={"30"} disabled className="bg-gray-400 py-2">
              {t("SubmitAll")}
            </Buttons>
          )}
        </Holds>
        <Holds className="mt-5 h-full overflow-y-auto no-scrollbar">
          {logs.map((log) => (
            <Holds key={log.id} className="pb-5">
              <Buttons
                size={"80"}
                background={log.isCompleted ? "green" : "orange"}
                href={`/dashboard/equipment/${log.id}`}
                key={log.id}
                className="py-2"
              >
                {log.Equipment?.name}
              </Buttons>
            </Holds>
          ))}
        </Holds>
      </Contents>
    </>
  );
}
