import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTimecardIdData, Timesheet } from "./useTimecardIdData";
import { useState } from "react";
import { format } from "date-fns-tz";
import { Textarea } from "@/components/ui/textarea";

interface AppManagerEditTimesheetModalProps {
  timesheetId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AppManagerEditTimesheetModal(
  props: AppManagerEditTimesheetModalProps
) {
  const { timesheetId, isOpen, onClose } = props;
  const { data, loading, error, updateField } = useTimecardIdData(timesheetId);
  const [editGeneral, setEditGeneral] = useState(false);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-[90vw] h-[95vh] overflow-y-auto no-scrollbar">
        <div className="py-5 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-auto w-8 p-0 hover:bg-slate-500 hover:bg-opacity-20"
          >
            <img
              src="/arrowBack.svg"
              alt="Logo"
              className="w-full h-auto object-contain "
            />
          </Button>
          <h2 className="text-lg font-semibold text-center mb-4">Timesheet</h2>
          <p className="text-xs text-center text-muted-foreground">
            ID: {timesheetId}
          </p>
        </div>
        {loading && <div className="text-center text-xs">Loading...</div>}
        {error && (
          <div className="text-center text-xs text-red-500">{error}</div>
        )}
        {data && (
          <div className="space-y-6 px-4 pb-8">
            {/* General Info */}
            {data.timesheet && (
              <Section
                title="General Info"
                editMode={editGeneral}
                onEditClick={() => setEditGeneral((v) => !v)}
              >
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-medium">Start Time</label>
                  <Input
                    type="time"
                    value={format(data.timesheet.startTime ?? "", "HH:mm")}
                    onChange={(e) =>
                      updateField("timesheet.startTime", e.target.value)
                    }
                    disabled={!editGeneral}
                  />
                  <label className="text-xs font-medium">End Time</label>
                  <Input
                    type="time"
                    value={format(data.timesheet.endTime ?? "", "HH:mm")}
                    onChange={(e) =>
                      updateField("timesheet.endTime", e.target.value)
                    }
                    disabled={!editGeneral}
                  />

                  <label className="text-xs font-medium">Cost Code</label>
                  <Input
                    type="text"
                    value={data.timesheet.CostCode?.name ?? ""}
                    onChange={(e) =>
                      updateField("timesheet.CostCode.name", e.target.value)
                    }
                    disabled={!editGeneral}
                  />
                  <label className="text-xs font-medium">Jobsite</label>
                  <Input
                    type="text"
                    value={data.timesheet.Jobsite?.name ?? ""}
                    onChange={(e) =>
                      updateField("timesheet.Jobsite.name", e.target.value)
                    }
                    disabled={!editGeneral}
                  />
                  <label className="text-xs font-medium">Comment</label>
                  <div className="relative">
                    <Textarea
                      value={data.timesheet.comment ?? ""}
                      maxLength={40}
                      onChange={(e) => {
                        const val = e.target.value.slice(0, 40);
                        updateField("timesheet.comment", val);
                      }}
                      disabled={!editGeneral}
                    />
                    <div className="absolute bottom-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-xs text-muted-foreground">
                        {data.timesheet.comment?.length ?? 0} / 40
                      </span>
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* Trucking Info */}
            {data.truckingLogs && data.truckingLogs.length > 0 && (
              <Section title="Trucking Info">
                {data.truckingLogs.map((log, i) => (
                  <div key={log.id} className="mb-2 p-2 border rounded">
                    <EditableField
                      label="Truck Number"
                      value={log.truckNumber}
                      onChange={(v) =>
                        updateField(`truckingLogs[${i}].truckNumber`, v)
                      }
                    />
                    <EditableField
                      label="Trailer Number"
                      value={log.trailerNumber}
                      onChange={(v) =>
                        updateField(`truckingLogs[${i}].trailerNumber`, v)
                      }
                    />
                    <EditableField
                      label="Starting Mileage"
                      value={log.startingMileage}
                      onChange={(v) =>
                        updateField(`truckingLogs[${i}].startingMileage`, v)
                      }
                      type="number"
                    />
                    <EditableField
                      label="Ending Mileage"
                      value={log.endingMileage}
                      onChange={(v) =>
                        updateField(`truckingLogs[${i}].endingMileage`, v)
                      }
                      type="number"
                    />
                  </div>
                ))}
              </Section>
            )}

            {/* Equipment Hauled Logs */}
            {data.truckingLogs &&
              data.truckingLogs.some(
                (log) => log.EquipmentHauled && log.EquipmentHauled.length > 0
              ) && (
                <Section title="Equipment Hauled Logs">
                  {data.truckingLogs.map((log, i) =>
                    log.EquipmentHauled && log.EquipmentHauled.length > 0 ? (
                      <div key={log.id} className="mb-2 p-2 border rounded">
                        {log.EquipmentHauled.map((eq, j) => (
                          <EditableField
                            key={eq.id}
                            label="Equipment Name"
                            value={eq.Equipment?.name}
                            onChange={(v) =>
                              updateField(
                                `truckingLogs[${i}].EquipmentHauled[${j}].Equipment.name`,
                                v
                              )
                            }
                          />
                        ))}
                      </div>
                    ) : null
                  )}
                </Section>
              )}

            {/* Materials Hauled */}
            {data.truckingLogs &&
              data.truckingLogs.some(
                (log) => log.Materials && log.Materials.length > 0
              ) && (
                <Section title="Materials Hauled">
                  {data.truckingLogs.map((log, i) =>
                    log.Materials && log.Materials.length > 0 ? (
                      <div key={log.id} className="mb-2 p-2 border rounded">
                        {log.Materials.map((mat, j) => (
                          <EditableField
                            key={mat.id}
                            label="Material Name"
                            value={mat.name}
                            onChange={(v) =>
                              updateField(
                                `truckingLogs[${i}].Materials[${j}].name`,
                                v
                              )
                            }
                          />
                        ))}
                      </div>
                    ) : null
                  )}
                </Section>
              )}

            {/* Stateline Mileage Logs */}
            {data.truckingLogs &&
              data.truckingLogs.some(
                (log) => log.StateMileages && log.StateMileages.length > 0
              ) && (
                <Section title="Stateline Mileage Logs">
                  {data.truckingLogs.map((log, i) =>
                    log.StateMileages && log.StateMileages.length > 0 ? (
                      <div key={log.id} className="mb-2 p-2 border rounded">
                        {log.StateMileages.map((sm, j) => (
                          <EditableField
                            key={sm.id}
                            label="State"
                            value={sm.state}
                            onChange={(v) =>
                              updateField(
                                `truckingLogs[${i}].StateMileages[${j}].state`,
                                v
                              )
                            }
                          />
                        ))}
                      </div>
                    ) : null
                  )}
                </Section>
              )}

            {/* Fueling Logs */}
            {data.truckingLogs &&
              data.truckingLogs.some(
                (log) => log.RefuelLogs && log.RefuelLogs.length > 0
              ) && (
                <Section title="Fueling Logs">
                  {data.truckingLogs.map((log, i) =>
                    log.RefuelLogs && log.RefuelLogs.length > 0 ? (
                      <div key={log.id} className="mb-2 p-2 border rounded">
                        {log.RefuelLogs.map((rf, j) => (
                          <EditableField
                            key={rf.id}
                            label="Gallons Refueled"
                            value={rf.gallonsRefueled}
                            onChange={(v) =>
                              updateField(
                                `truckingLogs[${i}].RefuelLogs[${j}].gallonsRefueled`,
                                v
                              )
                            }
                            type="number"
                          />
                        ))}
                      </div>
                    ) : null
                  )}
                </Section>
              )}

            {/* Tasco Info */}
            {data.tascoLogs && data.tascoLogs.length > 0 && (
              <Section title="Tasco Info">
                {data.tascoLogs.map((log, i) => (
                  <div key={log.id} className="mb-2 p-2 border rounded">
                    <EditableField
                      label="Shift Type"
                      value={log.shiftType}
                      onChange={(v) =>
                        updateField(`tascoLogs[${i}].shiftType`, v)
                      }
                    />
                  </div>
                ))}
              </Section>
            )}

            {/* Maintenance Projects */}
            {data.MaintenanceLogs && data.MaintenanceLogs.length > 0 && (
              <Section title="Maintenance Projects">
                {data.MaintenanceLogs.map((log, i) => (
                  <div key={log.id} className="mb-2 p-2 border rounded">
                    <EditableField
                      label="Comment"
                      value={log.comment}
                      onChange={(v) =>
                        updateField(`MaintenanceLogs[${i}].comment`, v)
                      }
                    />
                  </div>
                ))}
              </Section>
            )}

            {/* Employee Equipment Logs */}
            {data.employeeEquipmentLogs &&
              data.employeeEquipmentLogs.length > 0 && (
                <Section title="Employee Equipment Logs">
                  {data.employeeEquipmentLogs.map((log, i) => (
                    <div key={log.id} className="mb-2 p-2 border rounded">
                      <EditableField
                        label="Equipment Name"
                        value={log.Equipment?.name}
                        onChange={(v) =>
                          updateField(
                            `employeeEquipmentLogs[${i}].Equipment.name`,
                            v
                          )
                        }
                      />
                    </div>
                  ))}
                </Section>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

// Section component for layout
interface SectionProps {
  title: string;
  children: React.ReactNode;
  editMode?: boolean;
  onEditClick?: () => void;
}

function Section({ title, children, editMode, onEditClick }: SectionProps) {
  return (
    <section className="mb-6">
      <div className="flex items-center mb-2">
        <h3 className="text-base font-semibold flex-1 border-b pb-1">
          {title}
        </h3>
        {typeof editMode === "boolean" && onEditClick && (
          <button
            type="button"
            onClick={onEditClick}
            className="ml-2 text-gray-500 hover:text-blue-600"
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

// EditableField component for demo (replace with your own UI as needed)
function EditableField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
  type?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <label className="w-40 text-xs font-medium">{label}</label>
      <input
        className="flex-1 border rounded px-2 py-1 text-xs"
        type={type}
        value={value ?? ""}
        onChange={(e) =>
          onChange(type === "number" ? Number(e.target.value) : e.target.value)
        }
      />
    </div>
  );
}
