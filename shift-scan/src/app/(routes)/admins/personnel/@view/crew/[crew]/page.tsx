"use client";
import { useEffect, useMemo, useState } from "react";
import { ReusableViewLayout } from "../../[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { Grids } from "@/components/(reusable)/grids";
import { Texts } from "@/components/(reusable)/texts";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { z } from "zod";

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

type CrewMember = {
  id: number;
  crewId: number;
  user: User;
};

type CrewMembersResponse = CrewMember[];

const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

const crewMemberSchema = z.object({
  id: z.number(),
  crewId: z.number(),
  user: userSchema,
});

const crewMembersResponseSchema = z.array(crewMemberSchema);

export default function ViewCrew({ params }: { params: { crew: string } }) {
  const [employees, setEmployees] = useState<User[]>([]);
  const [filter, setFilter] = useState("all");
  const [usersInCrew, setUsersInCrew] = useState<User[]>([]);
  const [loading, setLoading] = useState(true); // Loading state for crew members

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
        setLoading(false);
        return data;
      } catch (error) {
        console.error("Failed to fetch crew members:", error);
      }
    };
    fetchCrewMembers(params.crew);
  }, [params.crew]);

  // Add unique users to crew
  const addToCrew = (employee: User) => {
    setUsersInCrew((prev) =>
      prev.some((user) => user.id === employee.id) ? prev : [...prev, employee]
    );
  };

  return (
    <ReusableViewLayout
      mainLeft={
        <Holds className="h-full bg-white w-1/3 mr-2">
          <CrewLeft
            addToCrew={addToCrew}
            setFilter={setFilter}
            employees={employees}
          />
        </Holds>
      }
      mainRight={
        <Holds className="h-full bg-white w-2/3">
          {usersInCrew.length > 0 ? (
            <ul>
              {usersInCrew.map((user) =>
                user && user.firstName && user.lastName ? (
                  <li key={user.id}>
                    {user.firstName} {user.lastName}
                  </li>
                ) : (
                  <li key={Math.random()}>Invalid User Data</li> // Fallback
                )
              )}
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
  addToCrew,
}: {
  setFilter: (filter: string) => void;
  employees: User[];
  addToCrew: (employee: User) => void;
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
                className="py-2 border-b cursor-pointer"
                onClick={() => addToCrew(employee)}
              >
                <Texts size="p6">
                  {employee.firstName} {employee.lastName}
                </Texts>
              </Holds>
            ))}
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
