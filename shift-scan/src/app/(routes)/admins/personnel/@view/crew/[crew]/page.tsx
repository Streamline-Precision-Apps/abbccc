"use client";
import { useEffect, useState } from "react";
import { ReusableViewLayout } from "../../[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";

import { Grids } from "@/components/(reusable)/grids";
import { Texts } from "@/components/(reusable)/texts";
import { Images } from "@/components/(reusable)/images";

import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { deleteCrewAction, updateCrew } from "@/actions/adminActions";
import Spinner from "@/components/(animations)/spinner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { arraysAreEqual } from "@/utils/forms/isArrayEqual";
import CrewLeft from "../component/leftCrew";
import { useNotification } from "@/app/context/NotificationContext";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  permission: string;
  supervisor: boolean;
  image: string;
};

export default function ViewCrew({ params }: { params: { crew: string } }) {
  const [employees, setEmployees] = useState<User[]>([]);
  const [crewName, setCrewName] = useState<string>("");
  const [crewDescription, setCrewDescription] = useState<string>("");
  const [filter, setFilter] = useState("all");
  const [usersInCrew, setUsersInCrew] = useState<User[]>([]);
  const [initialUsersInCrew, setInitialUsersInCrew] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggledUsers, setToggledUsers] = useState<Record<string, boolean>>({});
  const [toggledManager, setToggledManagers] = useState<
    Record<string, boolean>
  >({});
  const [teamLead, setTeamLead] = useState<string | null>(null);
  const [hasChanged, setHasChanged] = useState(false);
  const { setNotification } = useNotification();
  const t = useTranslations("Admins");
  const router = useRouter();

  useEffect(() => {
    // Check for changes whenever `usersInCrew` updates
    setHasChanged(!arraysAreEqual(usersInCrew, initialUsersInCrew));
  }, [usersInCrew, initialUsersInCrew]);

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesRes = await fetch(
          `/api/getAllEmployees?filter=${filter}`
        );
        const employeesData = await employeesRes.json();
        setEmployees(employeesData);
      } catch (error) {
        console.error(`${t("FailedToFetch")} ${t("EmployeeData")}`, error);
      }
    };
    fetchEmployees();
  }, [filter, t]);

  // Fetch crew members
  useEffect(() => {
    const fetchCrewMembers = async (crewId: string) => {
      setLoading(true);
      try {
        const response = await fetch(`/api/getCrewByCrewId/${crewId}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();

        // Update crew state
        setUsersInCrew(data.crew);
        setInitialUsersInCrew(data.crew);
        setCrewName(data.crewName);
        setCrewDescription(data.crewDescription);

        // Initialize toggledUsers state
        const toggled = data.crew.reduce(
          (acc: Record<string, boolean>, user: User) => {
            acc[user.id] = true; // All crew members are toggled initially
            return acc;
          },
          {}
        );
        setToggledUsers(toggled);

        // Find and set the supervisor (team lead)
        const supervisor = data.crew.find(
          (user: User) => user.supervisor === true
        );
        if (supervisor) {
          setTeamLead(supervisor.id);
          setToggledManagers({ [supervisor.id]: true });
        } else {
          setToggledManagers(toggled); // Default to all toggled managers
        }

        setLoading(false);
      } catch (error) {
        console.error(`${t("FailedToFetch")} ${t("CrewMembers")}`, error);
        setLoading(false);
      }
    };

    fetchCrewMembers(params.crew);
  }, [params.crew, t]);

  // Add or remove users from crew based on toggle
  const toggleUser = (id: string) => {
    setToggledUsers((prev) => {
      const isToggled = !prev[id];
      // Update crew members
      setUsersInCrew((prevCrew) => {
        if (isToggled) {
          // Add to crew if toggled on
          const employee = employees.find((emp) => emp.id === id);
          return employee && !prevCrew.some((user) => user.id === id)
            ? [...prevCrew, employee]
            : prevCrew;
        } else {
          // Remove from crew if toggled off
          return prevCrew.filter((user) => user.id !== id);
        }
      });
      return { ...prev, [id]: isToggled };
    });
  };

  const toggleManager = (id: string) => {
    if (teamLead === id) {
      // If the current team lead is unchecked, remove them and re-enable all checkboxes
      setTeamLead(null);
      setToggledManagers((prev) => ({ ...prev, [id]: false }));
    } else {
      // Set the new team lead and disable checkboxes for others
      setTeamLead(id);
      setToggledManagers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          updated[key] = key === id; // Only the selected team lead remains checked
        });
        return updated;
      });
    }
  };

  const teamLeadUser = usersInCrew.find((user) => user.id === teamLead);

  const UpdateCrew = async () => {
    try {
      // Gather required parameters
      if (!hasChanged) {
        setNotification(t("NoChangesDetected"), "neutral");
        return;
      }
      const crewId = params.crew;
      if (!crewId) {
        alert(t("InvalidCrewId"));
        return;
      }

      // Prepare FormData with the necessary fields
      const formData = new FormData();
      formData.append("crewId", crewId);
      formData.append("crewName", crewName.trim());
      formData.append("crewDescription", crewDescription.trim());
      formData.append("crew", JSON.stringify(usersInCrew)); // Array of users in the crew
      formData.append("teamLead", teamLead || ""); // Optional field

      // Call the updateCrew function to handle backend update logic
      await updateCrew(crewId, formData);
      router.refresh();
      setNotification(t("UpdateCrewSuccess"), "success");
    } catch (error) {
      console.error(t("FailedToUpdateCrew"), error);
    }
  };

  const deleteCrew = async () => {
    try {
      const crewId = params.crew;
      await deleteCrewAction(crewId);
      router.push("/admins/personnel/crew");
      router.refresh();
      setNotification(t("CrewDeletedSuccessfully"), "error");
    } catch (error) {
      console.error(t("FailedToDeleteCrew"), error);
      setNotification(t("ErrorFailedToDeleteCrew"));
    }
  };

  const TeamLeadDetails = ({ user }: { user: User }) => (
    <Holds position={"row"} className="w-full h-full ">
      <Holds className="w-1/4 ">
        <Images
          titleImg={user.image || "/person.svg"}
          titleImgAlt={""}
          size={"40"}
          className={
            user.image
              ? "border-[3px] border-black rounded-full"
              : "rounded-full"
          }
          position={"left"}
        />
      </Holds>

      <Holds className="w-3/4">
        <Texts size={"p2"} position={"left"}>{`${user?.firstName || ""} ${
          user?.lastName || ""
        }`}</Texts>
      </Holds>
    </Holds>
  );

  return loading ? (
    <ReusableViewLayout
      main={
        <Holds className="h-full bg-white w-full items-center justify-center">
          <Spinner />
        </Holds>
      }
    />
  ) : (
    <ReusableViewLayout
      editFunction={setCrewName}
      editedItem={crewName}
      editCommentFunction={setCrewDescription}
      commentText={crewDescription}
      mainLeft={
        <Holds className="h-full bg-white w-1/3 mr-2">
          <CrewLeft
            addToCrew={(user) => toggleUser(user.id || "")}
            setFilter={setFilter}
            employees={employees}
            toggledUsers={toggledUsers}
            toggleUser={toggleUser}
            toggledManager={toggledManager}
            toggleManager={toggleManager}
            teamLead={teamLead}
          />
        </Holds>
      }
      mainRight={
        <Holds className="h-full bg-white w-2/3">
          <Holds className="h-full w-full px-10">
            <Texts
              size={"p6"}
              position={"right"}
              className="w-full px-10 "
            >{`Total Crew Members: ${usersInCrew.length}`}</Texts>
            <Holds
              background={"offWhite"}
              className={
                teamLeadUser
                  ? "w-full h-1/5 border-[3px] border-black rounded-[10px]   p-3 flex items-center justify-center"
                  : "w-full h-1/5 justify-center p-3"
              }
            >
              <Grids rows={"3"} cols={"6"} className="w-full h-full">
                <Holds className=" row-start-1 row-end-2 col-start-5 col-span-7 ">
                  <Texts position={"right"} size={"p6"}>
                    {t("CrewLead")}
                  </Texts>
                </Holds>
                <Holds className=" row-start-1 row-end-4 col-start-1 col-end-7 ">
                  {teamLeadUser ? (
                    <TeamLeadDetails user={teamLeadUser} />
                  ) : (
                    <Texts size={"p5"}>{t("SelectCrewLead")}</Texts>
                  )}
                </Holds>
              </Grids>
            </Holds>
            <Holds className="w-full h-4/6">
              {usersInCrew.length > 0 ? (
                <Holds
                  background={"offWhite"}
                  className="w-full h-full overflow-y-scroll no-scrollbar "
                >
                  {usersInCrew.map((user) =>
                    user.id === teamLead ? null : (
                      <Holds
                        key={user.id}
                        className="w-full h-fit border-[3px] border-black rounded-[10px] my-2 p-2 flex items-center justify-center"
                      >
                        <Holds position={"row"}>
                          <Holds className="w-1/4">
                            {user.image ? (
                              <Images
                                titleImg={user.image}
                                titleImgAlt={""}
                                size={"40"}
                                className="border-[3px] border-black rounded-full"
                                position={"left"}
                              />
                            ) : (
                              <Images
                                titleImg={"/person.svg"}
                                titleImgAlt={""}
                                size={"40"}
                                className=" rounded-full"
                                position={"left"}
                              />
                            )}
                          </Holds>
                          <Holds className="w-3/4">
                            <Texts size={"p2"} position={"left"}>
                              {`${user.firstName} ${user.lastName}`}
                            </Texts>
                          </Holds>
                        </Holds>
                      </Holds>
                    )
                  )}
                </Holds>
              ) : (
                <p>{t("NoCrewMembersFound")}</p>
              )}
            </Holds>
          </Holds>
        </Holds>
      }
      footer={
        <Holds className="h-full w-full px-4 py-2">
          <Grids rows={"3"} cols={"10"} gap={"4"} className="w-full h-full">
            <Buttons
              background={"red"}
              onClick={() => {
                deleteCrew();
              }}
              className="row-start-1 row-end-4 col-start-5 col-end-8 hover:cursor-pointer"
            >
              <Titles size={"h4"}>{t("DeleteCrew")}</Titles>
            </Buttons>

            <Buttons
              background={"green"}
              onClick={() => {
                UpdateCrew();
              }}
              className="row-start-1 row-end-4 col-start-8 col-end-11"
            >
              <Titles size={"h4"}>{t("SubmitCrew")}</Titles>
            </Buttons>
          </Grids>
        </Holds>
      }
    />
  );
}
