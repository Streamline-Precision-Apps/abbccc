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
import { Client, useClientDataById } from "./useClientDataById";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { SquareCheck, SquareXIcon } from "lucide-react";
import { format } from "date-fns";
import { updateClientAdmin } from "@/actions/AssetActions";
import { toast } from "sonner";
import { StateOptions } from "@/data/stateValues";

export default function EditClientModal({
  cancel,
  pendingEditId,
  rerender,
}: {
  cancel: () => void;
  pendingEditId: string;
  rerender: () => void;
}) {
  const { clientDetails, loading } = useClientDataById(pendingEditId);
  const [formData, setFormData] = useState<Client | null>(null);
  const [originalForm, setOriginalForm] = useState<Client | null>(null);

  useEffect(() => {
    if (clientDetails) {
      setFormData(clientDetails);
      setOriginalForm(clientDetails);
    }
  }, [clientDetails]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              type === "number" ? (value === "" ? null : Number(value)) : value,
          }
        : prev
    );
  };

  const handleSaveChanges = async () => {
    if (!formData) {
      toast.error("No form data to save.");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("id", formData.id);
      fd.append("name", formData.name);
      fd.append("description", formData.description || "");
      fd.append("approvalStatus", formData.approvalStatus);
      fd.append("contactPerson", formData.contactPerson || "");
      fd.append("contactEmail", formData.contactEmail || "");
      fd.append("contactPhone", formData.contactPhone || "");
      fd.append("Address", JSON.stringify(formData.Address));
      const result = await updateClientAdmin(fd);

      if (result?.success) {
        toast.success("Client updated successfully.");
        cancel();
        rerender();
      } else {
        throw new Error(result?.message || "Failed to update client.");
      }
    } catch (err) {
      toast.error("Error updating client. Please try again.");
      console.error(err);
    }
  };

  if (loading || !formData || !originalForm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
        <div className="flex flex-col w-full ">
          <div className="flex flex-row justify-between mb-4">
            <p className="text-xs  text-gray-500">
              {`last updated at ${format(formData.updatedAt, "PPpp")}`}
            </p>
          </div>
          <div className="flex flex-row justify-between ">
            <div className="flex flex-col mb-4">
              <h2 className="text-lg font-semibold">{`Edit ${originalForm.name}`}</h2>
              <div>
                <p className="text-sm text-gray-600">
                  {`Created via: ${
                    formData.createdVia.toLowerCase() || "Admin"
                  } by ${formData.createdById || "System"}`}
                </p>
                <p className="text-xs text-gray-600">
                  {`Status: `}
                  <span
                    className={`text-sm ${
                      originalForm.approvalStatus === "APPROVED"
                        ? "text-green-600"
                        : originalForm.approvalStatus === "PENDING"
                        ? "text-sky-600"
                        : "text-red-600"
                    }`}
                  >
                    {originalForm.approvalStatus
                      .toLowerCase()
                      .slice(0, 1)
                      .toUpperCase() +
                      originalForm.approvalStatus.toLowerCase().slice(1)}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 mb-4">
            {originalForm.approvalStatus === "PENDING" && (
              <div>
                <Label htmlFor="creationReason" className="text-sm font-medium">
                  Creation Reason
                </Label>
                <Textarea
                  name="creationReason"
                  value={formData.creationReason || ""}
                  onChange={handleInputChange}
                  className="w-full text-xs"
                  disabled
                />
              </div>
            )}
            <div>
              <Label htmlFor="name" className="text-sm">
                Name
              </Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full text-xs"
                required
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="w-full text-xs"
              />
            </div>
            <div>
              <Label htmlFor="contact-person" className={`text-sm font-normal`}>
                Contact Person
              </Label>
              <Input
                id="contact-person"
                type="text"
                name="contactPerson"
                value={formData.contactPerson || ""}
                placeholder="Enter the full name of the primary point of contact."
                onChange={handleInputChange}
                className="w-full text-xs"
              />
            </div>
            <div>
              <Label htmlFor="contact-email" className={`text-sm font-normal`}>
                Contact Email
              </Label>
              <Input
                id="contact-email"
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                placeholder="Enter the primary contact's email address."
                onChange={handleInputChange}
                className="w-full text-xs"
              />
            </div>
            <div>
              <Label htmlFor="contact-phone" className={`text-sm font-normal`}>
                Contact Phone
              </Label>
              <Input
                id="contact-phone"
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow digits and dashes, auto-format if possible
                  const cleaned = value.replace(/[^\d]/g, "");
                  let formatted = cleaned;
                  if (cleaned.length > 3 && cleaned.length <= 6) {
                    formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
                  } else if (cleaned.length > 6) {
                    formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(
                      3,
                      6
                    )}-${cleaned.slice(6, 10)}`;
                  }
                  setFormData({
                    ...formData,
                    contactPhone: formatted,
                  });
                }}
                pattern="^\\d{3}-\\d{3}-\\d{4}$"
                maxLength={12}
                placeholder="xxx-xxx-xxxx"
                className="w-full text-xs"
                title="Phone number must be in the format xxx-xxx-xxxx"
                required
              />
            </div>
            <div className="flex flex-col border-b mt-6 pb-1">
              <p className="text-sm font-semibold">Client Address</p>
            </div>
            <div className="mb-2">
              <p className="text-xs font-semibold text-gray-400">
                Please provide the client&apos;s address details.
              </p>
            </div>
            <div>
              <Label htmlFor="street" className={`text-sm font-normal `}>
                Street <span className="text-red-500">*</span>
              </Label>
              <Input
                id="street"
                name="street"
                value={formData.Address.street}
                onChange={(e) =>
                  setFormData((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      Address: {
                        ...prev.Address,
                        street: e.target.value,
                      },
                    };
                  })
                }
                className="w-full text-xs"
                placeholder="Enter street address..."
                required
              />
            </div>
            <div>
              <Label htmlFor="city" className={`text-sm font-normal `}>
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                name="city"
                value={formData.Address.city}
                onChange={(e) =>
                  setFormData((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      Address: {
                        ...prev.Address,
                        city: e.target.value,
                      },
                    };
                  })
                }
                className="w-full text-xs"
                placeholder="Enter city..."
                required
              />
            </div>
            <div>
              <Label htmlFor="state" className={`text-sm font-normal `}>
                State <span className="text-red-500">*</span>
              </Label>
              <Select
                name="state"
                value={formData.Address.state}
                onValueChange={(value) =>
                  setFormData((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      Address: {
                        ...prev.Address,
                        state: value,
                      },
                    };
                  })
                }
              >
                <SelectTrigger id="state" className="text-xs">
                  <SelectValue placeholder="Select a State" />
                </SelectTrigger>
                <SelectContent>
                  {StateOptions.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="zipCode" className={`text-sm font-normal `}>
                Zip Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.Address.zipCode}
                onChange={(e) =>
                  setFormData((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      Address: {
                        ...prev.Address,
                        zipCode: e.target.value,
                      },
                    };
                  })
                }
                className="w-full text-xs"
                placeholder="Enter zip code..."
                required
              />
            </div>
          </div>
          <div className="flex flex-row justify-end gap-2 w-full">
            {originalForm && originalForm.approvalStatus === "PENDING" && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className={`bg-red-200 hover:bg-red-300 text-red-800 px-4 py-2 rounded ${
                    formData.approvalStatus !== "REJECTED"
                      ? "bg-opacity-50 "
                      : " border-red-800 hover:border-red-900 border-2"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, approvalStatus: "REJECTED" })
                  }
                  disabled={loading}
                >
                  {formData.approvalStatus === "REJECTED" ? "" : "Deny"}
                  {formData.approvalStatus === "REJECTED" && (
                    <SquareXIcon className="text-red-800" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`bg-green-400 hover:bg-green-300 text-green-800 px-4 py-2 rounded ${
                    formData.approvalStatus !== "APPROVED"
                      ? "bg-opacity-50 "
                      : " border-green-800 hover:border-green-900 border-2"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, approvalStatus: "APPROVED" })
                  }
                  disabled={loading}
                >
                  <div className="flex flex-row items-center gap-2">
                    {formData.approvalStatus === "APPROVED" ? `` : "Approve"}
                    {formData.approvalStatus === "APPROVED" && (
                      <SquareCheck className="text-green-800" />
                    )}
                  </div>
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={cancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveChanges}
              className={`bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded ${
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
          {originalForm.approvalStatus === "PENDING" &&
            formData.approvalStatus !== "PENDING" && (
              <div className="flex flex-row justify-end mt-4">
                <p className="text-xs  text-gray-500">
                  {`Marked as ${
                    formData.approvalStatus
                      .toLowerCase()
                      .slice(0, 1)
                      .toUpperCase() +
                    formData.approvalStatus.toLowerCase().slice(1)
                  } save changes to update the status.`}
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
