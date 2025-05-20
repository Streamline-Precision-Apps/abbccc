"use client";
import { useEffect, useState } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Buttons } from "@/components/(reusable)/buttons";
import Spinner from "@/components/(animations)/spinner";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { SearchCrew } from "@/lib/types";
import { editPersonnelInfo } from "@/actions/adminActions";

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
}: {
  setView: () => void;
  setRegistration: () => void;
  userid: string;
  crew: SearchCrew[];
}) => {
  const [successfullyUpdated, setSuccessfullyUpdated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [originalUser, setOriginalUser] = useState<UserData | null>(null);
  const [selectedCrews, setSelectedCrews] = useState<string[]>([]);
  const [originalCrews, setOriginalCrews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [edited, setEdited] = useState<{ [key: string]: boolean }>({});
  // Show all crews toggle state
  const [showAllCrews, setShowAllCrews] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchUserData(userid)])
      .then(([userData]) => {
        setUser(userData);
        setOriginalUser(userData);
        const crewIds = (userData.Crews as { id: string }[]).map(
          (c: { id: string }) => c.id
        );
        setSelectedCrews(crewIds);
        setOriginalCrews(crewIds);
        setEdited({});
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
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
      setUser((prev) =>
        prev
          ? {
              ...prev,
              Contact: {
                ...prev.Contact,
                [name]: value,
              },
            }
          : prev
      );
      if (originalUser) {
        setEdited((prev) => ({
          ...prev,
          [name]: value !== (originalUser.Contact as any)[name],
        }));
      }
      return;
    }

    // Handle crews (not via input, but for completeness)
    if (name === "crews" || name === "selectedCrews") {
      // This is handled by handleCrewCheckbox, so do nothing here
      return;
    }

    // All other fields (top-level)
    setUser((prev) => (prev ? { ...prev, [name]: value } : prev));
    if (originalUser) {
      setEdited((prev) => ({
        ...prev,
        [name]: value !== (originalUser as any)[name],
      }));
    }
  };

  // Crew checkbox handler
  const handleCrewCheckbox = (id: string) => {
    setSelectedCrews((prev) => {
      const newCrews = prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id];
      if (originalCrews) {
        setEdited((prev) => ({
          ...prev,
          crews:
            JSON.stringify(newCrews.sort()) !==
            JSON.stringify(originalCrews.sort()),
        }));
      }
      return newCrews;
    });
  };

  // Discard changes
  const handleDiscard = () => {
    if (originalUser) setUser({ ...originalUser });
    setSelectedCrews([...originalCrews]);
    setEdited({});
  };

  // Save changes using server action (async)
  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

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
        setLoading(false);
        setOriginalUser(user ? { ...user } : null);
        setOriginalCrews([...selectedCrews]);
        setSuccessfullyUpdated(true);
        setTimeout(() => {
          setSuccessfullyUpdated(false);
        }, 3000);
        setEdited({});
      } else {
        setLoading(false);
        throw new Error("Failed to save changes");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to save changes");
    }
  };

  return (
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
              className="w-full h-full overflow-y-auto no-scrollbar p-3 animate-pulse"
            >
              <Holds className="w-full h-full justify-center items-center">
                <Texts size="p6">Loading...</Texts>
                <Spinner />
              </Holds>
            </Holds>
          ) : (
            <Holds
              background={"white"}
              className="w-full h-full overflow-y-auto no-scrollbar p-3"
            >
              <Grids className="w-full h-full grid-rows-[50px_1fr] p-3 gap-5">
                <Holds
                  position={"row"}
                  className="size-full row-start-1 row-end-2"
                >
                  <Holds position={"row"} className="w-full gap-3">
                    <img
                      src="/profileFilled.svg"
                      alt="profile"
                      className="max-w-11 h-auto object-contain"
                    />
                    <Titles size="h4">{`${user.firstName} ${user.lastName}`}</Titles>
                  </Holds>
                  <Holds className="w-full flex flex-col">
                    <Holds
                      position={"row"}
                      className="w-full gap-x-3 justify-end"
                    >
                      <Buttons
                        shadow={"none"}
                        type="button"
                        aria-pressed={user.truckView}
                        className={`w-14 h-12 rounded-[10px]  p-1.5 transition-colors ${
                          user.truckView
                            ? "bg-app-blue"
                            : "bg-gray-400 gray opacity-80"
                        } ${
                          user &&
                          originalUser &&
                          user.truckView !== originalUser.truckView
                            ? "border-2 border-orange-400"
                            : "border-none"
                        }`}
                        onClick={() => {
                          setUser((prev) =>
                            prev
                              ? { ...prev, truckView: !prev.truckView }
                              : prev
                          );
                          if (originalUser && user) {
                            setEdited((prev) => ({
                              ...prev,
                              truckView:
                                !user.truckView !== originalUser.truckView,
                            }));
                          }
                        }}
                      >
                        <img
                          src="/trucking.svg"
                          alt="trucking"
                          className="w-full h-full mx-auto object-contain"
                        />
                      </Buttons>
                      <Buttons
                        shadow={"none"}
                        type="button"
                        aria-pressed={user.tascoView}
                        className={`w-14 h-12 rounded-[10px]  p-1.5 transition-colors ${
                          user.tascoView
                            ? "bg-app-blue"
                            : "bg-gray-400 gray opacity-80"
                        } ${
                          user &&
                          originalUser &&
                          user.tascoView !== originalUser.tascoView
                            ? "border-2 border-orange-400"
                            : "border-none"
                        }`}
                        onClick={() => {
                          setUser((prev) =>
                            prev
                              ? { ...prev, tascoView: !prev.tascoView }
                              : prev
                          );
                          if (originalUser && user) {
                            setEdited((prev) => ({
                              ...prev,
                              tascoView:
                                !user.tascoView !== originalUser.tascoView,
                            }));
                          }
                        }}
                      >
                        <img
                          src="/tasco.svg"
                          alt="tasco"
                          className="w-full h-full mx-auto object-contain"
                        />
                      </Buttons>
                      <Buttons
                        shadow={"none"}
                        type="button"
                        aria-pressed={user.mechanicView}
                        className={`w-14 h-12 rounded-[10px]  p-1.5 transition-colors ${
                          user.mechanicView
                            ? "bg-app-blue "
                            : "bg-gray-400 gray opacity-80"
                        } ${
                          user &&
                          originalUser &&
                          user.mechanicView !== originalUser.mechanicView
                            ? "border-2 border-orange-400"
                            : "border-none"
                        }`}
                        onClick={() => {
                          setUser((prev) =>
                            prev
                              ? { ...prev, mechanicView: !prev.mechanicView }
                              : prev
                          );
                          if (originalUser && user) {
                            setEdited((prev) => ({
                              ...prev,
                              mechanicView:
                                !user.mechanicView !==
                                originalUser.mechanicView,
                            }));
                          }
                        }}
                      >
                        <img
                          src="/mechanic.svg"
                          alt="Engineer Icon"
                          className="w-full h-full mx-auto object-contain"
                        />
                      </Buttons>
                      <Buttons
                        shadow={"none"}
                        type="button"
                        aria-pressed={user.laborView}
                        className={`w-14 h-12 rounded-[10px] p-1.5 transition-colors ${
                          user.laborView
                            ? "bg-app-blue"
                            : "bg-gray-400 gray opacity-80"
                        } ${
                          user &&
                          originalUser &&
                          user.laborView !== originalUser.laborView
                            ? "border-2 border-orange-400"
                            : "border-none"
                        }`}
                        onClick={() => {
                          setUser((prev) =>
                            prev
                              ? { ...prev, laborView: !prev.laborView }
                              : prev
                          );
                          if (originalUser && user) {
                            setEdited((prev) => ({
                              ...prev,
                              laborView:
                                !user.laborView !== originalUser.laborView,
                            }));
                          }
                        }}
                      >
                        <img
                          src="/equipment.svg"
                          alt="General Icon"
                          className="w-full h-full mx-auto object-contain"
                        />
                      </Buttons>
                    </Holds>

                    {!user.laborView &&
                      !user.truckView &&
                      !user.tascoView &&
                      !user.mechanicView && (
                        <Texts
                          position={"right"}
                          size={"p7"}
                          className="text-sm italic text-red-500"
                        >
                          Must select at least one view
                        </Texts>
                      )}
                  </Holds>
                </Holds>
                <Holds
                  position={"row"}
                  className="size-full row-start-2 row-end-3 gap-3 "
                >
                  <Holds size={"50"} className="h-full">
                    {fields.map((field) => (
                      <Holds key={field.name}>
                        <label htmlFor={field.name} className="text-sm pt-2 ">
                          {field.label}
                        </label>
                        {field.name === "permission" ? (
                          <Selects
                            name="permission"
                            value={user.permission}
                            className={`w-full px-2 h-8 text-sm text-center ${
                              edited["permission"]
                                ? "border-2 border-orange-400"
                                : ""
                            }`}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Permission Level</option>
                            <option value="USER">User</option>
                            <option value="MANAGER">Manager</option>
                            <option value="ADMIN">Admin</option>
                            <option value="SUPERADMIN">Super Admin</option>
                          </Selects>
                        ) : field.name === "activeEmployee" ? (
                          <Selects
                            name="activeEmployee"
                            value={user.activeEmployee ? "Active" : "Inactive"}
                            className={`w-full px-2 h-8 text-sm text-center ${
                              edited["activeEmployee"]
                                ? "border-2 border-orange-400"
                                : ""
                            }`}
                            onChange={(e) => {
                              const value = e.target.value;
                              setUser((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      activeEmployee: value === "Active",
                                    }
                                  : prev
                              );
                              if (originalUser) {
                                setEdited((prev) => ({
                                  ...prev,
                                  activeEmployee:
                                    (value === "Active") !==
                                    originalUser.activeEmployee,
                                }));
                              }
                            }}
                          >
                            <option value="">Select Employment Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </Selects>
                        ) : (
                          <Inputs
                            className={`w-full px-2 h-8 ${
                              edited[field.name]
                                ? "border-2 border-orange-400"
                                : ""
                            } ${field.name === "DOB" ? "text-center" : ""} `}
                            type={field.type}
                            name={field.name}
                            value={
                              field.name === "phoneNumber"
                                ? user.Contact?.phoneNumber || ""
                                : field.name === "emergencyContact"
                                ? user.Contact?.emergencyContact || ""
                                : field.name === "emergencyContactNumber"
                                ? user.Contact?.emergencyContactNumber || ""
                                : field.name === "activeEmployee"
                                ? user.activeEmployee
                                  ? "Active"
                                  : "Inactive"
                                : field.name === "permission"
                                ? user.permission
                                : field.name === "DOB"
                                ? user.DOB || ""
                                : field.name === "email"
                                ? user.email || ""
                                : field.name === "username"
                                ? user.username || ""
                                : field.name === "firstName"
                                ? user.firstName || ""
                                : field.name === "lastName"
                                ? user.lastName || ""
                                : ""
                            }
                            disabled={field.name === "username"}
                            onChange={handleInputChange}
                          />
                        )}
                      </Holds>
                    ))}
                  </Holds>
                  <Holds size={"50"} className="h-full">
                    <Texts position={"left"} size={"p7"}>
                      Crews
                    </Texts>
                    <Holds
                      className={`w-full h-full border-2 ${
                        edited.crews ? "border-orange-400" : "border-black"
                      } rounded-[10px] p-2`}
                    >
                      <div className="h-full overflow-y-auto no-scrollbar">
                        {(showAllCrews ? crew : user.Crews).map((c) => (
                          <Holds
                            position={"row"}
                            key={c.id}
                            className="p-1 justify-center items-center gap-2 group"
                          >
                            <Holds
                              background={
                                selectedCrews.includes(c.id)
                                  ? "lightBlue"
                                  : "lightGray"
                              }
                              className="w-full h-full transition-colors duration-150 cursor-pointer "
                              onClick={() => {}} // add a click handler to open the crew details
                            >
                              <Titles size={"h6"}>{c.name}</Titles>
                            </Holds>
                            <Holds className="w-fit h-full ">
                              <CheckBox
                                shadow={false}
                                id={`crew-${c.id}`}
                                name="selectedCrews"
                                checked={selectedCrews.includes(c.id)}
                                onChange={() => handleCrewCheckbox(c.id)}
                                label=""
                                size={2}
                              />
                            </Holds>
                          </Holds>
                        ))}
                        <Holds className="pt-2">
                          <Texts
                            size={"p7"}
                            className="italic underline cursor-pointer"
                            onClick={() => setShowAllCrews((prev) => !prev)}
                          >
                            {showAllCrews
                              ? "Hide Unselected Crews"
                              : "Show all Crews"}
                          </Texts>
                        </Holds>
                      </div>
                    </Holds>
                  </Holds>
                </Holds>
              </Grids>
            </Holds>
          )}
        </>
      </Grids>
    </Holds>
  );
};

export default UserSelected;
