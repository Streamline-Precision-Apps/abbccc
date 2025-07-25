"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import Spinner from "@/components/(animations)/spinner";
import EditedCrew from "./UserSelected/editedCrew";
import UserInformation from "./UserSelected/userInformatiom";
import ProfileAndRoles from "./UserSelected/ProfileAndRoles";
import { useUserData } from "../hooks/useUserData";
import { CrewData, PersonnelView, UserData } from "./types/personnel";
import { Dispatch, SetStateAction, useState } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { NModals } from "@/components/(reusable)/newmodals";
import { Titles } from "@/components/(reusable)/titles";

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

const UserSelected = ({
  setView,
  userid,
  setRegistration,
  crew,
  editState,
  updateEditState,
  retainOnlyUserEditState,
  discardUserEditChanges,
  fetchAllData,
  setViewOption,
  viewOption,
  isUserEditStateDirty,
}: {
  setView: () => void;
  setRegistration: () => void;
  userid: string;
  crew: CrewData[];
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
  fetchAllData: () => void;
  setViewOption: Dispatch<SetStateAction<PersonnelView>>;
  viewOption: PersonnelView;
  isUserEditStateDirty: (userId: string) => boolean;
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
    handleInputChange,
    handleCrewCheckbox,
    handleCrewLeadToggle,
    handleSave,
    handleDelete,
  } = useUserData({ userid, editState, updateEditState });
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const userStartDate = new Date(originalUser?.startDate ?? "");

  return (
    <>
      <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar ">
        <Grids className="w-full h-full grid-rows-[50px_1fr] gap-4">
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
            {originalUser?.startDate && userStartDate > twentyFourHoursAgo && (
              <Holds className="flex w-fit items-center ">
                <Texts
                  text={"link"}
                  size={"p7"}
                  onClick={
                    edited && Object.values(edited).some(Boolean)
                      ? undefined
                      : () => {
                          setDeleteUserModalOpen(true);
                        }
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
                  Delete Employee
                </Texts>
              </Holds>
            )}
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
                    className="w-full h-full row-start-1 row-end-2"
                  >
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
                      setViewOption={setViewOption}
                      viewOption={viewOption}
                    />
                  </Holds>
                </Grids>
              </Holds>
            )}
          </>
        </Grids>
      </Holds>
      <NModals
        isOpen={deleteUserModalOpen}
        handleClose={() => setDeleteUserModalOpen(false)}
        size="sm"
        background={"noOpacity"}
      >
        <Holds className="w-full h-full items-center justify-center text-center px-4">
          <Holds className="w-[90%] flex h-1/2">
            <Texts size="p5">Are you sure you want to delete this user?</Texts>
          </Holds>
          <Holds className="w-[80%] flex justify-center items-center gap-4 h-1/2">
            <Buttons
              shadow="none"
              background="lightBlue"
              className="w-full p-1"
              onClick={() => {
                handleDelete(userid);
                fetchAllData();
                setView();
                setDeleteUserModalOpen(false);
              }}
            >
              <Titles size="sm">Yes, continue.</Titles>
            </Buttons>
            <Buttons
              background="red"
              shadow="none"
              className="w-full p-1"
              onClick={() => setDeleteUserModalOpen(false)}
            >
              <Titles size="sm">No, go back!</Titles>
            </Buttons>
          </Holds>
        </Holds>
      </NModals>
    </>
  );
};

export default UserSelected;
