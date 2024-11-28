"use client";
import { useEffect, useMemo, useState } from "react";
import { ReusableViewLayout } from "../../[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { Grids } from "@/components/(reusable)/grids";
import { Texts } from "@/components/(reusable)/texts";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import CheckBox from "@/components/(inputs)/CheckBox";
import CheckBoxWithImage from "@/components/(inputs)/CheckBoxWithImage";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  permission: string;
  supervisor: boolean;
};

export default function ViewCrew({ params }: { params: { crew: string } }) {
  const [employees, setEmployees] = useState<User[]>([]);
  const [filter, setFilter] = useState("all");
  const [usersInCrew, setUsersInCrew] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggledUsers, setToggledUsers] = useState<Record<string, boolean>>({});
  const [toggledManager, setToggledManagers] = useState<
    Record<string, boolean>
  >({});
  const [teamLead, setTeamLead] = useState<string | null>(null);

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
        setUsersInCrew(data);
        // Mark crew members as toggled
        const toggled = data.reduce(
          (acc: Record<string, boolean>, user: User) => {
            acc[user.id] = true;
            return acc;
          },
          {}
        );
        setToggledUsers(toggled);

        const supervisor = data.find((user: User) => user.supervisor === true);
        if (supervisor) {
          setTeamLead(supervisor.id);
          setToggledManagers({ [supervisor.id]: true });
        } else {
          setToggledManagers(toggled); // Default to all toggled managers
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch crew members:", error);
      }
      setLoading(false);
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

  return loading ? (
    <p>Loading...</p>
  ) : (
    <ReusableViewLayout
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
          {usersInCrew.length > 0 ? (
            <ul>
              {usersInCrew.map((user) => (
                <li key={user.id}>
                  {user.firstName} {user.lastName}
                </li>
              ))}
            </ul>
          ) : (
            <p>No crew members found</p>
          )}
        </Holds>
      }
    />
  );
}

function CrewLeft({
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
    <Holds className="h-full w-full">
      <Grids rows="10" gap="5" className="h-full">
        <Holds className="bg-white h-full w-full">
          <Selects
            defaultValue="all"
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-0 py-2 text-center"
          >
            <option value="all">Select Filter</option>
            <option value="all">All</option>
            <option value="active">Active</option>
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
