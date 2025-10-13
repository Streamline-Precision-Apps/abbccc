"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createCrew } from "@/actions/adminActions";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkType } from "../../../../../../prisma/generated/prisma";
import Spinner from "@/components/(animations)/spinner";

type User = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  secondLastName: string | null;
  permission: string;
  terminationDate: Date | null;
};

export interface CrewData {
  name: string;
  leadId: string;
  crewType: WorkType | "";
  Users: {
    id: string;
  }[];
}

export default function CreateCrewModal({
  cancel,
  rerender,
}: {
  cancel: () => void;
  rerender: () => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CrewData>({
    name: "",
    leadId: "",
    crewType: "",
    Users: [],
  });

  useEffect(() => {
    // Fetch users from the server or context
    const fetchUsers = async () => {
      const response = await fetch("/api/getAllEmployees?filter=all");
      const data = await response.json();
      setUsers(data as User[]);
    };

    fetchUsers();
  }, []);

  // Helper to ensure lead is always in Users
  const ensureLeadInUsers = (leadId: string, users: { id: string }[]) => {
    if (!leadId) return users;
    if (!users.some((u) => u.id === leadId)) {
      return [...users, { id: leadId }];
    }
    return users;
  };

  const handleCreatePersonnel = async () => {
    setSubmitting(true);
    try {
      // Basic validation
      if (
        !formData.name.trim() ||
        !formData.leadId.trim() ||
        !formData.crewType.trim() ||
        formData.Users.length === 0
      ) {
        toast.error("Please fill in all required fields.", { duration: 3000 });
        setSubmitting(false);
        return;
      }

      // Prepare payload
      const formD = new FormData();
      // Always ensure lead is in Users before submit
      const usersWithLead = ensureLeadInUsers(formData.leadId, formData.Users);
      formD.append("name", formData.name);
      formD.append("leadId", formData.leadId);
      formD.append("crewType", formData.crewType);
      formD.append("Users", JSON.stringify(usersWithLead));

      // TODO: Replace with correct personnel creation action if available
      const result = await createCrew(formD);
      if (result.success) {
        toast.success("Personnel created successfully!", { duration: 3000 });
        rerender();
        cancel();
      } else {
        toast.error("Failed to create personnel", { duration: 3000 });
      }
    } catch (error) {
      toast.error("Failed to create personnel", { duration: 3000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-[1000px] w-full  max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Create Crew</h2>
            <p className="text-xs text-gray-600">
              Fill in the details to create a new crew.
            </p>
            <p className="text-xs text-red-500">
              All fields marked with * are required
            </p>
          </div>
          <form
            className="flex flex-col gap-8 w-full"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreatePersonnel();
            }}
          >
            <div className="flex flex-row flex-wrap gap-8 md:flex-nowrap">
              {/* Left: User creation fields */}
              <div className="flex-1 min-w-[280px] flex flex-col gap-4">
                <div>
                  <Label htmlFor="name">
                    Crew Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    required
                    className="w-full text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="crewType">
                    Crew Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.crewType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        crewType: value as
                          | "MECHANIC"
                          | "TRUCK_DRIVER"
                          | "LABOR"
                          | "TASCO"
                          | "",
                      }))
                    }
                  >
                    <SelectTrigger
                      className="w-full text-xs"
                      id="crewType"
                      name="crewType"
                    >
                      <SelectValue placeholder="Select a crew type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MECHANIC" className="text-xs">
                        Mechanic
                      </SelectItem>
                      <SelectItem value="TRUCK_DRIVER" className="text-xs">
                        Truck Driver
                      </SelectItem>
                      <SelectItem value="LABOR" className="text-xs">
                        Labor
                      </SelectItem>
                      <SelectItem value="TASCO" className="text-xs">
                        Tasco
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="leadId">
                    Crew Lead <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.leadId}
                    onValueChange={(value) => {
                      setFormData((prev) => {
                        // Remove previous lead from Users if present
                        let updatedUsers = prev.Users.filter(
                          (u) => u.id !== prev.leadId,
                        );
                        // Add new lead if not present
                        if (value) {
                          if (!updatedUsers.some((u) => u.id === value)) {
                            updatedUsers = [...updatedUsers, { id: value }];
                          }
                        }
                        return { ...prev, leadId: value, Users: updatedUsers };
                      });
                    }}
                  >
                    <SelectTrigger
                      className="w-full text-xs"
                      id="leadId"
                      name="leadId"
                    >
                      <SelectValue placeholder="Select a crew lead" />
                    </SelectTrigger>
                    <SelectContent>
                      {users
                        .filter((user) => user.permission !== "USER")
                        .map((user) => (
                          <SelectItem
                            key={user.id}
                            value={user.id}
                            className="text-xs"
                          >
                            {user.firstName} {user.lastName}
                            {user.middleName ? ` ${user.middleName}` : ""}
                            {user.secondLastName
                              ? ` ${user.secondLastName}`
                              : ""}
                            {user.permission ? ` (${user.permission})` : ""}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex-1 min-w-[280px] flex flex-col gap-6">
                <div>
                  <div className="flex items-center justify-between">
                    <Label>
                      Select Crew Members{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <span className="text-xs text-gray-500 ">
                      {users.length === 0 ? (
                        <div className="mr-1">
                          <Spinner size={10} />
                        </div>
                      ) : formData.Users.length > 0 ? (
                        `${formData.Users.length} selected`
                      ) : (
                        users.length
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 h-64   overflow-y-auto border rounded p-2 bg-gray-50">
                    {users.length === 0
                      ? Array.from({ length: 10 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-32 rounded" />
                          </div>
                        ))
                      : [...users]
                          .sort((a, b) => {
                            const lastA = a.lastName?.toLowerCase() || "";
                            const lastB = b.lastName?.toLowerCase() || "";
                            if (lastA < lastB) return -1;
                            if (lastA > lastB) return 1;
                            return 0;
                          })
                          .map((user) => {
                            const isChecked = formData.Users.some(
                              (u) => u.id === user.id,
                            );
                            return (
                              <label
                                key={user.id}
                                className="flex items-center gap-2 text-xs cursor-pointer"
                              >
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    setFormData((prev) => {
                                      let updatedUsers;
                                      if (checked) {
                                        // Add user if not already present
                                        if (
                                          !prev.Users.some(
                                            (u) => u.id === user.id,
                                          )
                                        ) {
                                          updatedUsers = [
                                            ...prev.Users,
                                            { id: user.id },
                                          ];
                                        } else {
                                          updatedUsers = prev.Users;
                                        }
                                      } else {
                                        // Remove user
                                        updatedUsers = prev.Users.filter(
                                          (u) => u.id !== user.id,
                                        );
                                      }
                                      return { ...prev, Users: updatedUsers };
                                    });
                                  }}
                                />
                                <span>
                                  {`${user.firstName ? ` ${user.firstName}` : ""}${user.middleName ? ` ${user.middleName}` : ""}${user.lastName ? ` ${user.lastName}` : ""}${user.secondLastName ? ` ${user.secondLastName}` : ""}`}
                                </span>
                              </label>
                            );
                          })}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-end gap-2 w-full mt-4">
              <div className="flex flex-row justify-end gap-2 w-full">
                <Button
                  variant="outline"
                  type="button"
                  onClick={cancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  type="submit"
                  className={`bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded ${submitting ? "opacity-50" : ""}`}
                >
                  {submitting ? "Creating..." : "Create Crew"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
