import React, { useState, useRef, useEffect } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import EquipmentRegistrationForm from "../forms/EquipmentRegistrationForm";
import { Buttons } from "@/components/(reusable)/buttons";
import {
  useEquipmentRegistrationForm,
  NewEquipment,
} from "../hooks/useEquipmentRegistrationForm";
import { on } from "events";
import Spinner from "@/components/(animations)/spinner";

interface EquipmentRegistrationViewProps {
  /** Handler for new equipment submission */
  onSubmit: (newEquipment: NewEquipment) => Promise<void>;
  /** Handler to cancel registration */
  onCancel: () => void;
  /** Handler for tracking unsaved changes */
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
  /** Flag indicating if the equipment was successfully updated */
  onSuccess: boolean;
}

/**
 * Component for new equipment registration view.
 * Displays the registration form with header actions for submit/cancel.
 *
 * @param props - The component props
 * @returns JSX element containing the complete registration interface
 */
export default function EquipmentRegistrationView({
  onSubmit: onSubmitProp,
  onCancel,
  onUnsavedChangesChange,
  onSuccess,
}: EquipmentRegistrationViewProps) {
  const [isFormValid, setIsFormValid] = useState(false);
  const formSubmitRef = useRef<(() => void) | null>(null);

  const {
    formData,
    errors,
    touched,
    triedSubmit,
    hasVehicleInfo,
    handleInputChange,
    handleVehicleInfoChange,
    handleEquipmentTagChange,
    handleBlur,
    handleSubmit,
    isFormEmpty,
    isSubmitting,
  } = useEquipmentRegistrationForm({
    onSubmit: onSubmitProp,
    onUnsavedChangesChange: onUnsavedChangesChange,
    onValidityChange: setIsFormValid,
  });

  useEffect(() => {
    formSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  return (
    <Holds className="w-full h-full col-span-4">
      <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
        <Holds
          background={"white"}
          position={"row"}
          className="w-full h-full rounded-[10px] justify-between px-4 relative"
        >
          {onSuccess && (
            <Holds
              background={"green"}
              className="absolute top-0 left-0 w-full h-full rounded-[10px] flex items-center justify-center"
            >
              <Texts size={"sm"}>Equipment successfully registered!</Texts>
            </Holds>
          )}

          <Buttons
            background={"none"}
            shadow={"none"}
            className={`w-fit h-auto`}
            disabled={!isFormValid || isFormEmpty}
            onClick={handleSubmit}
          >
            <Texts
              position={"left"}
              size={"sm"}
              text={"link"}
              className={`flex items-center gap-2 ${
                !isFormValid || isFormEmpty ? "text-gray-400" : "text-black"
              }`}
            >
              Submit New Equipment
            </Texts>
          </Buttons>

          <Buttons
            background={"none"}
            shadow={"none"}
            className="w-fit h-auto"
            onClick={onCancel}
          >
            <img src="/statusDenied.svg" alt="Close" className="w-4 h-4" />
          </Buttons>
        </Holds>

        <Holds
          background={"white"}
          className="w-full h-full rounded-[10px] p-3 overflow-y-auto relative"
        >
          <Grids className="w-full h-full grid-rows-[50px_1fr]">
            <Holds className="w-full h-full">
              <Titles position={"left"} size={"xl"} className="font-bold">
                New Equipment
              </Titles>
            </Holds>
            <Holds className="w-full h-full overflow-y-auto">
              {isSubmitting && (
                <Holds className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-white z-10">
                  <Spinner size={80} />
                </Holds>
              )}
              <EquipmentRegistrationForm
                formData={formData}
                errors={errors}
                touched={touched}
                triedSubmit={triedSubmit}
                hasVehicleInfo={hasVehicleInfo}
                onInputChange={handleInputChange}
                onVehicleInfoChange={handleVehicleInfoChange}
                onEquipmentTagChange={handleEquipmentTagChange}
                onBlur={handleBlur}
                onFormSubmit={handleSubmit}
                onCancel={onCancel}
              />
            </Holds>
          </Grids>
        </Holds>
      </Grids>
    </Holds>
  );
}
