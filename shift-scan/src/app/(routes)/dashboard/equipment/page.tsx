"use client";

import { Buttons } from "@/components/(reusable)/buttons";
import { UpdateSubmit } from "@/actions/equipmentActions";
import { useTranslations } from "next-intl";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Inputs } from "@/components/(reusable)/inputs";
import { Forms } from "@/components/(reusable)/forms";
import { useEffect, useState } from "react";
import Spinner from "@/components/(animations)/spinner";
import { Contents } from "@/components/(reusable)/contents";
import { useRouter } from "next/navigation";
import { Grids } from "@/components/(reusable)/grids";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
// import { z } from "zod";

// Zod schema for EquipmentLogs props
// const EquipmentLogsSchema = z.object({
//   userId: z.string().optional(),
// });

// Zod schema for individual log entry
// const LogEntrySchema = z.object({
//   id: z.string(),
//   isCompleted: z.boolean(),
//   Equipment: z
//     .object({
//       name: z.string(),
//     })
//     .nullable()
//     .optional(),
// });

// Zod schema for the array of logs
// const LogsArraySchema = z.array(LogEntrySchema);
import { EmployeeEquipmentLogs, FormStatus } from "@/lib/types";
import { Bases } from "@/components/(reusable)/bases";
import { useSession } from "next-auth/react";

export default function EquipmentLogContent() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const Router = useRouter();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<EmployeeEquipmentLogs[]>([]);
  const [banner, setBanner] = useState("");
  const t = useTranslations("Equipment");
  const b = useTranslations("Widgets");
  const total = logs.length;
  const completed = logs.filter(
    (log) => log.endTime !== null
  ).length;
  const green = total - completed;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getCheckedList");
        if (response.ok) {
          const data = await response.json();

          // Validate fetched data with Zod
          // try {
          // LogsArraySchema.parse(data);
          // } catch (error) {
          //   if (error instanceof z.ZodError) {
          //     console.error("Validation error in fetched logs:", error.errors);
          //   }
          // }

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
  }, [Router]);
  const handleSubmit = () => {
    setLogs([]);
    setBanner("Submitted all logs!");
    setTimeout(() => {
      setBanner("");
    }, 4000);
  };

  if (loading) {
    return (
      <Bases>
        <Contents>
          <Grids rows={"10"} gap={"5"}>
            <Holds
              background={"white"}
              size={"full"}
              className="row-span-2 h-full"
            >
              <Contents width={"section"}>
                <TitleBoxes
                  version={"horizontal"}
                  title={t("Current")}
                  titleImg="/equipment.svg"
                  titleImgAlt="Current"
                  variant={"default"}
                  size={"default"}
                  className="my-auto"
                  href="/dashboard"
                />
              </Contents>
            </Holds>

            <Holds background={"white"} className="row-span-8 h-full">
              <Contents width={"section"}>
                <Holds className="mt-5 row-span-1 h-full">
                  <Texts size={"p6"} className="h-full my-auto">
                    {t("Loading")}
                  </Texts>
                  <Spinner />
                </Holds>
                <Holds className="row-span-8 h-full"></Holds>
              </Contents>
            </Holds>
          </Grids>
        </Contents>
      </Bases>
    );
  }

  return (
    <Bases>
      <Contents>
        <Grids rows={"10"} gap={"5"} className="relative">
          <Holds background={"white"} className="row-span-2">
            <Contents width={"section"}>
              <TitleBoxes
                version={"horizontal"}
                title={t("Current")}
                titleImg="/equipment.svg"
                titleImgAlt="Current"
                variant={"default"}
                size={"default"}
                className="my-auto"
                href="/dashboard"
              />
            </Contents>
            {banner && (
              <Holds background={"green"} className="h-8 w-full rounded-xl">
                <Texts
                  size={"p6"}
                  className="h-full my-auto flex justify-center items-center"
                >
                  {banner}
                </Texts>
              </Holds>
            )}
          </Holds>

          <Holds background={"white"} className="row-span-8 h-full">
            <Contents width={"section"}>
              {total === 0 ? (
                <Holds className="mt-5">
                  <Texts>{t("NoCurrent")}</Texts>
                </Holds>
              ) : null}
              <Holds className="mt-5 h-full overflow-y-auto no-scrollbar">
                {logs.map((log) => (
                  <Holds key={log.id} className="pb-5">
                    <Buttons
                      size={"80"}
                      background={
                        log.endTime !== null ? "green" : "orange"
                      }
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
          </Holds>
          <Holds className="mt-5">
            {green === 0 && total !== 0 ? (
              <Forms action={UpdateSubmit} onSubmit={handleSubmit}>
                <Holds>
                  <Buttons
                    size={"30"}
                    type="submit"
                    background={"lightBlue"}
                    className="py-2 mx-auto"
                    href={`/dashboard/equipment`}
                  >
                    {b("SubmitAll")}
                  </Buttons>
                  <Inputs type="hidden" name="id" value={userId} />
                  <Inputs type="hidden" name="submitted" value={"true"} />
                </Holds>
              </Forms>
            ) : (
              <Buttons size={"30"} disabled className="bg-gray-400 py-2">
                {b("SubmitAll")}
              </Buttons>
            )}
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
