"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNotification } from "@/app/context/NotificationContext";
import { z } from "zod";
import { Images } from "@/components/(reusable)/images";
import { SearchUser } from "@/lib/types/admin/personnel";
import { SearchCrew } from "@/lib/types";
import Spinner from "@/components/(animations)/spinner";

export default function Personnel() {
  const t = useTranslations("Admins");
  const [loading, setLoading] = useState(false); // Optimized: fetch both in parallel, handle errors, and loading state properly
  const [employees, setEmployees] = useState<SearchUser[]>([]);
  const [crew, setCrew] = useState<SearchCrew[]>([]);
  const [term, setTerm] = useState<string>("");
  const { notification } = useNotification();

  // Unified view state
  type PersonnelView =
    | { mode: "default" }
    | { mode: "user"; userId: string }
    | { mode: "crew"; crewId: string }
    | { mode: "user+crew"; userId: string; crewId: string }
    | { mode: "registerCrew+user"; userId: string }
    | { mode: "registerUser" }
    | { mode: "registerCrew" }
    | { mode: "registerBoth" };

  const [view, setView] = useState<PersonnelView>({ mode: "default" });

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [employeesRes, crewRes] = await Promise.all([
        fetch("/api/getAllEmployees?filter=all"),
        fetch("/api/getAllCrews", { next: { tags: ["crews"] } }),
      ]);

      if (!employeesRes.ok)
        throw new Error(`Failed to fetch employees: ${employeesRes.status}`);
      if (!crewRes.ok)
        throw new Error(`Failed to fetch crews: ${crewRes.status}`);

      const employeesData = await employeesRes.json();
      const crewData = await crewRes.json();
      setEmployees(employeesData);
      setCrew(crewData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(t("ZodError"), error.errors);
      } else {
        console.error(`${t("FailedToFetch")} ${t("EmployeesData")}`, error);
      }
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAllData();
  }, [t, fetchAllData]);

  const filteredList = useMemo(() => {
    if (!term.trim()) {
      return [...employees].sort((a, b) =>
        a.lastName.localeCompare(b.lastName)
      );
    } // Return the full list if no term is entered

    return employees
      .filter((employee) => {
        const name = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        return name.includes(term.toLowerCase());
      })
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [term, employees]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(e.target.value);
    },
    []
  );

  return (
    <Holds background={"white"} className="h-full w-full rounded-[10px]">
      <Holds background={"adminBlue"} className="h-full w-full rounded-[10px]">
        <Grids
          cols={"10"}
          gap={"5"}
          className="w-full h-full p-3 rounded-[10px]"
        >
          {/* Sidebar with search and list, make it scrollable only in the list area */}
          <Holds className="w-full h-full col-start-1 col-end-3">
            <Grids className="w-full h-full grid-rows-[40px_40px_1fr] gap-2">
              <Holds className="w-full h-full">
                <Selects
                  onChange={(e) => {
                    const crewId = e.target.value;
                    if (crewId) {
                      if (view.mode === "user" && "userId" in view) {
                        setView({
                          mode: "user+crew",
                          userId: view.userId,
                          crewId,
                        });
                      } else {
                        setView({ mode: "crew", crewId });
                      }
                    } else {
                      setView({ mode: "default" });
                    }
                  }}
                  value={
                    view.mode === "crew"
                      ? view.crewId
                      : view.mode === "user+crew"
                      ? view.crewId
                      : ""
                  }
                  className="w-full text-center text-base h-full border-2 "
                >
                  <option value="">Select a Crew</option>
                  {crew.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Selects>
              </Holds>
              <Holds
                background={"white"}
                position={"row"}
                className="w-full h-full "
              >
                <Holds size={"10"}>
                  <Images titleImg="/searchLeft.svg" titleImgAlt="search" />
                </Holds>
                <Inputs
                  type="search"
                  placeholder={t("PersonalSearchPlaceholder")}
                  value={term}
                  onChange={handleSearchChange}
                  className="border-none outline-none text-sm text-left w-full h-full rounded-md bg-white"
                />
              </Holds>

              <Holds
                background={"white"}
                className="w-full h-full overflow-y-auto no-scrollbar"
              >
                {loading ? (
                  <Holds className="flex justify-center items-center w-full h-full">
                    <Spinner />
                  </Holds>
                ) : (
                  <div className="w-full h-full flex flex-col p-3 space-y-2">
                    {filteredList.map((employee) => {
                      // Highlight logic for all user-related modes
                      const isSelected =
                        (view.mode === "user" && view.userId === employee.id) ||
                        (view.mode === "user+crew" &&
                          view.userId === employee.id) ||
                        (view.mode === "registerCrew+user" &&
                          view.userId === employee.id);

                      return (
                        <Holds
                          key={employee.id}
                          onClick={() => {
                            if (view.mode === "crew" && "crewId" in view) {
                              setView({
                                mode: "user+crew",
                                userId: employee.id,
                                crewId: view.crewId,
                              });
                            } else if (
                              (view.mode === "user" &&
                                view.userId === employee.id) ||
                              (view.mode === "registerCrew+user" &&
                                view.userId === employee.id)
                            ) {
                              setView({ mode: "default" });
                            } else {
                              setView({ mode: "user", userId: employee.id });
                            }
                          }}
                          className={`p-1 pl-2 flex-shrink-0 hover:bg-gray-100 ${
                            isSelected ? "border-[3px] border-black" : ""
                          }  rounded-[10px]`}
                        >
                          <Texts position={"left"} size={"p7"}>
                            {`${employee.firstName} ${employee.lastName}`}
                          </Texts>
                        </Holds>
                      );
                    })}
                  </div>
                )}
              </Holds>
            </Grids>
          </Holds>
          {/* Main content area, also scrollable if needed */}
          {/* Display logic based on new state variables */}
          {view.mode === "user" && (
            <>
              <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
                <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
                  <Holds
                    background={"white"}
                    position={"row"}
                    className="w-full px-5 py-1  justify-between items-center"
                  >
                    <Holds className="flex w-fit items-center ">
                      <Texts
                        text={"link"}
                        size={"p7"}
                        onClick={() => setView({ mode: "registerUser" })}
                      >
                        Register New Employee
                      </Texts>
                    </Holds>
                    <Holds
                      position={"row"}
                      className="flex w-fit items-center space-x-10 "
                    >
                      <Holds className="flex w-fit items-center ">
                        <Texts
                          text={"link"}
                          size={"p7"}
                          onClick={() => setView({ mode: "default" })}
                        >
                          Discard All Changes
                        </Texts>
                      </Holds>
                      <Holds className="flex w-fit items-center ">
                        <Texts text={"link"} size={"p7"}>
                          Save Changes
                        </Texts>
                      </Holds>
                    </Holds>
                  </Holds>
                  <Holds
                    background={"white"}
                    className="w-full h-full overflow-y-auto no-scrollbar p-3"
                  >
                    User Data for {view.userId}
                  </Holds>
                </Grids>
              </Holds>
              <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
                <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
                  <Holds
                    background={"white"}
                    position={"row"}
                    className="w-full px-5 py-1 space-x-10 items-center"
                  >
                    <Holds className="flex w-fit items-center ">
                      <Texts
                        text={"link"}
                        size={"p7"}
                        onClick={() =>
                          setView(
                            view.mode === "user" && "userId" in view
                              ? {
                                  mode: "registerCrew+user",
                                  userId: view.userId,
                                }
                              : view
                          )
                        }
                      >
                        Create New Crew
                      </Texts>
                    </Holds>
                  </Holds>
                </Grids>
              </Holds>
            </>
          )}
          {view.mode === "registerCrew+user" && (
            <>
              {" "}
              <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
                <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
                  <Holds
                    background={"white"}
                    position={"row"}
                    className="w-full px-5 py-1 justify-between items-center"
                  >
                    <Texts text={"link"} size={"p7"}>
                      Submit New Crew
                    </Texts>
                    <Texts
                      text={"link"}
                      size={"p7"}
                      onClick={() =>
                        setView({ mode: "user", userId: view.userId })
                      }
                    >
                      Cancel Crew Creation
                    </Texts>
                  </Holds>
                  <Holds
                    background={"white"}
                    className="w-full h-full justify-center items-center overflow-y-auto no-scrollbar p-3"
                  >
                    Create New Crew Form
                  </Holds>
                </Grids>
              </Holds>
              <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
                <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
                  <Holds
                    background={"white"}
                    position={"row"}
                    className="w-full px-5 py-1  justify-between items-center"
                  >
                    <Holds className="flex w-fit items-center ">
                      <Texts
                        text={"link"}
                        size={"p7"}
                        onClick={() => setView({ mode: "registerUser" })}
                      >
                        Register New Employee
                      </Texts>
                    </Holds>
                    <Holds
                      position={"row"}
                      className="flex w-fit items-center space-x-10 "
                    >
                      <Holds className="flex w-fit items-center ">
                        <Texts
                          text={"link"}
                          size={"p7"}
                          onClick={() => setView({ mode: "registerCrew" })}
                        >
                          Discard All Changes
                        </Texts>
                      </Holds>
                      <Holds className="flex w-fit items-center ">
                        <Texts text={"link"} size={"p7"}>
                          Save Changes
                        </Texts>
                      </Holds>
                    </Holds>
                  </Holds>
                  <Holds
                    background={"white"}
                    className="w-full h-full overflow-y-auto no-scrollbar p-3"
                  >
                    User Data for {view.userId}
                  </Holds>
                </Grids>
              </Holds>
            </>
          )}
          {view.mode === "registerUser" && (
            <>
              <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
                <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
                  <Holds
                    background={"white"}
                    position={"row"}
                    className="w-full px-5 py-1 justify-between items-center"
                  >
                    <Texts text={"link"} size={"p7"}>
                      Submit New Employee
                    </Texts>
                    <Texts
                      text={"link"}
                      size={"p7"}
                      onClick={() => setView({ mode: "default" })}
                    >
                      Cancel Registration
                    </Texts>
                  </Holds>
                  <Holds
                    background={"white"}
                    className="w-full h-full justify-center items-center overflow-y-auto no-scrollbar p-3"
                  >
                    New Employee Form
                  </Holds>
                </Grids>
              </Holds>
              <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
                <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
                  <Holds
                    background={"white"}
                    position={"row"}
                    className="w-full px-5 py-1 justify-between items-center"
                  >
                    <Texts
                      text={"link"}
                      size={"p7"}
                      onClick={() => setView({ mode: "registerBoth" })}
                    >
                      Create New Crew
                    </Texts>
                  </Holds>
                </Grids>
              </Holds>
            </>
          )}
          {/* registerBoth mode is not used in this UI, so this block is removed for clarity */}
          {view.mode === "registerCrew" && (
            <>
              <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
                <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
                  <Holds
                    background={"white"}
                    position={"row"}
                    className="w-full px-5 py-1 justify-between items-center"
                  >
                    <Texts text={"link"} size={"p7"}>
                      Submit New Crew
                    </Texts>
                    <Texts
                      text={"link"}
                      size={"p7"}
                      onClick={() => setView({ mode: "default" })}
                    >
                      Cancel Crew Creation
                    </Texts>
                  </Holds>
                  <Holds
                    background={"white"}
                    className="w-full h-full justify-center items-center overflow-y-auto no-scrollbar p-3"
                  >
                    Create New Crew Form
                  </Holds>
                </Grids>
              </Holds>
              <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
                <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
                  <Holds
                    background={"white"}
                    position={"row"}
                    className="w-full px-5 py-1 justify-between items-center"
                  >
                    <Texts
                      text={"link"}
                      size={"p7"}
                      onClick={() => setView({ mode: "registerBoth" })}
                    >
                      Register New Employee
                    </Texts>
                  </Holds>
                </Grids>
              </Holds>
            </>
          )}
          {view.mode === "registerBoth" && (
            <>
              <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
                <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
                  <Holds
                    background={"white"}
                    position={"row"}
                    className="w-full px-5 py-1 justify-between items-center"
                  >
                    <Texts text={"link"} size={"p7"}>
                      Submit New Crew
                    </Texts>
                    <Texts
                      text={"link"}
                      size={"p7"}
                      onClick={() => setView({ mode: "registerUser" })}
                    >
                      Cancel Crew Creation
                    </Texts>
                  </Holds>
                  <Holds
                    background={"white"}
                    className="w-full h-full justify-center items-center overflow-y-auto no-scrollbar p-3"
                  >
                    Create New Crew Form
                  </Holds>
                </Grids>
              </Holds>
              <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
                <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
                  <Holds
                    background={"white"}
                    position={"row"}
                    className="w-full px-5 py-1 justify-between items-center"
                  >
                    <Texts text={"link"} size={"p7"}>
                      Submit New Employee
                    </Texts>
                    <Texts
                      text={"link"}
                      size={"p7"}
                      onClick={() => setView({ mode: "registerCrew" })}
                    >
                      Cancel Registration
                    </Texts>
                  </Holds>
                  <Holds
                    background={"white"}
                    className="w-full h-full justify-center items-center overflow-y-auto no-scrollbar p-3"
                  >
                    New Employee Form
                  </Holds>
                </Grids>
              </Holds>
            </>
          )}
          {view.mode === "crew" && (
            <>
              <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
                <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
                  <Holds
                    background={"white"}
                    position={"row"}
                    className="w-full px-5 py-1 justify-between  items-center"
                  >
                    <Holds className="flex w-fit items-center ">
                      <Texts text={"link"} size={"p7"}>
                        Create New Crew
                      </Texts>
                    </Holds>
                    <Holds className="flex w-fit items-center ">
                      <Texts text={"link"} size={"p7"}>
                        Delete Crew
                      </Texts>
                    </Holds>
                    <Holds className="flex w-fit items-center ">
                      <Texts
                        text={"link"}
                        size={"p7"}
                        onClick={() => setView({ mode: "default" })}
                      >
                        Discard All Changes
                      </Texts>
                    </Holds>
                    <Holds className="flex w-fit items-center ">
                      <Texts text={"link"} size={"p7"}>
                        Save Changes
                      </Texts>
                    </Holds>
                  </Holds>
                  <Holds
                    background={"white"}
                    className="w-full h-full overflow-y-auto no-scrollbar p-3"
                  >
                    Crew Data
                  </Holds>
                </Grids>
              </Holds>
              <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
                <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
                  <Holds
                    background={"white"}
                    position={"row"}
                    className="w-full px-5 py-1 space-x-10 items-center"
                  >
                    <Holds className="flex w-fit items-center ">
                      <Texts text={"link"} size={"p7"}>
                        Register New Employee
                      </Texts>
                    </Holds>
                  </Holds>
                </Grids>
              </Holds>
            </>
          )}
          {view.mode === "user+crew" && (
            <>
              <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
                <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
                  <Holds
                    background={"white"}
                    position={"row"}
                    className="w-full px-5 py-1 justify-between  items-center"
                  >
                    <Holds className="flex w-fit items-center ">
                      <Texts text={"link"} size={"p7"}>
                        Create New Crew
                      </Texts>
                    </Holds>
                    <Holds className="flex w-fit items-center ">
                      <Texts text={"link"} size={"p7"}>
                        Delete Crew
                      </Texts>
                    </Holds>
                    <Holds className="flex w-fit items-center ">
                      <Texts
                        text={"link"}
                        size={"p7"}
                        onClick={() => setView({ mode: "default" })}
                      >
                        Discard All Changes
                      </Texts>
                    </Holds>
                    <Holds className="flex w-fit items-center ">
                      <Texts text={"link"} size={"p7"}>
                        Save Changes
                      </Texts>
                    </Holds>
                  </Holds>
                  <Holds
                    background={"white"}
                    className="w-full h-full overflow-y-auto no-scrollbar p-3"
                  >
                    Crew Data
                  </Holds>
                </Grids>
              </Holds>
              <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
                <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
                  <Holds
                    background={"white"}
                    position={"row"}
                    className="w-full px-5 py-1 justify-between items-center"
                  >
                    <Holds className="flex w-fit items-center ">
                      <Texts text={"link"} size={"p7"}>
                        Register New Employee
                      </Texts>
                    </Holds>
                    <Holds
                      position={"row"}
                      className="flex w-fit space-x-10 items-center "
                    >
                      <Holds className="flex w-fit items-center ">
                        <Texts
                          text={"link"}
                          size={"p7"}
                          onClick={() =>
                            setView({ mode: "crew", crewId: view.crewId })
                          }
                        >
                          Discard All Changes
                        </Texts>
                      </Holds>
                      <Holds className="flex w-fit items-center ">
                        <Texts text={"link"} size={"p7"}>
                          Save Changes
                        </Texts>
                      </Holds>
                    </Holds>
                  </Holds>
                  <Holds
                    background={"white"}
                    className="w-full h-full overflow-y-auto no-scrollbar p-3"
                  >
                    User Data
                  </Holds>
                </Grids>
              </Holds>
            </>
          )}
          {view.mode === "default" && (
            <Holds className="col-span-8 w-full h-full overflow-y-auto no-scrollbar">
              <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
                <Holds
                  background={"white"}
                  position={"row"}
                  className="w-full px-5 py-1 space-x-10 items-center"
                >
                  <Holds
                    className="flex w-fit items-center"
                    onClick={() => setView({ mode: "registerCrew" })}
                  >
                    <Texts text={"link"} size={"p7"}>
                      Create New Crew
                    </Texts>
                  </Holds>
                  <Holds
                    className="flex w-fit items-center "
                    onClick={() => setView({ mode: "registerUser" })}
                  >
                    <Texts text={"link"} size={"p7"}>
                      Register New Employee
                    </Texts>
                  </Holds>
                </Holds>
              </Grids>
            </Holds>
          )}
        </Grids>
      </Holds>
    </Holds>
  );
}
