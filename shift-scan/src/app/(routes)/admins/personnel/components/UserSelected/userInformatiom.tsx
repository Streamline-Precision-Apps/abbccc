import { EditableFields } from "@/components/(reusable)/EditableField";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { UserData } from "../types/personnel";

export default function UserInformation({
  fields,
  user,
  edited,
  handleInputChange,
  updateEditState,
  originalUser,
}: {
  fields: {
    name: string;
    label: string;
    type?: string;
  }[];
  user: UserData;
  edited: {
    [key: string]: boolean;
  };
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  updateEditState: (
    updates: Partial<{
      user: UserData | null;
      originalUser: UserData | null;
      selectedCrews: string[];
      originalCrews: string[];
      edited: {
        [key: string]: boolean;
      };
      loading: boolean;
      successfullyUpdated: boolean;
    }>
  ) => void;

  originalUser: UserData | null;
}) {
  return (
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
                edited["permission"] ? "border-2 border-orange-400" : ""
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
              value={user.terminationDate === null ? "Active" : "Inactive"}
              className={`w-full px-2 h-8 text-sm text-center ${
                edited["terminationDate"] ? "border-2 border-orange-400" : ""
              }`}
              onChange={(e) => {
                const value = e.target.value;
                const isActive = value === "Active";
                const newTerminationDate = isActive
                  ? null
                  : new Date().toISOString();
                const hasChanged =
                  (originalUser?.terminationDate === null) !== isActive;

                updateEditState({
                  user: {
                    ...user,
                    terminationDate: newTerminationDate,
                  },
                  edited: {
                    ...edited,
                    terminationDate: hasChanged,
                  },
                });
              }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Selects>
          ) : (
            <EditableFields
              size={"sm"}
              type={field.type}
              name={field.name}
              value={
                field.name === "phoneNumber"
                  ? user.Contact?.phoneNumber || ""
                  : field.name === "emergencyContact"
                  ? user.Contact?.emergencyContact || ""
                  : field.name === "emergencyContactNumber"
                  ? user.Contact?.emergencyContactNumber || ""
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
              disable={field.name === "username"}
              onChange={handleInputChange}
              isChanged={edited[field.name] || false}
              onRevert={() => {
                if (!originalUser) return;

                if (
                  field.name === "phoneNumber" ||
                  field.name === "emergencyContact" ||
                  field.name === "emergencyContactNumber"
                ) {
                  const contactField =
                    field.name as keyof typeof originalUser.Contact;
                  updateEditState({
                    user: {
                      ...user,
                      Contact: {
                        ...user.Contact,
                        [field.name]: originalUser.Contact[contactField],
                      },
                    },
                    edited: {
                      ...edited,
                      [field.name]: false,
                    },
                  });
                } else {
                  const userField = field.name as keyof UserData;
                  updateEditState({
                    user: {
                      ...user,
                      [field.name]: originalUser[userField],
                    },
                    edited: {
                      ...edited,
                      [field.name]: false,
                    },
                  });
                }
              }}
              variant={edited[field.name] ? "danger" : "default"}
            />
          )}
        </Holds>
      ))}
    </Holds>
  );
}
