"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import {
  BaseUser,
  CrewData,
  CrewEditState,
  PersonnelView,
} from "../types/personnel";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { saveCrew, deleteCrew } from "@/actions/PersonnelActions";
import Spinner from "@/components/(animations)/spinner";
import { useNotification } from "@/app/context/NotificationContext";
import { useCrewEdit } from "@/app/context/(admin)/CrewEditContext";
import DeleteModal from "./DeleteModal";
import ActionBar from "./ActionBar";
import { EditableFields } from "@/components/(reusable)/EditableField";
import { Inputs } from "@/components/(reusable)/inputs";

const fetchCrewData = async (crewId: string): Promise<CrewData> => {
  const res = await fetch(`/api/getCrewByIdAdmin/${crewId}`);
  if (!res.ok) throw new Error("Failed to fetch crew data");
  const data = await res.json();
  return data as CrewData;
};

export default function CrewSelected({
  setView,
  crewId,
  employees,
  crewEditState,
  updateCrewEditState,
  retainOnlyCrewEditState,
  discardCrewEditChanges,
  resetView,
  fetchAllData,
  setViewOption,
  viewOption,
  userId,
}: {
  setView: () => void;
  crewId: string;
  employees: BaseUser[];
  crewEditState: CrewEditState;
  updateCrewEditState: (updates: Partial<CrewEditState>) => void;
  retainOnlyCrewEditState: (crewId: string) => void;
  discardCrewEditChanges: (crewId: string) => void;
  resetView: () => void;
  fetchAllData: () => Promise<void>;
  setViewOption: Dispatch<SetStateAction<PersonnelView>>;
  viewOption: PersonnelView;
  userId?: string;
}) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { setNotification } = useNotification();
  const { crew, originalCrew, edited, loading, successfullyUpdated } =
    crewEditState;
  const { isCrewEditStateDirty } = useCrewEdit();

  useEffect(() => {
    let isMounted = true;

    const loadCrewData = async () => {
      // Only fetch if we don't already have crew data or if it's a different crew
      if (crewEditState.crew?.id === crewId) return;

      updateCrewEditState({ loading: true });

      try {
        const crewData = await fetchCrewData(crewId);

        if (!isMounted) return;

        updateCrewEditState({
          crew: crewData,
          originalCrew: { ...crewData },
          edited: {},
          loading: false,

          successfullyUpdated: false,
        });
      } catch (e) {
        console.error(e);
        if (isMounted) {
          updateCrewEditState({ loading: false });
        }
      }
    };

    loadCrewData();

    return () => {
      isMounted = false;
    };
  }, [crewId]);

  const handleSave = async () => {
    if (!crew || loading) return;

    try {
      await saveCrew(crew);
      updateCrewEditState({
        loading: false,
        successfullyUpdated: true,
        originalCrew: { ...crew },
        edited: {},
      });
      setTimeout(() => {
        updateCrewEditState({ successfullyUpdated: false });
      }, 3000);
    } catch (error) {
      console.error("Failed to save crew:", error);
    }
  };

  const handleDelete = async () => {
    if (!crewId || loading) return;
    try {
      updateCrewEditState({ loading: true });
      await deleteCrew(crewId);
      await fetchAllData();
      setNotification("Crew deleted successfully", "success");
      resetView();
    } catch (error) {
      console.error("Failed to delete crew:", error);
      updateCrewEditState({ loading: false });
    }
  };

  const handleCreateNew = () => {
    if (viewOption.mode === "crew") {
      setViewOption({
        mode: "registerCrew",
      });
    }
    if (viewOption.mode === "user+crew" && userId) {
      setViewOption({
        mode: "registerCrew+user",
        userId,
      });
    }
  };

  const handleDiscardChanges = () => {
    discardCrewEditChanges(crewId);
  };
  const closeCrew = () => {
    handleDiscardChanges();
    if (viewOption.mode === "registerUser+crew") {
      setViewOption({
        mode: "registerUser",
      });
    } else if (viewOption.mode === "user+crew" && userId) {
      setViewOption({
        mode: "user",
        userId,
      });
    } else {
      setViewOption({
        mode: "default",
      });
    }
  };

  const handleInputChange = (field: keyof CrewData, value: string) => {
    if (!crew) return;

    updateCrewEditState({
      crew: {
        ...crew,
        [field]: value,
      },
      edited: {
        ...edited,
        [field]: true,
      },
    });
  };

  const isFieldEdited = (field: keyof CrewData): boolean => {
    if (!crew || !originalCrew) return false;
    return crew[field] !== originalCrew[field];
  };

  return (
    <>
      <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
        <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
          {/* Action Bar */}
          <ActionBar
            isDirty={isCrewEditStateDirty(crewId)}
            onCreateNew={handleCreateNew}
            onDelete={() => setDeleteModalOpen(true)}
            onDiscardChanges={handleDiscardChanges}
            onSave={handleSave}
            loading={loading}
            successfullyUpdated={successfullyUpdated}
            closeCrew={closeCrew}
          />

          {/* Main Form Content */}
          {loading || !crew ? (
            <Grids rows={"8"} gap="4" className="w-full h-full">
              <Holds
                background={"white"}
                className="row-start-1 row-end-2 w-full h-full px-4 animate-pulse"
              />
              <Holds
                background={"white"}
                className="row-start-2 row-end-9 h-full w-full justify-center items-center overflow-y-auto no-scrollbar p-4 animate-pulse"
              >
                <Holds className="w-full h-full justify-center items-center">
                  <Texts size="p6">Loading...</Texts>
                  <Spinner />
                </Holds>
              </Holds>
            </Grids>
          ) : (
            <Grids rows={"8"} gap="4" className="w-full h-full">
              {/* Crew Info Section */}
              <Holds
                background={"white"}
                className="row-start-1 row-end-2 w-full h-full px-4"
              >
                <Holds position={"row"} className="gap-4">
                  <Holds className="py-2 flex-1">
                    <Texts position={"left"} size={"p7"}>
                      Crew Name
                    </Texts>
                    <EditableFields
                      value={crew?.name || ""}
                      name="crewName"
                      isChanged={isFieldEdited("name")}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      onRevert={() =>
                        handleInputChange("name", originalCrew?.name || "")
                      }
                      size="default"
                      variant="default"
                    />
                  </Holds>

                  <Holds className="py-2 flex-1">
                    <Texts position={"left"} size={"p7"}>
                      Crew Type
                    </Texts>
                    <Selects
                      name="crewType"
                      value={crew?.crewType || ""}
                      className={`h-10 pl-2 ${
                        isFieldEdited("crewType")
                          ? "border-2 border-orange-400"
                          : ""
                      }`}
                      onChange={(e) =>
                        handleInputChange("crewType", e.target.value)
                      }
                    >
                      <option value="">Select a crew type</option>
                      <option value="TRUCK_DRIVER">Truck Driver</option>
                      <option value="TASCO">Tasco</option>
                      <option value="MECHANIC">Mechanical</option>
                      <option value="LABOR">Labor</option>
                    </Selects>
                  </Holds>
                </Holds>
              </Holds>

              {/* Crew Members Section */}
              <Holds
                background={"white"}
                className="row-start-2 row-end-9 h-full w-full p-4"
              >
                <Grids className="w-full h-full grid-rows-[80px_1fr] gap-4">
                  <Holds position={"row"} className="w-full h-full gap-4">
                    <Holds className="h-full w-full ">
                      <Texts size={"p7"} position={"left"}>
                        Crew Lead
                      </Texts>
                      <EditableFields
                        value={
                          crew.leadId
                            ? (() => {
                                const lead = crew.Users.find(
                                  (user: {
                                    id: string;
                                    firstName: string;
                                    lastName: string;
                                  }) => user.id === crew.leadId
                                );
                                return lead
                                  ? `${lead.firstName} ${lead.lastName}`
                                  : "";
                              })()
                            : "No crew lead selected"
                        }
                        name="crewLead"
                        isChanged={isFieldEdited("leadId")}
                        onChange={(e) =>
                          handleInputChange("leadId", e.target.value)
                        }
                        onRevert={() =>
                          handleInputChange(
                            "leadId",
                            originalCrew?.leadId || ""
                          )
                        }
                        size="default"
                        variant="default"
                        className={`pl-2 ${
                          crew?.leadId ? "" : "text-app-red "
                        }`}
                        readonly={true}
                      />
                    </Holds>
                    <Holds className="h-full w-full">
                      <Texts position={"right"} size={"p7"}>
                        Total Crew Members: {crew?.Users?.length || 0}
                      </Texts>
                    </Holds>
                  </Holds>

                  <Holds
                    className={`w-full h-full border-[3px] ${
                      isFieldEdited("Users")
                        ? "border-orange-400"
                        : "border-black"
                    } rounded-[10px]`}
                  >
                    <Holds className="w-full h-full overflow-y-auto no-scrollbar p-3">
                      {!crew?.Users || crew.Users.length === 0 ? (
                        <Holds className="w-full h-full justify-center items-center">
                          <Texts size="p6" className="text-center px-4 italic">
                            No members selected for this crew.
                          </Texts>
                        </Holds>
                      ) : (
                        <>
                          {crew.Users.map(
                            (member: {
                              id: string;
                              firstName: string;
                              lastName: string;
                            }) => (
                              <Holds
                                key={member.id}
                                position={"left"}
                                className="w-full p-2 flex justify-between "
                              >
                                <Texts position="left" size="p7">
                                  {member.firstName} {member.lastName}
                                </Texts>
                              </Holds>
                            )
                          )}
                        </>
                      )}
                    </Holds>
                  </Holds>
                </Grids>
              </Holds>
            </Grids>
          )}
        </Grids>
      </Holds>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
      />
    </>
  );
}
