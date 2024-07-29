import React, { useState, useEffect } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { createEquipment } from "@/actions/equipmentActions";

interface AddEquipmentFormProps {
  blob: Blob | null;
}

const AddEquipmentForm: React.FC<AddEquipmentFormProps> = ({ blob }) => {
  const [equipmentTag, setEquipmentTag] = useState("EQUIPMENT");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setEquipmentTag(e.target.value);
  };

  return (
    <form action={createEquipment} className="space-y-4">
      <div>
        <label htmlFor="equipment_tag" className="block">
          Equipment Tag
        </label>
        <select
          id="equipment_tag"
          name="equipment_tag"
          onChange={handleChange}
          className="block w-full border border-black rounded p-2"
        >
          <option value="">Select One</option>
          <option value="TRUCK">TRUCK</option>
          <option value="TRAILER">TRAILER</option>
          <option value="EQUIPMENT">EQUIPMENT</option>
        </select>
      </div>
      <div>
        <label htmlFor="name" className="block">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="description" className="block">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="equipment_status" className="block">
          Equipment Status
        </label>
        <select
          id="equipment_status"
          name="equipment_status"
          className="block w-full border border-black rounded p-2"
        >
          <option value="">Select One</option>
          <option value="OPERATIONAL">OPERATIONAL</option>
          <option value="NEEDS_REPAIR">NEEDS_REPAIR</option>
        </select>
      </div>
      {equipmentTag === "TRUCK" || equipmentTag === "TRAILER" ? (
        <>
          <div>
            <label htmlFor="make" className="block">
              Make
            </label>
            <input
              id="make"
              name="make"
              type="text"
              className="block w-full border border-black rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="model" className="block">
              Model
            </label>
            <input
              id="model"
              name="model"
              type="text"
              className="block w-full border border-black rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="year" className="block">
              Year
            </label>
            <input
              id="year"
              name="year"
              type="text"
              className="block w-full border border-black rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="license_plate" className="block">
              License Plate
            </label>
            <input
              id="license_plate"
              name="license_plate"
              type="text"
              className="block w-full border border-black rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="registration_expiration" className="block">
              Registration Expiration
            </label>
            <input
              id="registration_expiration"
              name="registration_expiration"
              type="date"
              className="block w-full border border-black rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="mileage" className="block">
              Mileage
            </label>
            <input
              id="mileage"
              name="mileage"
              type="number"
              className="block w-full border border-black rounded p-2"
            />
          </div>
        </>
      ) : null}
      <Buttons variant="green" size="default" type="submit">
        Submit
      </Buttons>
    </form>
  );
};

export default AddEquipmentForm;
