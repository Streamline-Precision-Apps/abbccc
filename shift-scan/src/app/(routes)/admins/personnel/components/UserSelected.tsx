"use client";
import { useEffect } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import Spinner from "@/components/(animations)/spinner";
import { SearchCrew } from "@/lib/types";
import { editPersonnelInfo } from "@/actions/adminActions";
import EditedCrew from "./UserSelected/editedCrew";
import UserInformation from "./UserSelected/userInformatiom";
import ProfileAndRoles from "./UserSelected/ProfileAndRoles";
import { Buttons } from "@/components/(reusable)/buttons";
import { NModals } from "@/components/(reusable)/newmodals";
import { deletePersonnel } from "@/actions/PersonnelActions";
import { UserData, UserEditState } from "./types/personnel";

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
    edited: { [key: string]: boolean };
    loading: boolean;
    successfullyUpdated: boolean;
  };
  updateEditState: (updates: Partial<typeof editState>) => void;
}) => {
  const {
    user,
    originalUser,
    selectedCrews,
    originalCrews,
    edited,
    loading,
    successfullyUpdated,
  } = editState;

  useEffect(() => {
    if (!editState.user) {
      updateEditState({ loading: true });
      Promise.all([fetchUserData(userid)])
        .then(([userData]) => {
          const crewIds = userData.Crews.map((c: { id: string }) => c.id);
          updateEditState({
            user: userData,
            originalUser: userData,
            selectedCrews: crewIds,
            originalCrews: crewIds,
            edited: {},
            loading: false,
          });
        })
        .catch((e) => console.error(e));
    }
  }, [userid, editState.user, updateEditState]);

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

    updateEditState({
      selectedCrews: newCrews,
      edited: {
        ...edited,
        crews:
          JSON.stringify(newCrews.sort()) !==
          JSON.stringify(originalCrews.sort()),
      },
    });
  };

  // Discard changes
  const handleDiscard = () => {
    updateEditState({
      user: originalUser ? { ...originalUser } : null,
      selectedCrews: [...originalCrews],
      edited: {},
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

    try {
      const result = await editPersonnelInfo(formData);
      if (result === true) {
        updateEditState({
          loading: false,
          originalUser: user ? { ...user } : null,
          originalCrews: [...selectedCrews],
          edited: {},
          successfullyUpdated: true,
        });
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
                      ? handleDiscard
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
                      onClick={() => handleDelete(user.id)}
                      className="w-full h-full"
                    >
                      Delete User
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
                      handleCrewCheckbox={handleCrewCheckbox}
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
