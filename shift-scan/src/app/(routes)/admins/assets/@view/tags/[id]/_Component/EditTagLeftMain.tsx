"use client";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { JobTags, costCodesTag } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";

export default function EditTagMainLeft({
  toggleJobSelection,
  toggleCostCodeSelection,
  jobs,
  costCodes,
  selectedJobs,
  selectedCostCodes,
}: {
  toggleJobSelection: (job: JobTags) => void;
  toggleCostCodeSelection: (costCode: costCodesTag) => void;
  jobs: JobTags[];
  costCodes: costCodesTag[];
  selectedJobs: JobTags[];
  selectedCostCodes: costCodesTag[];
}) {
  const t = useTranslations("Admins");
  const [term, setTerm] = useState<string>("");
  const [activeList, setActiveList] = useState<"jobs" | "costCodes">("jobs");

  const filteredCostCodes = useMemo(() => {
    return costCodes.filter(
      (cc) =>
        cc.description.toLowerCase().includes(term.toLowerCase()) ||
        cc.name.toLowerCase().includes(term.toLowerCase())
    );
  }, [term, costCodes]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((tag) =>
      tag.name.toLowerCase().includes(term.toLowerCase())
    );
  }, [term, jobs]);
  return (
    <Holds background="white" className="w-full h-full p-4">
      <Grids rows="10" gap="5" className="h-full">
        <Holds
          position={"row"}
          background={"white"}
          className="row-span-2 h-full gap-4 border-[3px] rounded-[15px] border-black"
        >
          <Holds
            background={activeList === "jobs" ? "lightBlue" : "white"}
            className="w-[50%] h-full justify-center "
            onClick={() => setActiveList("jobs")}
          >
            <Texts size={"p6"}>{t("Jobsite")}</Texts>
          </Holds>
          <Holds
            background={activeList === "costCodes" ? "lightBlue" : "white"}
            className="w-[50%] h-full justify-center "
            onClick={() => setActiveList("costCodes")}
          >
            <Texts size={"p6"}>{t("CostCode")}</Texts>
          </Holds>
        </Holds>

        <Holds className="row-span-8 h-full border-[3px] border-black rounded-t-[10px]">
          <Holds position="row" className="py-2 border-b-[3px] border-black">
            <Holds className="h-full w-[20%]">
              <Images titleImg="/searchLeft.svg" titleImgAlt="search" />
            </Holds>
            <Holds className="w-[80%]">
              <Inputs
                type="search"
                placeholder={t("Search")}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="border-none outline-none"
              />
            </Holds>
          </Holds>

          {activeList === "costCodes" ? (
            <Holds className="h-full mb-4 overflow-y-auto no-scrollbar">
              {filteredCostCodes.map((costCode) => (
                <Holds
                  key={costCode.id}
                  className="py-2 border-b cursor-pointer flex items-center"
                >
                  <Holds position={"row"} className="justify-between">
                    <Holds className="flex w-2/3">
                      <Texts size="p6">{`${costCode.name} ${costCode.description}`}</Texts>
                    </Holds>
                    <Holds position="row" className="relative flex w-1/3">
                      <CheckBox
                        id={costCode.id.toString()}
                        checked={selectedCostCodes.some(
                          (c) => c.id === costCode.id
                        )}
                        onChange={() => toggleCostCodeSelection(costCode)}
                        size={2}
                        name={costCode.name}
                        aria-label={`Toggle tag ${costCode.name}`}
                      />
                    </Holds>
                  </Holds>
                </Holds>
              ))}
            </Holds>
          ) : (
            <Holds className="h-full mb-4 overflow-y-auto no-scrollbar">
              {filteredJobs.map((job) => (
                <Holds
                  key={job.id}
                  className="py-2 border-b cursor-pointer flex items-center"
                >
                  <Holds position={"row"} className="justify-between">
                    <Holds className="flex w-2/3">
                      <Texts size="p6">{job.name}</Texts>
                    </Holds>
                    <Holds position="row" className="relative flex w-1/3">
                      <CheckBox
                        id={job.id.toString()}
                        checked={selectedJobs.some((j) => j.id === job.id)}
                        onChange={() => toggleJobSelection(job)}
                        size={2}
                        name={job.name}
                        aria-label={`Toggle tag ${job.name}`}
                      />
                    </Holds>
                  </Holds>
                </Holds>
              ))}
            </Holds>
          )}
        </Holds>
      </Grids>
    </Holds>
  );
}
