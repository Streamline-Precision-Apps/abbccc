import { EditableFields } from "@/components/(reusable)/EditableField";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";

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
    leadId: string;
  }[];
  image?: string;
}

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
              value={user.activeEmployee ? "Active" : "Inactive"}
              className={`w-full px-2 h-8 text-sm text-center ${
                edited["activeEmployee"] ? "border-2 border-orange-400" : ""
              }`}
              onChange={(e) => {
                const value = e.target.value;
                updateEditState({
                  user: {
                    ...user,
                    activeEmployee: value === "Active",
                  },
                  edited: {
                    ...edited,
                    activeEmployee:
                      (value === "Active") !== originalUser?.activeEmployee,
                  },
                });
              }}
            >
              <option value="">Select Employment Status</option>
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
                  updateEditState({
                    user: {
                      ...user,
                      Contact: {
                        ...user.Contact,
                        [field.name]: (originalUser.Contact as any)[field.name],
                      },
                    },
                    edited: {
                      ...edited,
                      [field.name]: false,
                    },
                  });
                } else {
                  updateEditState({
                    user: {
                      ...user,
                      [field.name]: (originalUser as any)[field.name],
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
