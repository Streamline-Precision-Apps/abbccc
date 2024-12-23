"use client";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { Titles } from "@/components/(reusable)/titles";
import Spinner from "@/components/(animations)/spinner";
import { EquipmentLog } from "@/lib/types";
import { z } from "zod";
import { editTimeSheet } from "@/actions/timeSheetActions";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";

const EditWork = ({ loading }: EditWorkProps) => {
  // Validate props using Zod

  return loading ? (
    <>
      <Holds background={"white"} className="gap-4">
        <Contents width={"section"}>
          <Holds className="my-5">
            <Titles>{t("Timesheets")}</Titles>
            <br />
            <br />
            <Spinner />
          </Holds>
        </Contents>
      </Holds>
      <br />
      <Holds background={"white"} className="gap-4">
        <Contents width={"section"}>
          <Holds className="my-5">
            <Titles>{t("EquipmentLogs")}</Titles>
            <br />

            <br />
            <Spinner />
          </Holds>
        </Contents>
      </Holds>
    </>
  ) : (
    <>
      {timesheetData.length === 0 ? null : (
        <Holds background={"white"} position={"row"} className="py-3 my-5">
          <>
            <Holds>
              <Buttons
                onClick={editHandler}
                className={edit ? "bg-app-red" : "bg-app-orange"}
                size={edit ? "30" : "20"}
              >
                <Images
                  titleImg={edit ? "/undo-edit.svg" : "/edit-form.svg"}
                  titleImgAlt={edit ? "Undo Edit" : "Edit Form"}
                  className="mx-auto p-2"
                />
              </Buttons>
            </Holds>
            {edit ? (
              <Holds>
                <Buttons
                  className="bg-app-green"
                  onClick={handleSaveChanges}
                  size={"30"}
                >
                  <Images
                    titleImg={"/save-edit.svg"}
                    titleImgAlt={"Save Changes"}
                    className="mx-auto p-2"
                  />
                </Buttons>
              </Holds>
            ) : null}
          </>
        </Holds>
      )}
      <Holds background={"white"}>
        <Contents width={"section"} className="my-5">
          {message ? (
            <Holds className="py-3">
              <Titles>{t("Timesheets")}</Titles>
              <br />
              <Texts size={"p3"}>{message}</Texts>
              <br />

              <br />
            </Holds>
          ) : (
            <ul>
              <Titles>{t("Timesheets")}</Titles>
              {timesheets.map((timesheet) => (
                <li key={timesheet.id}>
                  {/* Collapsible Header */}
                  <Holds
                    background={"lightBlue"}
                    className="cursor-pointer mt-5 mb-1"
                    onClick={() => toggleItem(timesheet.id ?? "")}
                  >
                    <Titles>
                      {new Date(
                        timesheet.submitDate ?? ""
                      ).toLocaleDateString()}
                    </Titles>
                  </Holds>

                  {/* Conditional Rendering of Content */}
                  {expandedItems[timesheet.id ?? ""] && (
                    <Holds background={"offWhite"} className="py-2">
                      <Contents width={"section"}>
                        <Inputs
                          variant={"default"}
                          id="submitDate"
                          type="date"
                          value={
                            timesheet.submitDate
                              ? new Date(timesheet.submitDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          hidden
                        />

                        <Labels>
                          {t("Duration")}
                          {edit ? <span>{t("Duration-Comment")}</span> : null}
                        </Labels>
                        <Inputs
                          id="duration"
                          type="text"
                          value={
                            timesheet.endTime !== null &&
                            timesheet.startTime !== null
                              ? (new Date(timesheet.endTime!).getTime() -
                                  new Date(timesheet.startTime!).getTime()) /
                                1000 /
                                60 /
                                60
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange(e, timesheet.id ?? "", "duration")
                          }
                          disabled={!edit}
                        />

                        <Labels>
                          {t("ClockIn")}
                          <>
                            <Inputs
                              variant={"default"}
                              id="startDate"
                              type="date"
                              value={timesheet.startDate?.toString() || ""}
                              onChange={(e) =>
                                handleInputChangeDate(
                                  e,
                                  timesheet.id ?? "",
                                  "startDate"
                                )
                              }
                              disabled={!edit}
                            />
                            <Inputs
                              variant={"default"}
                              id="startTime"
                              type="time"
                              value={timesheet.startTime?.toString() || ""}
                              onChange={(e) =>
                                handleInputChangeDate(
                                  e,
                                  timesheet.id ?? "",
                                  "startTime"
                                )
                              }
                              disabled={!edit}
                            />
                          </>
                        </Labels>

                        <Labels>
                          {t("ClockOut")}
                          <>
                            <Inputs
                              variant={"default"}
                              id="endDate"
                              type="date"
                              value={timesheet.endDate?.toString() || ""}
                              onChange={(e) =>
                                handleInputChangeDate(
                                  e,
                                  timesheet.id ?? "",
                                  "endDate"
                                )
                              }
                              disabled={!edit}
                            />
                            <Inputs
                              variant={"default"}
                              id="endTime"
                              type="time"
                              value={timesheet.endTime?.toString() || ""}
                              onChange={(e) =>
                                handleInputChangeDate(
                                  e,
                                  timesheet.id ?? "",
                                  "endTime"
                                )
                              }
                              disabled={!edit}
                            />
                          </>
                        </Labels>

                        <Labels>{t("JobSites")}</Labels>
                        <Selects
                          variant={"default"}
                          id="jobsiteId"
                          value={timesheet.jobsiteId ?? ""}
                          onChange={(e) =>
                            handleCodeChange(e, timesheet.id ?? "", "jobsiteId")
                          }
                          disabled={!edit}
                        >
                          {jobsiteData.map((jobsite) => (
                            <option key={jobsite.id} value={jobsite.id}>
                              {jobsite.name}
                            </option>
                          ))}
                        </Selects>

                        <Labels>{t("CostCode")}</Labels>
                        <Selects
                          variant={"default"}
                          id="costcode"
                          value={timesheet.costcode ?? ""}
                          onChange={(e) =>
                            handleCodeChange(e, timesheet.id ?? "", "costcode")
                          }
                          disabled={!edit}
                        >
                          {costcodesData.map((costcode) => (
                            <option key={costcode.id} value={costcode.name}>
                              {costcode.name}
                            </option>
                          ))}
                        </Selects>
                      </Contents>
                    </Holds>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Contents>
      </Holds>
      <Holds background={"white"} className="py-2 mt-5">
        <Titles>{t("EquipmentLogs")}</Titles>
        <br />
        <ul>
          {equipmentLogs.map((log) => (
            <li key={log.id} className="my-5">
              {/* Collapsible Header */}
              <Contents width={"section"}>
                <Holds
                  background={"orange"}
                  className="cursor-pointer  mt-5 mb-1"
                  onClick={() => toggleEquipmentLog(log.id)}
                  style={{ cursor: "pointer" }}
                >
                  <Titles>
                    {log.Equipment.name.slice(0, 10)} {log.Equipment.qrId}
                  </Titles>
                </Holds>
              </Contents>

              {/* Conditional Rendering of Content */}
              {expandedEquipmentLogs[log.id] && (
                <Contents width={"section"}>
                  <Holds background={"offWhite"} className="py-2">
                    <Contents width={"section"}>
                      <Labels> Equipment Used</Labels>
                      <Selects
                        variant={"default"}
                        value={log.Equipment.name}
                        onChange={(e) => handleEquipmentChange(e, log.id)}
                        disabled={!edit}
                      >
                        {equipment.map((equipmentLog) => (
                          <option
                            key={equipmentLog.id}
                            value={equipmentLog.name}
                          >
                            {equipmentLog.name.slice(0, 10)} {equipmentLog.qrId}
                          </option>
                        ))}
                      </Selects>

                      <Labels>{t("Duration")}</Labels>
                      <Inputs
                        variant={"default"}
                        type="text"
                        name="eq-duration"
                        value={
                          log.endTime !== null && log.startTime !== null
                            ? Number(
                                new Date(log.endTime).getTime() -
                                  new Date(log.startTime).getTime()
                              )
                                .toFixed(2)
                                .toString()
                            : ""
                        }
                        disabled={!edit}
                      />
                    </Contents>
                  </Holds>
                </Contents>
              )}
            </li>
          ))}

          {equipmentLogs.length === 0 && (
            <Texts size={"p3"}>{t("NoEquipmentLogs")}</Texts>
          )}
        </ul>
        <br />
        <br />
      </Holds>
    </>
  );
};

export default EditWork;
