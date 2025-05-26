"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import CrewSelectList from "./RegisterNewUser/CrewSelectList";
import { PersonnelView, RegistrationState } from "./types/personnel";
import { Dispatch, SetStateAction, useState } from "react";
import { NModals } from "@/components/(reusable)/newmodals";
import { set } from "date-fns";

// Validation utilities
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  }
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`;
};

const isValidPhoneNumber = (phone: string) => {
  const phoneNumber = phone.replace(/[^\d]/g, "");
  return phoneNumber.length === 10;
};

type ValidationErrors = {
  email?: string;
  phoneNumber?: string;
  emergencyContactNumber?: string;
};

interface RegisterNewUserProps {
  crew: Array<{
    id: string;
    name: string;
  }>;
  cancelRegistration: () => void;
  registrationState: RegistrationState;
  updateRegistrationForm: (updates: Partial<RegistrationState["form"]>) => void;
  updateRegistrationCrews: (crewIds: string[]) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setViewOption: Dispatch<SetStateAction<PersonnelView>>;
  viewOption: PersonnelView;
}

const fields = [
  { label: "Username", name: "username" as const, type: "text" },
  { label: "Password", name: "password" as const, type: "password" },
  { label: "First Name", name: "firstName" as const, type: "text" },
  { label: "Last Name", name: "lastName" as const, type: "text" },
  { label: "Phone Number", name: "phoneNumber" as const, type: "tel" },
  { label: "Email", name: "email" as const, type: "email" },
  {
    label: "Emergency Contact",
    name: "emergencyContact" as const,
    type: "text",
  },
  {
    label: "Emergency Contact Number",
    name: "emergencyContactNumber" as const,
    type: "tel",
  },
  { label: "Date of Birth", name: "dateOfBirth" as const, type: "date" },
] as const;

export default function RegisterNewUser({
  crew,
  cancelRegistration,
  registrationState,
  updateRegistrationForm,
  updateRegistrationCrews,
  handleSubmit,
  setViewOption,
  viewOption,
}: RegisterNewUserProps) {
  const [cancelRegistrationModalOpen, setCancelRegistrationModalOpen] =
    useState(false);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const { form, selectedCrews, isPending, isSuccess } = registrationState;

  const handleCrewCheckbox = (id: string) => {
    const newCrews = selectedCrews.includes(id)
      ? selectedCrews.filter((c) => c !== id)
      : [...selectedCrews, id];
    updateRegistrationCrews(newCrews);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: randomName, value } = e.target;
    const realName = e.target.getAttribute("data-name") || randomName;

    let formattedValue = value;
    let error = "";

    // Format and validate phone numbers
    if (realName === "phoneNumber" || realName === "emergencyContactNumber") {
      formattedValue = formatPhoneNumber(value);
      if (value && !isValidPhoneNumber(formattedValue)) {
        error = "Please enter a valid phone number";
      }
    }

    // Validate email
    if (realName === "email") {
      if (value && !isValidEmail(value)) {
        error = "Please enter a valid email address";
      }
    }

    // Update validation errors
    setValidationErrors((prev) => ({
      ...prev,
      [realName]: error,
    }));

    // Update form state with formatted value
    updateRegistrationForm({
      [realName as keyof RegistrationState["form"]]: formattedValue,
    });
  };

  // Validate form before submission
  const validateForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: ValidationErrors = {};

    if (!form.email || !isValidEmail(form.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!form.phoneNumber || !isValidPhoneNumber(form.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number";
    }

    if (
      !form.emergencyContactNumber ||
      !isValidPhoneNumber(form.emergencyContactNumber)
    ) {
      errors.emergencyContactNumber =
        "Please enter a valid emergency contact number";
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      handleSubmit(e);
    }
  };

  const renderField = (field: (typeof fields)[number]) => {
    const randomFieldName = `reg_${field.name}_${Math.random()}`;
    const error = validationErrors[field.name as keyof ValidationErrors];
    const value = form[field.name];

    // Check if field is valid
    const isValid = () => {
      if (!value) return false;
      switch (field.name) {
        case "email":
          return isValidEmail(String(value));
        case "phoneNumber":
        case "emergencyContactNumber":
          return isValidPhoneNumber(String(value));
        default:
          return String(value).trim() !== "";
      }
    };

    return (
      <Holds className="flex flex-col py-1" key={field.name}>
        <Texts position={"left"} size={"p7"} text={isValid() ? "black" : "red"}>
          {field.label}
        </Texts>
        <Inputs
          variant={"empty"}
          name={randomFieldName}
          data-name={field.name}
          type={field.type}
          value={String(form[field.name] || "")}
          onChange={handleInputChange}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          className={`w-full text-base border-[3px] px-1.5  ${
            error ? "border-red-500" : "border-black"
          }`}
          required
        />
        {error && (
          <Texts size={"p8"} position={"left"} className="text-red-500 ">
            {error}
          </Texts>
        )}
      </Holds>
    );
  };

  return (
    <>
      <Holds className="col-span-4 w-full h-full overflow-y-auto no-scrollbar">
        <form
          onSubmit={validateForm}
          className="w-full h-full"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          data-form-type="other"
        >
          <Grids className="w-full h-full grid-rows-[40px_1fr] gap-5">
            <Holds
              background={"white"}
              position={"row"}
              className="w-full px-5 py-1 justify-between items-center relative"
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
              {isSuccess && (
                <Holds
                  background={"green"}
                  className="absolute w-full h-full top-0 left-0 justify-center items-center"
                >
                  <Texts size={"p6"} className="italic">
                    Successfully Registered New Employee!
                  </Texts>
                </Holds>
              )}
              <Texts
                text={"link"}
                size={"p7"}
                onClick={() => setCancelRegistrationModalOpen(true)}
              >
                Cancel Registration
              </Texts>
            </Holds>
            <Holds
              background={"white"}
              className="w-full h-full justify-center items-center overflow-y-auto no-scrollbar"
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
                  <Holds
                    position={"row"}
                    className="w-full gap-x-3 justify-end"
                  >
                    <Buttons
                      shadow={"none"}
                      type="button"
                      className={`w-14 h-12 rounded-[10px] border-none p-1.5 transition-colors ${
                        form.truckingView
                          ? "bg-app-blue"
                          : "bg-gray-400 gray opacity-80"
                      }`}
                      onClick={() =>
                        updateRegistrationForm({
                          truckingView: !form.truckingView,
                        })
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
                      className={`w-14 h-12 rounded-[10px] border-none p-1.5 transition-colors ${
                        form.tascoView
                          ? "bg-app-blue"
                          : "bg-gray-400 gray opacity-80"
                      }`}
                      onClick={() =>
                        updateRegistrationForm({
                          tascoView: !form.tascoView,
                        })
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
                      className={`w-14 h-12 rounded-[10px] border-none p-1.5 transition-colors ${
                        form.engineerView
                          ? "bg-app-blue"
                          : "bg-gray-400 gray opacity-80"
                      }`}
                      onClick={() =>
                        updateRegistrationForm({
                          engineerView: !form.engineerView,
                        })
                      }
                    >
                      <img
                        src="/mechanic.svg"
                        alt="mechanic"
                        className="w-full h-full mx-auto object-contain"
                      />
                    </Buttons>

                    <Buttons
                      shadow={"none"}
                      type="button"
                      className={`w-14 h-12 rounded-[10px] border-none p-1.5 transition-colors ${
                        form.generalView
                          ? "bg-app-blue"
                          : "bg-gray-400 gray opacity-80"
                      }`}
                      onClick={() =>
                        updateRegistrationForm({
                          generalView: !form.generalView,
                        })
                      }
                    >
                      <img
                        src="/equipment.svg"
                        alt="equipment"
                        className="w-full h-full mx-auto object-contain"
                      />
                    </Buttons>
                  </Holds>
                </Holds>
                <Holds
                  position={"row"}
                  className="size-full row-start-2 row-end-3 gap-3"
                >
                  <Holds size={"50"} className="h-full">
                    {fields.map(renderField)}

                    <Holds className="flex flex-col pb-1">
                      <Texts position={"left"} size={"p7"}>
                        Permission Level
                      </Texts>
                      <Selects
                        name="permissionLevel"
                        value={form.permissionLevel}
                        onChange={(e) =>
                          updateRegistrationForm({
                            permissionLevel: e.target
                              .value as RegistrationState["form"]["permissionLevel"],
                          })
                        }
                        className="w-full text-base "
                      >
                        <option value="USER">User</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPERADMIN">Super Admin</option>
                      </Selects>
                    </Holds>

                    <Holds className="flex flex-col pb-1">
                      <Texts position={"left"} size={"p7"}>
                        Employment Status
                      </Texts>
                      <Selects
                        name="employmentStatus"
                        value={form.employmentStatus}
                        onChange={(e) =>
                          updateRegistrationForm({
                            employmentStatus: e.target
                              .value as RegistrationState["form"]["employmentStatus"],
                          })
                        }
                        className="w-full text-base "
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Selects>
                    </Holds>
                  </Holds>
                  <CrewSelectList
                    crew={crew}
                    selectedCrews={selectedCrews}
                    handleCrewCheckbox={handleCrewCheckbox}
                    setViewOption={setViewOption}
                    viewOption={viewOption}
                  />
                </Holds>
              </Grids>
            </Holds>
          </Grids>
        </form>
      </Holds>
      <NModals
        isOpen={cancelRegistrationModalOpen}
        handleClose={() => setCancelRegistrationModalOpen(false)}
        size="xs"
        background={"noOpacity"}
      >
        <Holds className="w-full h-full justify-center items-center">
          <Holds className="w-full h-full justify-center items-center ">
            <Texts size={"p6"} className="italic">
              Are you sure you want to cancel creating this crew?
            </Texts>
          </Holds>
          <Holds className="w-full h-full justify-center items-center gap-3 mt-2 p-3">
            <Holds className="w-full h-full ">
              <Buttons
                background={"lightBlue"}
                shadow="none"
                type="button"
                className="w-full py-2 border-none"
                onClick={() => {
                  cancelRegistration();
                  setCancelRegistrationModalOpen(false);
                }}
              >
                <Titles size="h6" className="">
                  Yes, Continue
                </Titles>
              </Buttons>
            </Holds>
            <Holds className="w-full">
              <Buttons
                background={"red"}
                shadow="none"
                type="button"
                className="w-full py-2 border-none"
                onClick={() => setCancelRegistrationModalOpen(false)}
              >
                <Titles size="h6" className="">
                  No, go back!
                </Titles>
              </Buttons>
            </Holds>
          </Holds>
        </Holds>
      </NModals>
    </>
  );
}
