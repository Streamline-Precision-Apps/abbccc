"use client";

// UI Components
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Images } from "@/components/(reusable)/images";
import Spinner from "@/components/(animations)/spinner";

// Page Components
import RegisterNewCrew from "./components/RegisterNewCrew";
import RegisterNewUser from "./components/RegisterNewUser";
import CreateNewUserTab from "./components/CreateNewUserTab";
import CreateNewCrewTab from "./components/CreateNewCrew";
import ViewCrew from "./components/ViewCrew";
import UserSelected from "./components/UserSelected";
import DefaultTab from "./components/defaultTab";

// Types
import { SearchCrew } from "@/lib/types";
import { createCrew, submitNewEmployee } from "@/actions/adminActions";

// Actions

interface UserData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  DOB: string;
  truckView: boolean;
  tascoView: boolean;
  laborView: boolean;
  mechanicView: boolean;
  permission: string;
  activeEmployee: boolean;
  startDate?: string;
  terminationDate?: string;
  Contact: {
    phoneNumber: string;
    emergencyContact: string;
    emergencyContactNumber: string;
  };
  Crews: {
    id: string;
    name: string;
  }[];
  image?: string;
}

// BaseUser contains common properties
interface BaseUser {
  id: string;
  firstName: string;
  lastName: string;
  permission?: string;
  supervisor?: boolean;
  image?: string;
}

// SearchUser extends BaseUser for search-specific functionality
interface SearchUser extends BaseUser {
  // Additional search-specific properties can go here
}

// User extends BaseUser for full user functionality
interface User extends BaseUser {
  permission: string;
  supervisor: boolean;
  image: string;
}

// Helper function to ensure user type compatibility
const toUser = (user: BaseUser): User => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    permission: user.permission || "USER",
    supervisor: user.supervisor || false,
    image: user.image || "/person.svg",
  };
};

export default function Personnel() {
  const t = useTranslations("Admins");
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<SearchUser[]>([]);
  const [crew, setCrew] = useState<SearchCrew[]>([]);
  const [term, setTerm] = useState<string>("");

  // User edit state management
  interface UserEditState {
    user: UserData | null;
    originalUser: UserData | null;
    selectedCrews: string[];
    originalCrews: string[];
    edited: { [key: string]: boolean };
    loading: boolean;
    successfullyUpdated: boolean;
  }

  const [userEditStates, setUserEditStates] = useState<{
    [userId: string]: UserEditState;
  }>({});

  // Registration state management
  interface RegistrationState {
    form: {
      username: string;
      password: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      email: string;
      emergencyContact: string;
      emergencyContactNumber: string;
      dateOfBirth: string;
      permissionLevel: string;
      employmentStatus: string;
      truckingView: boolean;
      tascoView: boolean;
      engineerView: boolean;
      generalView: boolean;
    };
    selectedCrews: string[];
    isPending: boolean;
  }

  const [registrationState, setRegistrationState] = useState<RegistrationState>(
    {
      form: {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        emergencyContact: "",
        emergencyContactNumber: "",
        dateOfBirth: "",
        permissionLevel: "USER",
        employmentStatus: "Active",
        truckingView: false,
        tascoView: false,
        engineerView: false,
        generalView: false,
      },
      selectedCrews: [],
      isPending: false,
    }
  );

  const updateRegistrationForm = (
    updates: Partial<RegistrationState["form"]>
  ) => {
    setRegistrationState((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        ...updates,
      },
    }));
  };

  const updateRegistrationCrews = (crewIds: string[]) => {
    setRegistrationState((prev) => ({
      ...prev,
      selectedCrews: crewIds,
    }));
  };

  const setRegistrationPending = (isPending: boolean) => {
    setRegistrationState((prev) => ({
      ...prev,
      isPending,
    }));
  };

  const resetRegistrationState = () => {
    setRegistrationState({
      form: {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        emergencyContact: "",
        emergencyContactNumber: "",
        dateOfBirth: "",
        permissionLevel: "USER",
        employmentStatus: "Active",
        truckingView: false,
        tascoView: false,
        engineerView: false,
        generalView: false,
      },
      selectedCrews: [],
      isPending: false,
    });
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setRegistrationPending(true);
      const result = await submitNewEmployee({
        ...registrationState.form,
        crews: registrationState.selectedCrews,
      });

      if (result?.success) {
        resetRegistrationState();
        await fetchAllData(); // Refresh employee list
        setView({ mode: "default" }); // Return to default view
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRegistrationPending(false);
    }
  };

  // Crew creation state
  const [crewCreationState, setCrewCreationState] = useState({
    form: {
      crewName: "",
      crewDescription: "",
    },
    selectedUsers: [] as { id: string }[],
    teamLead: null as string | null,
    toggledUsers: {} as Record<string, boolean>,
    toggledManager: {} as Record<string, boolean>,
    isPending: false,
  });

  const updateCrewForm = (updates: Partial<typeof crewCreationState.form>) => {
    setCrewCreationState((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        ...updates,
      },
    }));
  };

  const toggleCrewUser = (id: string) => {
    setCrewCreationState((prev) => {
      const isToggled = !prev.toggledUsers[id];

      // Only store user ID in selectedUsers
      return {
        ...prev,
        selectedUsers: isToggled
          ? [...prev.selectedUsers, { id }]
          : prev.selectedUsers.filter((user) => user.id !== id),
        toggledUsers: {
          ...prev.toggledUsers,
          [id]: isToggled,
        },
      };
    });
  };

  const toggleCrewManager = (id: string) => {
    setCrewCreationState((prev) => {
      if (prev.teamLead === id) {
        return {
          ...prev,
          teamLead: null,
          toggledManager: {
            ...prev.toggledManager,
            [id]: false,
          },
        };
      }

      const updatedToggledManager = { ...prev.toggledManager };
      Object.keys(updatedToggledManager).forEach((key) => {
        updatedToggledManager[key] = key === id;
      });

      return {
        ...prev,
        teamLead: id,
        toggledManager: updatedToggledManager,
      };
    });
  };

  const handleCrewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!crewCreationState.form.crewName.trim()) {
        // Show error notification
        return;
      }

      if (!crewCreationState.teamLead) {
        // Show error notification
        return;
      }

      setCrewCreationState((prev) => ({ ...prev, isPending: true }));

      const formData = new FormData();
      formData.append("crewName", crewCreationState.form.crewName.trim());
      formData.append(
        "crewDescription",
        crewCreationState.form.crewDescription.trim()
      );
      formData.append("crew", JSON.stringify(crewCreationState.selectedUsers));
      formData.append("teamLead", crewCreationState.teamLead);

      await createCrew(formData);
      await fetchAllData(); // Refresh data

      setCrewCreationState({
        form: {
          crewName: "",
          crewDescription: "",
        },
        selectedUsers: [],
        teamLead: null,
        toggledUsers: {},
        toggledManager: {},
        isPending: false,
      });

      setView({ mode: "default" });
      // Show success notification
    } catch (error) {
      console.error("Failed to create crew:", error);
      // Show error notification
      setCrewCreationState((prev) => ({ ...prev, isPending: false }));
    }
  };

  // Helper function to initialize edit state for a user
  const initializeUserEditState = (userData: UserData) => {
    const crewIds = userData.Crews.map((c) => c.id);
    return {
      user: userData,
      originalUser: userData,
      selectedCrews: crewIds,
      originalCrews: crewIds,
      edited: {},
      loading: false,
      successfullyUpdated: false,
    };
  };

  // Helper function to update user edit state
  const updateUserEditState = (
    userId: string,
    updates: Partial<UserEditState>
  ) => {
    setUserEditStates((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        ...updates,
      },
    }));
  };

  // Unified view state
  type PersonnelView =
    | { mode: "default" }
    | { mode: "user"; userId: string }
    | { mode: "crew"; crewId: string }
    | { mode: "user+crew"; userId: string; crewId: string }
    | { mode: "registerUser+crew"; crewId: string }
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
              <UserSelected
                crew={crew}
                setView={() => setView({ mode: "default" })}
                setRegistration={() => setView({ mode: "registerUser" })}
                userid={view.userId}
                editState={
                  userEditStates[view.userId] || {
                    user: null,
                    originalUser: null,
                    selectedCrews: [],
                    originalCrews: [],
                    edited: {},
                    loading: false,
                    successfullyUpdated: false,
                  }
                }
                updateEditState={(updates) =>
                  updateUserEditState(view.userId, updates)
                }
              />
              <CreateNewCrewTab
                setView={() =>
                  setView(
                    view.mode === "user" && "userId" in view
                      ? {
                          mode: "registerCrew+user",
                          userId: view.userId,
                        }
                      : view
                  )
                }
              />
            </>
          )}
          {view.mode === "registerUser+crew" && (
            <>
              <ViewCrew
                setView={() => {
                  setView({ mode: "registerUser" });
                }}
              />
              <RegisterNewUser
                crew={crew}
                cancelRegistration={() =>
                  setView({ mode: "crew", crewId: view.crewId })
                }
                registrationState={registrationState}
                updateRegistrationForm={updateRegistrationForm}
                updateRegistrationCrews={updateRegistrationCrews}
                handleSubmit={handleRegistrationSubmit}
              />
            </>
          )}
          {view.mode === "registerCrew+user" && (
            <>
              <RegisterNewCrew
                cancelCrewCreation={() =>
                  setView({ mode: "user", userId: view.userId })
                }
              />
              <UserSelected
                crew={crew}
                setView={() => setView({ mode: "registerCrew" })}
                setRegistration={() => setView({ mode: "registerBoth" })}
                userid={view.userId}
                editState={
                  userEditStates[view.userId] || {
                    user: null,
                    originalUser: null,
                    selectedCrews: [],
                    originalCrews: [],
                    edited: {},
                    loading: false,
                    successfullyUpdated: false,
                  }
                }
                updateEditState={(updates) =>
                  updateUserEditState(view.userId, updates)
                }
              />
            </>
          )}
          {view.mode === "registerBoth" && (
            <>
              <RegisterNewCrew
                cancelCrewCreation={() => setView({ mode: "registerUser" })}
              />
              <RegisterNewUser
                crew={crew}
                cancelRegistration={() => setView({ mode: "registerCrew" })}
                registrationState={registrationState}
                updateRegistrationForm={updateRegistrationForm}
                updateRegistrationCrews={updateRegistrationCrews}
                handleSubmit={handleRegistrationSubmit}
              />
            </>
          )}
          {view.mode === "crew" && (
            <>
              <ViewCrew setView={() => setView({ mode: "default" })} />
              <CreateNewUserTab
                setView={() => () =>
                  setView({
                    mode: "registerUser+crew",
                    crewId: view.crewId,
                  })}
              />
            </>
          )}
          {view.mode === "user+crew" && (
            <>
              <ViewCrew
                setView={() => setView({ mode: "user", userId: view.userId })}
              />
              <UserSelected
                crew={crew}
                setView={() => setView({ mode: "crew", crewId: view.crewId })}
                setRegistration={() =>
                  setView({ mode: "registerUser+crew", crewId: view.crewId })
                }
                userid={view.userId}
                editState={
                  userEditStates[view.userId] || {
                    user: null,
                    originalUser: null,
                    selectedCrews: [],
                    originalCrews: [],
                    edited: {},
                    loading: false,
                    successfullyUpdated: false,
                  }
                }
                updateEditState={(updates) =>
                  updateUserEditState(view.userId, updates)
                }
              />
            </>
          )}
          {view.mode === "default" && (
            <DefaultTab
              createNewCrew={() => setView({ mode: "registerCrew" })}
              RegisterEmployee={() => setView({ mode: "registerUser" })}
            />
          )}
          {view.mode === "registerUser" && (
            <>
              <RegisterNewUser
                crew={crew}
                cancelRegistration={() => setView({ mode: "default" })}
                registrationState={registrationState}
                updateRegistrationForm={updateRegistrationForm}
                updateRegistrationCrews={updateRegistrationCrews}
                handleSubmit={handleRegistrationSubmit}
              />
              <CreateNewCrewTab
                setView={() => setView({ mode: "registerBoth" })}
              />
            </>
          )}

          {/* registerBoth mode is not used in this UI, so this block is removed for clarity */}
          {view.mode === "registerCrew" && (
            <>
              <RegisterNewCrew
                cancelCrewCreation={() => setView({ mode: "default" })}
              />
              <CreateNewUserTab
                setView={() => setView({ mode: "registerBoth" })}
              />
            </>
          )}
        </Grids>
      </Holds>
    </Holds>
  );
}
