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
import { useState } from "react";
import { createClientAdmin } from "@/actions/AssetActions";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { StateOptions } from "@/data/stateValues";

export default function CreateClientModal({
  cancel,
  rerender,
}: {
  cancel: () => void;
  rerender: () => void;
}) {
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    approvalStatus: "APPROVED",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    Address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    createdById: session?.user.id,
  });

  const handleAddressChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { name: string; value: string | number }
  ) => {
    let name: string, value: string | number, type: string | undefined;
    if ("target" in e) {
      name = e.target.name;
      value = e.target.value;
      type = (e.target as HTMLInputElement).type;
    } else {
      name = e.name;
      value = e.value;
      type = undefined;
    }
    setFormData((prev: typeof formData) => ({
      ...prev,
      Address: {
        ...prev.Address,
        [name]:
          type === "number" ? (value === "" ? null : Number(value)) : value,
      },
    }));
  };

  const [submitting, setSubmitting] = useState(false);

  const handleCreateJobsite = async () => {
    setSubmitting(true);
    try {
      // Basic validation
      if (!formData.name.trim()) {
        toast.error("Jobsite name is required");
        setSubmitting(false);
        return;
      }

      // Prepare payload
      const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        approvalStatus: formData.approvalStatus,
        contactPerson: formData.contactPerson.trim(),
        contactEmail: formData.contactEmail.trim(),
        contactPhone: formData.contactPhone.trim(),
        Address: {
          street: formData.Address.street.trim(),
          city: formData.Address.city.trim(),
          state: formData.Address.state.trim(),
          zipCode: formData.Address.zipCode.trim(),
        },
        createdById: session?.user.id,
      };

      const result = await createClientAdmin({ payload });
      if (result.success) {
        toast.success("Client created successfully!");
        rerender();
        cancel();
      } else {
        toast.error("Failed to create client");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create client"
      );
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col ">
            <h2 className="text-lg font-semibold">Create Client</h2>
            <p className="text-xs text-gray-600">
              Fill in the details to create a new client.
            </p>
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col border-b pb-1">
                <p className="text-sm font-semibold">Client Information</p>
              </div>
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-400">
                  Please enter the client&apos;s name and description.
                </p>
              </div>
              <div>
                <Label htmlFor="name" className={`text-sm font-normal`}>
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Enter the full name of the client."
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full text-xs"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description" className={`text-sm font-normal`}>
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full text-xs min-h-[96px]"
                  placeholder="Provide a brief description or any relevant notes about the client."
                  style={{ resize: "none" }}
                  required
                />
              </div>

              <div className="flex flex-col border-b mt-6 pb-1">
                <p className="text-sm font-semibold">
                  Primary Contact Information
                </p>
              </div>
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-400">
                  Please provide all the contact info you have.
                </p>
              </div>

              <div>
                <Label
                  htmlFor="contact-person"
                  className={`text-sm font-normal`}
                >
                  Contact Person
                </Label>
                <Input
                  id="contact-person"
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  placeholder="Enter the full name of the primary point of contact."
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactPerson: e.target.value,
                    }))
                  }
                  className="w-full text-xs"
                />
              </div>
              <div>
                <Label
                  htmlFor="contact-email"
                  className={`text-sm font-normal`}
                >
                  Contact Email
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  placeholder="Enter the primary contact's email address."
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactEmail: e.target.value,
                    }))
                  }
                  className="w-full text-xs"
                />
              </div>
              <div>
                <Label
                  htmlFor="contact-phone"
                  className={`text-sm font-normal`}
                >
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
                    setFormData((prev) => ({
                      ...prev,
                      contactPhone: formatted,
                    }));
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
                  onChange={handleAddressChange}
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
                  onChange={handleAddressChange}
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
                    handleAddressChange({ name: "state", value })
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
                <Label htmlFor="jobsite-zip" className={`text-sm font-normal `}>
                  Zip Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="jobsite-zip"
                  name="zipCode"
                  value={formData.Address.zipCode}
                  onChange={handleAddressChange}
                  className="w-full text-xs"
                  placeholder="Enter zip code..."
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end gap-2 mt-4 w-full">
            <Button
              variant="outline"
              onClick={cancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleCreateJobsite}
              className={`bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded ${
                submitting ? "opacity-50" : ""
              }`}
            >
              {submitting ? "Creating..." : "Create Client"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
