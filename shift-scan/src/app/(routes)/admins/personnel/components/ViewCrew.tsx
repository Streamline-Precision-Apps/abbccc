"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { BaseUser, CrewData, CrewEditState } from "./types/personnel";
import { useEffect } from "react";
import { saveCrew, deleteCrew } from "@/actions/PersonnelActions";
import Spinner from "@/components/(animations)/spinner";
import { useTime } from "framer-motion";

const fetchCrewData = async (crewId: string): Promise<CrewData> => {
  const res = await fetch(`/api/getCrewByIdAdmin/${crewId}`);
  if (!res.ok) throw new Error("Failed to fetch crew data");
  const data = await res.json();
  return data as CrewData;
};

export default function ViewCrew({
  setView,
  crewId,
  crewEditStates,
  updateCrewEditState,
  retainOnlyCrewEditState,
  discardCrewEditChanges,
  resetView,
  fetchAllData,
}: {
  setView: () => void;
  crewId: string;
  employees: BaseUser[];
  crewEditStates: CrewEditState;
  updateCrewEditState: (updates: Partial<CrewEditState>) => void;
  retainOnlyCrewEditState: (crewId: string) => void;
  discardCrewEditChanges: (crewId: string) => void;
  resetView: () => void;
  fetchAllData: () => Promise<void>;
}) {
  const { crew, edited, loading } = crewEditStates;

  useEffect(() => {
    let isMounted = true;

    const loadCrewData = async () => {
      // Only fetch if we don't already have crew data or if it's a different crew
      if (crewEditStates.crew?.id === crewId) return;

      updateCrewEditState({ loading: true });

      try {
        const crewData = await fetchCrewData(crewId);

        if (!isMounted) return;

        updateCrewEditState({
          crew: crewData,
          originalCrew: { ...crewData },
          edited: {},
          loading: false,
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
      updateCrewEditState({ loading: true });
      await saveCrew(crew);
      updateCrewEditState({
        loading: false,
        successfullyUpdated: true,
        originalCrew: { ...crew },
        edited: {},
      });
    } catch (error) {
      console.error("Failed to save crew:", error);
      updateCrewEditState({ loading: false });
    }
  };

  const handleDelete = async () => {
    if (!crewId || loading) return;

    try {
      updateCrewEditState({ loading: true });
      await deleteCrew(crewId);

      await fetchAllData();
      updateCrewEditState({ deleted: true });
      resetView();
      setTimeout(() => {
        updateCrewEditState({ deleted: true });
      }, 3000);
    } catch (error) {
      console.error("Failed to delete crew:", error);
      updateCrewEditState({ loading: false });
    }
  };

  const handleCreateNew = () => {
    retainOnlyCrewEditState("new");
  };

  const handleDiscardChanges = () => {
    discardCrewEditChanges(crewId);
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

  return (
    <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
      <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
        {/* Action Bar */}
        <Holds
          background={"white"}
          position={"row"}
          className="w-full px-5 py-1 justify-between items-center"
        >
          <Texts text={"link"} size={"p7"} onClick={handleCreateNew}>
            Create New Crew
          </Texts>

          <Texts
            text={"link"}
            size={"p7"}
            onClick={handleDelete}
            style={{ color: "red" }}
          >
            Delete Crew
          </Texts>

          <Texts text={"link"} size={"p7"} onClick={handleDiscardChanges}>
            Discard Changes
          </Texts>

          <Texts
            text={"link"}
            size={"p7"}
            onClick={handleSave}
            style={{
              opacity: loading ? 0.5 : Object.keys(edited).length > 0 ? 1 : 0.5,
              pointerEvents: loading ? "none" : "auto",
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Texts>
        </Holds>

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
                  <Inputs
                    type="text"
                    name="crewName"
                    value={crew?.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-10 pl-2"
                  />
                </Holds>

                <Holds className="py-2 flex-1">
                  <Texts position={"left"} size={"p7"}>
                    Crew Type
                  </Texts>
                  <Selects
                    name="crewType"
                    value={crew?.crewType || ""}
                    className="h-10 pl-2"
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
                    <Inputs
                      type="text"
                      name="crewLead"
                      value={
                        crew.leadId
                          ? crew?.Users.find((user) => user.id === crew?.leadId)
                              ?.firstName +
                              " " +
                              crew?.Users.find(
                                (user) => user.id === crew?.leadId
                              )?.lastName || ""
                          : "No crew lead selected"
                      }
                      readOnly
                      className={`pl-2 ${crew?.leadId ? "" : "text-app-red "}`}
                    />
                  </Holds>
                  <Holds className="h-full w-full">
                    <Texts position={"right"} size={"p7"}>
                      Total Crew Members: {crew?.Users?.length || 0}
                    </Texts>
                  </Holds>
                </Holds>

                <Holds className="w-full h-full border-[3px] border-black rounded-[10px]">
                  <Holds className="w-full h-full overflow-y-auto no-scrollbar">
                    {!crew?.Users || crew.Users.length === 0 ? (
                      <Texts size="p7" className="text-center p-4">
                        No members selected yet
                      </Texts>
                    ) : (
                      <div className="space-y-2">
                        {crew.Users.map((member) => (
                          <Holds
                            key={member.id}
                            className="p-2 border-b flex justify-between items-center"
                          >
                            <Texts size="p7">
                              {member.firstName} {member.lastName}
                            </Texts>
                          </Holds>
                        ))}
                      </div>
                    )}
                  </Holds>
                </Holds>
              </Grids>
            </Holds>
          </Grids>
        )}
      </Grids>
    </Holds>
  );
}
