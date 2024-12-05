"use client";
import { useEffect, useMemo, useState } from "react";
import { ReusableViewLayout } from "../../[equipment]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { Grids } from "@/components/(reusable)/grids";
import { Texts } from "@/components/(reusable)/texts";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { CheckBox } from "@/components/(inputs)/checkBox";
import CheckBoxWithImage from "@/components/(inputs)/CheckBoxWithImage";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { deleteCrewAction, updateCrew } from "@/actions/adminActions";
import Spinner from "@/components/(animations)/spinner";
import { useRouter } from "next/navigation";

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
  const [loading, setLoading] = useState(true);
  const [toggledUsers, setToggledUsers] = useState<Record<string, boolean>>({});
  const [toggledManager, setToggledManagers] = useState<
    Record<string, boolean>
  >({});
  const [teamLead, setTeamLead] = useState<string | null>(null);
  const router = useRouter();

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
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, [filter]);

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
        console.error("Failed to fetch crew members:", error);
        setLoading(false);
      }
    };

    fetchCrewMembers(params.crew);
  }, [params.crew]);

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
      const crewId = params.crew;
      if (!crewId) {
        alert("Invalid crew ID.");
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
    } catch (error) {
      console.error("Failed to update crew:", error);
    }
  };

  const deleteCrew = async () => {
    try {
      const crewId = params.crew;
      await deleteCrewAction(crewId);
      router.push("/admins/personnel/crew");
    } catch (error) {
      console.error("Failed to delete crew:", error);
      alert("An error occurred while deleting the crew. Please try again.");
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
            addToCrew={(user) => toggleUser(user.id)}
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
          >{`Total Crew Members: ${usersInCrew.length}`}</Texts>
          <Holds className="h-full p-4 px-10">
            <Holds
              background={"offWhite"}
              className={
                teamLeadUser
                  ? "w-full h-fit border-[3px] border-black rounded-[10px] my-2  p-3 flex items-center justify-center"
                  : "w-full h-1/5 justify-center p-3"
              }
            >
              <Grids rows={"3"} cols={"6"} className="w-full h-full">
                <Holds className=" row-start-1 row-end-2 col-start-5 col-span-7 ">
                  <Texts position={"right"} size={"p6"}>
                    Crew Lead
                  </Texts>
                </Holds>
                <Holds className=" row-start-1 row-end-4 col-start-1 col-end-7 ">
                  {teamLeadUser ? (
                    <TeamLeadDetails user={teamLeadUser} />
                  ) : (
                    <Texts size={"p5"}>Select a Crew lead</Texts>
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
                <p>No crew members found</p>
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
              <Titles size={"h4"}>Delete Crew</Titles>
            </Buttons>

            <Buttons
              background={"green"}
              onClick={() => {
                UpdateCrew();
              }}
              className="row-start-1 row-end-4 col-start-8 col-end-11"
            >
              <Titles size={"h4"}>Submit Crew</Titles>
            </Buttons>
          </Grids>
        </Holds>
      }
    />
  );
}

export function CrewLeft({
  setFilter,
  employees,

  toggledUsers,
  toggleUser,
  toggledManager,
  toggleManager,
  teamLead,
}: {
  setFilter: (filter: string) => void;
  employees: User[];
  addToCrew: (employee: User) => void;
  toggledUsers: Record<string, boolean>;
  toggleUser: (id: string) => void;
  toggledManager: Record<string, boolean>;
  toggleManager: (id: string) => void;
  teamLead: string | null;
}) {
  const [term, setTerm] = useState<string>("");

  const filteredList = useMemo(() => {
    if (!term.trim()) return employees;
    return employees.filter((employee) => {
      const name = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      return name.includes(term.toLowerCase());
    });
  }, [term, employees]);

  return (
    <Holds className="h-full w-full px-4 py-2">
      <Grids rows="10" gap="5" className="h-full">
        <Holds className="bg-white h-full w-full">
          <Selects
            defaultValue="all"
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-0 py-2 text-center"
          >
            <option value="all">Select Filter</option>
            <option value="all">All</option>
            <option value="supervisors">Supervisors</option>
          </Selects>
        </Holds>
        <Holds className="row-span-8 h-full border-[3px] border-black rounded-t-[10px]">
          <Holds position="row" className="py-2 border-b-[3px] border-black">
            <Holds className="h-full w-[20%]">
              <Images titleImg="/magnifyingGlass.svg" titleImgAlt="search" />
            </Holds>
            <Holds className="w-[80%]">
              <Inputs
                type="search"
                placeholder="Search employees by name"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="border-none outline-none"
              />
            </Holds>
          </Holds>
          <Holds className="h-full mb-4 overflow-y-auto no-scrollbar">
            {filteredList.map((employee) => (
              <Holds
                key={employee.id}
                className="py-2 border-b cursor-pointer flex items-center"
              >
                <Holds position={"row"} className="justify-between">
                  <Holds className="flex w-2/3">
                    <Texts size="p6">
                      {employee.firstName} {employee.lastName}
                    </Texts>
                  </Holds>
                  <Holds position="row" className="relative flex w-1/3">
                    {!employee.permission.includes("USER") &&
                    toggledUsers[employee.id] ? (
                      <Holds className="relative w-1/2">
                        {!teamLead ? (
                          <CheckBoxWithImage
                            id={employee.id}
                            defaultChecked={!!toggledManager[employee.id]}
                            onChange={() => {
                              toggleManager(employee.id);
                            }}
                            size={2}
                            name={""}
                            type=""
                          />
                        ) : teamLead === employee.id ? (
                          <CheckBoxWithImage
                            id={employee.id}
                            defaultChecked={!!toggledManager[employee.id]}
                            onChange={() => {
                              toggleManager(employee.id);
                            }}
                            size={2}
                            name={""}
                            type="selected"
                          />
                        ) : (
                          <CheckBoxWithImage
                            id={employee.id}
                            size={2}
                            name={""}
                            disabled
                          />
                        )}
                      </Holds>
                    ) : (
                      <Holds className="relative w-1/2"></Holds>
                    )}
                    <CheckBox
                      id={employee.id}
                      defaultChecked={!!toggledUsers[employee.id]}
                      onChange={() => toggleUser(employee.id)}
                      disabled={employee.id === teamLead}
                      size={2}
                      name={""}
                    />
                  </Holds>
                </Holds>
              </Holds>
            ))}
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
