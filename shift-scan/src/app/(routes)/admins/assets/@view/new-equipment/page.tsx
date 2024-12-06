"use client";
import { createEquipment } from "@/actions/equipmentActions";
import { useNotification } from "@/app/context/NotificationContext";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { Titles } from "@/components/(reusable)/titles";
import { useSession } from "next-auth/react";
import { useRef } from "react";

export default function NewEquipment() {
  const { data: session } = useSession();
  const CreateFormRef = useRef<HTMLFormElement>(null);
  const { setNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    // Add default values for required fields if not provided
    formData.set("equipmentTag", "EQUIPMENT");
    formData.set("qrId", crypto.randomUUID()); // Example: Generate a unique QR ID

    try {
      await createEquipment(formData);
      setNotification("Equipment created successfully.", "success");
      if (CreateFormRef.current) {
        CreateFormRef.current.reset();
      }
    } catch (error) {
      console.error("Failed to create equipment:", error);
      setNotification("Failed to create equipment.", "error");
    }
  };

  return (
    <Holds className="w-full h-full">
      <form
        ref={CreateFormRef}
        onSubmit={handleSubmit}
        className="w-full h-full"
      >
        <Grids rows="10" gap="5">
          <Holds className="row-span-2 w-full h-full">
            <Grids rows="3" cols="8" className="w-full h-full my-2">
              <Holds
                position="left"
                className="row-start-1 row-end-2 col-start-1 col-end-3 h-full cursor-pointer"
              >
                <Images
                  titleImg={"/equipment.svg"}
                  titleImgAlt="equipment"
                  className="rounded-full my-auto p-4"
                  size="70"
                />
              </Holds>
              <Holds className="row-start-2 row-end-3 col-start-3 col-end-5 h-full">
                <Titles size="h2" position="left">
                  New Equipment
                </Titles>
              </Holds>
              <Holds className="row-start-1 row-end-2 col-start-7 col-end-9 my-auto pr-4">
                <Buttons background="green" type="submit" className="p-1">
                  <Titles size="h4">Create Equipment</Titles>
                </Buttons>
              </Holds>
            </Grids>
          </Holds>

          <Holds className="row-span-8 w-full h-full">
            <Grids rows={"1"} className="w-full h-full p-5">
              <Holds className="w-full h-full flex-wrap">
                <Holds className="w-[45%] px-2">
                  <Labels size={"p6"}>Name *</Labels>
                  <Inputs className="h-10" type="text" name="name" required />
                </Holds>
                <Holds className="w-[45%] px-2">
                  <Labels size={"p6"}>Description *</Labels>
                  <Inputs
                    className="h-10"
                    type="text"
                    name="description"
                    required
                  />
                </Holds>
                <Holds className="w-[45%] px-2">
                  <Labels size={"p6"}>Make</Labels>
                  <Inputs className="h-10" type="text" name="make" />
                </Holds>
                <Holds className="w-[45%] px-2">
                  <Labels size={"p6"}>Model</Labels>
                  <Inputs className="h-10" type="text" name="model" />
                </Holds>
                <Holds className="w-[45%] px-2">
                  <Labels size={"p6"}>Year</Labels>
                  <Inputs className="h-10" type="text" name="year" />
                </Holds>
                <Holds className="w-[45%] px-2">
                  <Labels size={"p6"}>License Plate</Labels>
                  <Inputs className="h-10" type="text" name="licensePlate" />
                </Holds>
                <Holds className="w-[45%] px-2">
                  <Labels size={"p6"}>Registration Expiration</Labels>
                  <Inputs
                    className="h-10"
                    type="date"
                    name="registrationExpiration"
                  />
                </Holds>
                <Holds className="w-[45%] px-2">
                  <Labels size={"p6"}>Mileage</Labels>
                  <Inputs className="h-10" type="number" name="mileage" />
                </Holds>
                <Holds className="w-[45%] px-2">
                  <Labels size={"p6"}>Status *</Labels>
                  <Selects name="equipmentStatus" required>
                    <option value="OPERATIONAL">Operational</option>
                    <option value="NEEDS_REPAIR">Needs Repair</option>
                    <option value="NEEDS_MAINTENANCE">
                      Needs Maintenance
                    </option>
                  </Selects>
                </Holds>
              </Holds>
            </Grids>
          </Holds>
        </Grids>
      </form>
    </Holds>
  );
}
