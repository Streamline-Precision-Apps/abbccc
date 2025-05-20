"use client";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { SearchCrew } from "@/lib/types";
import { useState, useTransition } from "react";

type newUserFormType = {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  emergencyContact: string;
  emergencyContactNumber: string;
  dateOfBirth: string;
  permissionLevel: string;
  employmentStatus: string;
  password?: string;
};

import { submitNewEmployee } from "@/actions/adminActions"; // Adjust path as needed
import CrewSelectList from "./RegisterNewUser/CrewSelectList";

export default function RegisterNewUser({
  crew,
  cancelRegistration,
}: {
  crew: SearchCrew[];
  cancelRegistration: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [newUserForm, setNewUserForm] = useState<
    newUserFormType & {
      truckingView: boolean;
      tascoView: boolean;
      engineerView: boolean;
      generalView: boolean;
    }
  >({
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
  });
  const [selectedCrews, setSelectedCrews] = useState<string[]>([]);

  const handleCrewCheckbox = (id: string) => {
    setSelectedCrews((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      startTransition(async () => {
        const result = await submitNewEmployee({
          ...newUserForm,
          password: newUserForm.password || "",
          crews: selectedCrews,
          truckingView: newUserForm.truckingView,
          tascoView: newUserForm.tascoView,
          engineerView: newUserForm.engineerView,
          generalView: newUserForm.generalView,
        });

        if (result?.success) {
          // Reset form state
          setNewUserForm({
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
          });
          setSelectedCrews([]);

          // Optionally show success message or redirect
          console.log("Employee created successfully!");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  // Define the fields to render
  const fields = [
    { label: "Username", name: "username", type: "text" },
    { label: "Temporary Password", name: "password", type: "password" },
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
    { label: "Date of Birth", name: "dateOfBirth", type: "date" },
    { label: "Permission Level", name: "permissionLevel", type: "text" },
    { label: "Employment Status", name: "employmentStatus", type: "text" },
  ];

  return (
    <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
      <form
        onSubmit={handleSubmit}
        className="w-full h-full"
        autoComplete="off"
      >
        <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
          <Holds
            background={"white"}
            position={"row"}
            className="w-full px-5 py-1 justify-between items-center"
          >
            <button
              type="submit"
              className="disabled:opacity-50"
              disabled={isPending}
            >
              <Texts text={"link"} size={"p7"}>
                {isPending ? "Submitting..." : "Submit New Employee"}
              </Texts>
            </button>

            <Texts
              text={"link"}
              size={"p7"}
              onClick={() => cancelRegistration()}
            >
              Cancel Registration
            </Texts>
          </Holds>
          <Holds
            background={"white"}
            className="w-full h-full justify-center items-center overflow-y-auto no-scrollbar "
          >
            <Grids className="w-full h-full grid-rows-[50px_1fr] p-3">
              <Holds
                position={"row"}
                className="size-full row-start-1 row-end-2"
              >
                <Holds position={"row"} className="w-full gap-3">
                  <img
                    src="/profileFilled.svg"
                    alt="crew"
                    className="max-w-11 h-auto object-contain"
                  />
                  <Titles size="h4">New Employee</Titles>
                </Holds>
                <Holds position={"row"} className="w-full gap-x-3 justify-end">
                  <Buttons
                    shadow={"none"}
                    type="button"
                    aria-pressed={newUserForm.truckingView}
                    className={`w-14 h-12 rounded-[10px] border-none p-1.5 transition-colors ${
                      newUserForm.truckingView
                        ? "bg-app-blue"
                        : "bg-gray-400 gray opacity-80"
                    }`}
                    onClick={() =>
                      setNewUserForm((f) => ({
                        ...f,
                        truckingView: !f.truckingView,
                      }))
                    }
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
                    aria-pressed={newUserForm.tascoView}
                    className={`w-14 h-12 rounded-[10px] border-none p-1.5 transition-colors ${
                      newUserForm.tascoView
                        ? "bg-app-blue"
                        : "bg-gray-400 gray opacity-80"
                    }`}
                    onClick={() =>
                      setNewUserForm((f) => ({ ...f, tascoView: !f.tascoView }))
                    }
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
                    aria-pressed={newUserForm.engineerView}
                    className={`w-14 h-12 rounded-[10px] border-none p-1.5 transition-colors ${
                      newUserForm.engineerView
                        ? "bg-app-blue"
                        : "bg-gray-400 gray opacity-80"
                    }`}
                    onClick={() =>
                      setNewUserForm((f) => ({
                        ...f,
                        engineerView: !f.engineerView,
                      }))
                    }
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
                    aria-pressed={newUserForm.generalView}
                    className={`w-14 h-12 rounded-[10px] border-none p-1.5 transition-colors ${
                      newUserForm.generalView
                        ? "bg-app-blue"
                        : "bg-gray-400 gray opacity-80"
                    }`}
                    onClick={() =>
                      setNewUserForm((f) => ({
                        ...f,
                        generalView: !f.generalView,
                      }))
                    }
                  >
                    <img
                      src="/equipment.svg"
                      alt="General Icon"
                      className="w-full h-full mx-auto object-contain"
                    />
                  </Buttons>
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
                      {field.name === "permissionLevel" ? (
                        <Selects
                          name="permissionLevel"
                          value={newUserForm.permissionLevel}
                          onChange={handleChange}
                          className="w-full px-2 h-8 text-sm text-center "
                        >
                          <option value="">Select Permission Level</option>
                          <option value="USER">User</option>
                          <option value="MANAGER">Manager</option>
                          <option value="ADMIN">Admin</option>
                          <option value="SUPERADMIN">SuperAdmin</option>
                        </Selects>
                      ) : field.name === "employmentStatus" ? (
                        <Selects
                          name="employmentStatus"
                          value={newUserForm.employmentStatus}
                          onChange={handleChange}
                          className="w-full px-2 h-8 text-sm text-center "
                        >
                          <option value="">Select Employment Status</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </Selects>
                      ) : (
                        <Inputs
                          className="w-full px-2 h-8"
                          type={field.type}
                          name={field.name}
                          value={
                            newUserForm[field.name as keyof newUserFormType]
                          }
                          onChange={handleChange}
                        />
                      )}
                    </Holds>
                  ))}
                </Holds>
                <CrewSelectList
                  crew={crew}
                  selectedCrews={selectedCrews}
                  handleCrewCheckbox={handleCrewCheckbox}
                />
              </Holds>
            </Grids>
          </Holds>
        </Grids>
      </form>
    </Holds>
  );
}
