"use client";
import { FormEvent, useEffect, useState } from "react";
import { ReusableViewLayout } from "../../[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";

import { Grids } from "@/components/(reusable)/grids";
import { Texts } from "@/components/(reusable)/texts";
import { Images } from "@/components/(reusable)/images";
import { Buttons } from "@/components/(reusable)/buttons";
import Spinner from "@/components/(animations)/spinner";
import { Titles } from "@/components/(reusable)/titles";
import { createCrew } from "@/actions/adminActions";
import { Forms } from "@/components/(reusable)/forms";
import { useNotification } from "@/app/context/NotificationContext";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import CrewLeft from "../component/leftCrew";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  permission: string;
  supervisor: boolean;
  image: string;
};

export default function CreateTeam() {
  const [employees, setEmployees] = useState<User[]>([]);
  const [crewName, setCrewName] = useState<string>("");
  const [crewDescription, setCrewDescription] = useState<string>("");
  const [filter, setFilter] = useState("all");
  const [usersInCrew, setUsersInCrew] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggledUsers, setToggledUsers] = useState<Record<string, boolean>>({});
  const [toggledManager, setToggledManagers] = useState<
    Record<string, boolean>
  >({});
  const { setNotification } = useNotification();
  const [teamLead, setTeamLead] = useState<string | null>(null);
  const t = useTranslations("Admins");
  const router = useRouter();

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/getAllEmployees?filter=${filter}`);
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error(`${t("FailedToFetch")} ${t("Employee")}`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [filter, t]);

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

  const saveCrew = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (!crewName.trim()) {
        setNotification(t("CrewNameRequired"), "error");
        return;
      }

      if (!teamLead) {
        setNotification(t("TeamLeadRequired"), "error");
        return;
      }

      // Prepare formData
      const formData = new FormData(event.target as HTMLFormElement);
      formData.append("crewName", crewName.trim());
      formData.append("crewDescription", crewDescription.trim());
      formData.append(
        "crew",
        JSON.stringify(
          usersInCrew.map((user) => ({
            id: user.id,
          }))
        )
      );
      formData.append("teamLead", teamLead);

      // Call the server action
      await createCrew(formData);

      router.refresh();
      setNotification(t("CrewCreatedSuccessfully"), "success");

      setCrewName(""); // Clear the crew name
      setCrewDescription(""); // Clear the description
      setUsersInCrew([]); // Reset crew members
      setToggledUsers({}); // Reset toggled users
      setToggledManagers({}); // Reset toggled managers
      setTeamLead(null); // Clear the selected team lead
    } catch (error) {
      console.error("Failed to create crew:", error);
      setNotification(
        `${t("FailedToCreateCrew")} ${t("PleaseTryAgain")}`,
        "error"
      );
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
            addToCrew={(user: { id: string }) => toggleUser(user.id)}
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
          <Texts
            size={"p6"}
            position={"right"}
            className="w-full px-10 py-2"
          >{`${t("TotalCrewMembers")}: ${usersInCrew.length}`}</Texts>
          <Holds className="h-full  px-10">
            <Holds
              background={"offWhite"}
              className={
                teamLead
                  ? "w-full h-fit border-[3px] border-black rounded-[10px] mb-4  p-3 flex items-center justify-center"
                  : "w-full h-1/5 justify-center p-3 mb-4"
              }
            >
              <Grids rows={"3"} cols={"6"} className="w-full h-full">
                <Holds className=" row-start-1 row-end-2 col-start-5 col-span-7 ">
                  <Texts position={"right"} size={"p6"}>
                    {t("CrewLead")}
                  </Texts>
                </Holds>
                <Holds className=" row-start-1 row-end-4 col-start-1 col-end-7 ">
                  {teamLead ? (
                    <TeamLeadDetails
                      user={employees.find((emp) => emp.id === teamLead)!}
                    />
                  ) : (
                    <Texts size={"p6"}>{t("SelectCrewLead")}</Texts>
                  )}
                </Holds>
              </Grids>
            </Holds>
            <Holds className="w-full h-4/5">
              {usersInCrew.length > 0 ? (
                <Holds
                  background={"offWhite"}
                  className="w-full h-full overflow-y-scroll no-scrollbar "
                >
                  {usersInCrew.map((user) =>
                    user.id === teamLead ? null : (
                      <Holds
                        key={user.id}
                        className="w-full h-fit border-[3px] border-black rounded-[10px] my-2 p-3 flex items-center justify-center"
                      >
                        <Holds position={"row"}>
                          <Holds className="w-1/4">
                            <Images
                              titleImg={user.image || "/person.svg"}
                              titleImgAlt={""}
                              size={"40"}
                              className="border-[3px] border-black rounded-full"
                              position={"left"}
                            />
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
                <Holds background={"offWhite"} className="w-full h-full">
                  <Texts size={"p6"}>{t("NoCrewMembersFound")}</Texts>
                </Holds>
              )}
            </Holds>
          </Holds>
        </Holds>
      }
      footer={
        <Forms className="h-full w-full" onSubmit={(e) => saveCrew(e)}>
          <Holds className="h-full w-full px-4 py-2">
            <Grids rows={"3"} cols={"10"} gap={"4"} className="w-full h-full">
              <Buttons
                background={"green"}
                type="submit"
                className="row-start-1 row-end-4 col-start-8 col-end-11"
              >
                <Titles size={"h4"}>{t("CreateCrew")}</Titles>
              </Buttons>
            </Grids>
          </Holds>
        </Forms>
      }
    />
  );
}
