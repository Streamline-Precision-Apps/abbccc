"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Images } from "@/components/(reusable)/images";
import { Grids } from "@/components/(reusable)/grids";
import { TimeSheet, TimesheetHighlights } from "@/lib/types";
import { useState } from "react";
import { Texts } from "@/components/(reusable)/texts";
import { Buttons } from "@/components/(reusable)/buttons";
import { format } from "date-fns";
import { Titles } from "@/components/(reusable)/titles";
import { NModals } from "@/components/(reusable)/newmodals";
import { useTranslations } from "next-intl";

export default function TimeCardHighlights({
  edit,
  setEdit,
  manager,
  highlightTimesheet,
}: {
  highlightTimesheet: TimesheetHighlights[];
  edit: boolean;
  setEdit: (edit: boolean) => void;
  manager: string;
}) {
  const [editedHighlightTimesheet, setEditedHighlightTimesheet] =
    useState<TimesheetHighlights[]>(highlightTimesheet);
  const [jobsiteModalOpen, setJobsiteModalOpen] = useState(false);
  const [costCodeModalOpen, setCostCodeModalOpen] = useState(false);

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        {/* Timesheet Editing Section */}
        <Holds className="row-start-1 row-end-7 overflow-y-scroll no-scrollbar h-full w-full ">
          <Grids cols={"6"} className="w-full h-fit">
            <Holds className="col-start-2 col-end-4 w-full h-full pl-1">
              <Titles position={"left"} size={"h6"}>
                Start & End
              </Titles>
            </Holds>
            <Holds className="col-start-4 col-end-7 w-full h-full pr-1 ">
              <Titles position={"right"} size={"h6"}>
                Jobsite & Cost Code
              </Titles>
            </Holds>
          </Grids>
          {editedHighlightTimesheet.map((sheet) => (
            <Holds
              key={sheet.id}
              className="border-black border-[3px] rounded-lg bg-white "
            >
              <Buttons
                key={sheet.id}
                shadow={"none"}
                background={"none"}
                className="w-full h-full text-left"
              >
                {sheet.startTime && sheet.endTime ? (
                  <>
                    <Grids cols={"6"} className="w-full h-full ">
                      <Holds className="col-start-1 col-end-2 p-2">
                        <Images
                          titleImg={
                            sheet.workType === "TASCO"
                              ? "/tasco.svg"
                              : sheet.workType === "TRUCK_DRIVER"
                              ? "/trucking.svg"
                              : sheet.workType === "MECHANIC"
                              ? "/mechanic-icon.svg"
                              : sheet.workType === "LABOR"
                              ? "/equipment.svg"
                              : "null"
                          }
                          titleImgAlt={`${sheet.workType} Icon`}
                          className="m-auto w-8 h-8"
                        />
                      </Holds>
                      <Holds className="col-start-2 col-end-4 border-x-[3px] border-black h-full">
                        <Holds className=" h-full justify-center border-b-[1.5px] border-black">
                          <Inputs
                            type={"time"}
                            value={format(sheet.startTime, "HH:mm")}
                            className="text-xs border-none h-full rounded-none justify-center"
                            disabled={!edit}
                          />
                        </Holds>

                        <Holds className=" h-full w-full justify-center border-t-[1.5px] border-black">
                          <Inputs
                            type={"time"}
                            value={format(sheet?.endTime, "HH:mm")}
                            className="text-xs border-none h-full rounded-none justify-center"
                            disabled={!edit}
                          />
                        </Holds>
                      </Holds>

                      <Holds className="col-start-4 col-end-7 h-full">
                        <Holds className="border-b-[1.5px] border-black h-full justify-center ">
                          <Inputs
                            type={"text"}
                            value={sheet.Jobsite.name}
                            className="text-xs border-none h-full rounded-none justify-center text-right"
                            onClick={() => setJobsiteModalOpen(true)}
                            disabled={!edit}
                          />
                        </Holds>
                        <Holds className="h-full justify-center text-right border-t-[1.5px] border-black">
                          <Inputs
                            type={"text"}
                            value={sheet.costcode}
                            className="text-xs border-none h-full rounded-none justify-center text-right"
                            onClick={() => setCostCodeModalOpen(true)}
                            disabled={!edit}
                          />
                        </Holds>
                      </Holds>
                    </Grids>
                  </>
                ) : (
                  <Texts size="p6" className="text-gray-500 italic">
                    No Timesheets data available
                  </Texts>
                )}
              </Buttons>
            </Holds>
          ))}
        </Holds>
      </Grids>
      {/* Modal References */}
      <CostCodeModal
        costCodeModalOpen={costCodeModalOpen}
        setCostCodeModalOpen={setCostCodeModalOpen}
      />
      <JobsiteModal
        jobsiteModalOpen={jobsiteModalOpen}
        setJobsiteModalOpen={setJobsiteModalOpen}
      />
    </Holds>
  );
}

const CostCodeModal = ({
  costCodeModalOpen,
  setCostCodeModalOpen,
}: {
  costCodeModalOpen: boolean;
  setCostCodeModalOpen: (costCodeModalOpen: boolean) => void;
}) => {
  const t = useTranslations("Clock");
  return (
    <NModals
      background={"white"}
      size={"xlW"}
      isOpen={costCodeModalOpen}
      handleClose={() => setCostCodeModalOpen(false)}
    >
      <Holds background={"white"} className="w-full h-full p-2"></Holds>
    </NModals>
  );
};

const JobsiteModal = ({
  jobsiteModalOpen,
  setJobsiteModalOpen,
}: {
  jobsiteModalOpen: boolean;
  setJobsiteModalOpen: (jobsiteModalOpen: boolean) => void;
}) => {
  return (
    <NModals
      background={"white"}
      size={"xlW"}
      isOpen={jobsiteModalOpen}
      handleClose={() => setJobsiteModalOpen(false)}
    >
      <Holds background={"white"} className="w-full h-full p-2"></Holds>
    </NModals>
  );
};
