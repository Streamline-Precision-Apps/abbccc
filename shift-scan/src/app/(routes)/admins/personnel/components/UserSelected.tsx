"use client";
import { useEffect } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import Spinner from "@/components/(animations)/spinner";
import { SearchCrew } from "@/lib/types";
import EditedCrew from "./UserSelected/editedCrew";
import UserInformation from "./UserSelected/userInformatiom";
import ProfileAndRoles from "./UserSelected/ProfileAndRoles";
import { Buttons } from "@/components/(reusable)/buttons";
import { deletePersonnel, editPersonnelInfo } from "@/actions/PersonnelActions";
import { UserData } from "./types/personnel";

const fields = [
  { label: "Username", name: "username", type: "text" },
  { label: "First Name", name: "firstName", type: "text" },
  { label: "Last Name", name: "lastName", type: "text" },
  { label: "Phone Number", name: "phoneNumber", type: "tel" },
  { label: "Email", name: "email", type: "email" },
  { label: "Emergency Contact", name: "emergencyContact", type: "text" },
  {
    label: "Emergency Contact Number",
    name: "emergencyContactNumber",
    type: "tel",
  },
  { label: "Date of Birth", name: "DOB", type: "date" },
  { label: "Permission Level", name: "permission", type: "text" },
  { label: "Employment Status", name: "activeEmployee", type: "text" },
];

const fetchUserData = async (userid: string) => {
  const res = await fetch(`/api/employeeInfo/${userid}`);
  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
};

const UserSelected = ({
  setView,
  userid,
  setRegistration,
  crew,
  editState,
  updateEditState,
  retainOnlyUserEditState,
  discardUserEditChanges,
}: {
  setView: () => void;
  setRegistration: () => void;
  userid: string;
  crew: SearchCrew[];
  editState: {
    user: UserData | null;
    originalUser: UserData | null;
    selectedCrews: string[];
    originalCrews: string[];
    crewLeads: Record<string, boolean>;
    originalCrewLeads: Record<string, boolean>;
    edited: { [key: string]: boolean };
    loading: boolean;
    successfullyUpdated: boolean;
  };
  updateEditState: (updates: Partial<typeof editState>) => void;
  retainOnlyUserEditState: (userId: string) => void;
  discardUserEditChanges: (userId: string) => void;
}) => {
  const {
    user,
    originalUser,
    selectedCrews,
    originalCrews,
    crewLeads,
    originalCrewLeads,
    edited,
    loading,
    successfullyUpdated,
  } = editState;

  useEffect(() => {
    let isMounted = true;

    const loadUserData = async () => {
      if (!editState.user) {
        updateEditState({ loading: true });
        try {
          const userData = await fetchUserData(userid);

          if (!isMounted) return;

          const crewIds = userData.Crews.map((c: { id: string }) => c.id);

          const crewLeadsMap = userData.Crews.reduce(
            (
              acc: Record<string, boolean>,
              crew: { id: string; name: string; leadId: string }
            ) => {
              console.log(crew);

              acc[crew.id] = crew.leadId === userData.id;
              return acc;
            },
            {}
          );
          console.log(crewLeadsMap);

          updateEditState({
            user: userData,
            originalUser: userData,
            selectedCrews: crewIds,
            originalCrews: crewIds,
            crewLeads: crewLeadsMap,
            originalCrewLeads: { ...crewLeadsMap },
            edited: {},
            loading: false,
          });
        } catch (e) {
          console.error(e);
          if (isMounted) {
            updateEditState({ loading: false });
          }
        }
      }
    };

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [userid]);

  // Handle input changes and track edits
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!user) return;
    const { name, value } = e.target;

    // Handle Contact fields
    if (
      name === "phoneNumber" ||
      name === "emergencyContact" ||
      name === "emergencyContactNumber"
    ) {
      updateEditState({
        user: {
          ...user,
          Contact: {
            ...user.Contact,
            [name]: value,
          },
        },
        edited: {
          ...edited,
          [name]: value !== (originalUser?.Contact as any)?.[name],
        },
      });
      return;
    }

    // All other fields (top-level)
    updateEditState({
      user: { ...user, [name]: value },
      edited: {
        ...edited,
        [name]: value !== (originalUser as any)?.[name],
      },
    });
  };

  // Crew checkbox handler
  const handleCrewCheckbox = (id: string) => {
    const newCrews = selectedCrews.includes(id)
      ? selectedCrews.filter((c) => c !== id)
      : [...selectedCrews, id];

    // If removing from crews, also remove as crew lead
    const newCrewLeads = { ...crewLeads };
    if (!newCrews.includes(id)) {
      delete newCrewLeads[id];
    }

    updateEditState({
      selectedCrews: newCrews,
      crewLeads: newCrewLeads,
      edited: {
        ...edited,
        crews:
          JSON.stringify(newCrews.sort()) !==
          JSON.stringify(originalCrews.sort()),
        crewLeads:
          JSON.stringify(newCrewLeads) !== JSON.stringify(originalCrewLeads),
      },
    });
  };

  // Crew lead toggle handler
  const handleCrewLeadToggle = (crewId: string) => {
    if (!user) return;

    const newCrewLeads = {
      ...crewLeads,
      [crewId]: !crewLeads[crewId],
    };

    updateEditState({
      crewLeads: newCrewLeads,
      edited: {
        ...edited,
        crewLeads:
          JSON.stringify(newCrewLeads) !== JSON.stringify(originalCrewLeads),
      },
    });
  };

  // Save changes using server action (async)
  const handleSave = async () => {
    if (!user) return;
    updateEditState({ loading: true });

    const formData = new FormData();
    formData.set("id", user.id);
    formData.set("firstName", user.firstName);
    formData.set("lastName", user.lastName);
    formData.set("email", user.email);
    formData.set("DOB", user.DOB);
    formData.set("permission", user.permission);
    formData.set("truckView", String(user.truckView));
    formData.set("tascoView", String(user.tascoView));
    formData.set("laborView", String(user.laborView));
    formData.set("mechanicView", String(user.mechanicView));
    formData.set("phoneNumber", user.Contact?.phoneNumber || "");
    formData.set("emergencyContact", user.Contact?.emergencyContact || "");
    formData.set(
      "emergencyContactNumber",
      user.Contact?.emergencyContactNumber || ""
    );
    formData.set("activeEmployee", String(user.activeEmployee));
    formData.set("crewLeads", JSON.stringify(crewLeads));
    formData.set("selectedCrews", JSON.stringify(selectedCrews));

    try {
      const result = await editPersonnelInfo(formData);
      if (result === true) {
        updateEditState({
          loading: false,
          originalUser: user ? { ...user } : null,
          originalCrews: [...selectedCrews],
          originalCrewLeads: { ...crewLeads },
          edited: {},
          successfullyUpdated: true,
        });
        retainOnlyUserEditState(user.id);
        setTimeout(() => {
          updateEditState({ successfullyUpdated: false });
        }, 3000);
      } else {
        updateEditState({ loading: false });
        throw new Error("Failed to save changes");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to save changes");
    }
  };

  const handleDelete = async (userid: string) => {
    if (!user) return;
    const result = await deletePersonnel(user.id);
    if (result === true) {
      setView();
    } else {
      alert("Failed to delete user");
    }
  };

  return (
    <>
      <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar ">
        <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
          <Holds
            background={"white"}
            position={"row"}
            className="w-full px-5 py-1 justify-between items-center relative"
          >
            {successfullyUpdated && (
              <Holds
                background={"green"}
                className="h-full absolute top-0 right-0 z-50 justify-center items-center rounded-[10px] px-3 py-1"
              >
                <Texts size={"p7"}>Successfully Updated!</Texts>
              </Holds>
            )}
            <Holds className="flex w-fit items-center ">
              <Texts
                text={"link"}
                size={"p7"}
                onClick={
                  edited && Object.values(edited).some(Boolean)
                    ? undefined
                    : () => setRegistration()
                }
                style={{
                  pointerEvents:
                    edited && Object.values(edited).some(Boolean)
                      ? "none"
                      : "auto",
                  opacity:
                    edited && Object.values(edited).some(Boolean) ? 0.5 : 1,
                  cursor:
                    edited && Object.values(edited).some(Boolean)
                      ? "not-allowed"
                      : "pointer",
                }}
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
                  onClick={
                    edited && Object.values(edited).some(Boolean)
                      ? () => discardUserEditChanges(userid)
                      : undefined
                  }
                  style={{
                    pointerEvents:
                      edited && Object.values(edited).some(Boolean)
                        ? "auto"
                        : "none",
                    opacity:
                      edited && Object.values(edited).some(Boolean) ? 1 : 0.5,
                    cursor:
                      edited && Object.values(edited).some(Boolean)
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  Discard All Changes
                </Texts>
              </Holds>
              <Holds className="flex w-fit items-center ">
                <Texts
                  text={"link"}
                  size={"p7"}
                  onClick={
                    !loading && edited && Object.values(edited).some(Boolean)
                      ? handleSave
                      : undefined
                  }
                  style={{
                    pointerEvents:
                      !loading && edited && Object.values(edited).some(Boolean)
                        ? "auto"
                        : "none",
                    opacity:
                      !loading && edited && Object.values(edited).some(Boolean)
                        ? 1
                        : 0.5,
                    cursor:
                      !loading && edited && Object.values(edited).some(Boolean)
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  {!loading ? "Save Changes" : "saving..."}
                </Texts>
              </Holds>
            </Holds>
          </Holds>
          <>
            {loading || !user ? (
              <Holds
                background={"white"}
                className="w-full h-full overflow-y-auto no-scrollbar p-1 py-2 animate-pulse"
              >
                <Holds className="w-full h-full justify-center items-center">
                  <Texts size="p6">Loading...</Texts>
                  <Spinner />
                </Holds>
              </Holds>
            ) : (
              <Holds
                background={"white"}
                className="w-full h-full overflow-y-auto no-scrollbar p-1"
              >
                <Grids className="w-full h-full grid-rows-[50px_1fr] p-3 gap-5">
                  <Holds
                    position={"row"}
                    className="size-full row-start-1 row-end-2"
                  >
                    <Buttons
                      background={"red"}
                      shadow={"none"}
                      onClick={() => handleDelete(user.id)}
                      className="w-fit px-3 h-full mr-4"
                    >
                      Delete
                    </Buttons>
                    <ProfileAndRoles
                      user={user}
                      originalUser={originalUser}
                      edited={edited}
                      updateEditState={updateEditState}
                    />
                  </Holds>
                  <Holds
                    position={"row"}
                    className="size-full row-start-2 row-end-3 gap-3 "
                  >
                    <UserInformation
                      fields={fields}
                      user={user}
                      edited={edited}
                      handleInputChange={handleInputChange}
                      updateEditState={updateEditState}
                      originalUser={originalUser}
                    />
                    <EditedCrew
                      user={user}
                      edited={edited}
                      crew={crew}
                      selectedCrews={selectedCrews}
                      crewLeads={crewLeads}
                      handleCrewCheckbox={handleCrewCheckbox}
                      handleCrewLeadToggle={handleCrewLeadToggle}
                      permission={user.permission}
                    />
                  </Holds>
                </Grids>
              </Holds>
            )}
          </>
        </Grids>
      </Holds>
    </>
  );
};

export default UserSelected;
