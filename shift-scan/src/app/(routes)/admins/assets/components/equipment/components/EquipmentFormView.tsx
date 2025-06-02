import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import Spinner from "@/components/(animations)/spinner";
import { Equipment } from "../../../types";
import EquipmentBasicFields from "./EquipmentBasicFields";
import VehicleInformationFields from "./VehicleInformationFields";
import EquipmentDescriptionFields from "./EquipmentDescriptionFields";
import { Images } from "@/components/(reusable)/images";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { Texts } from "@/components/(reusable)/texts";
import { Tooltip } from "@/components/(reusable)/tooltip";

interface EquipmentFormViewProps {
  /** Current equipment being edited */
  equipment: Equipment;
  /** Form data state */
  formData: Equipment;
  /** Set of changed field names */
  changedFields: Set<string>;
  /** Handler for input changes */
  onInputChange: (
    fieldName: string,
    value: string | number | boolean | Date
  ) => void;
  /** Handler to revert field changes */
  onRevertField: (fieldName: string) => void;
  /** Whether the form is currently saving */
  isSaving: boolean;
}

/**
 * Component that displays the complete equipment form view.
 * Contains all form sections including basic fields, vehicle info, and description.
 *
 * @param props - The component props
 * @returns JSX element containing the complete equipment form
 */
export default function EquipmentFormView({
  equipment,
  formData,
  changedFields,
  onInputChange,
  onRevertField,
  isSaving,
}: EquipmentFormViewProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  useEffect(() => {
    const generateQrCode = async () => {
      try {
        const url = await QRCode.toDataURL(equipment.qrId || "");
        setQrCodeUrl(url);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };
    generateQrCode();
  }, [formData, equipment.qrId]);

  /**
   * Handles printing the QR code in a new window
   */
  const printQRCode = () => {
    if (!qrCodeUrl) return;

    // Open a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print the QR code");
      return;
    }

    // Write HTML content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print QR Code - ${formData?.name || equipment.name}</title>
        <style>
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
          }
          .qr-code-container {
            text-align: center;
          }
          .qr-code {
            width: 300px;
            height: 300px;
            border: 4px solid black;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .equipment-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .equipment-id {
            font-size: 16px;
            color: #555;
            margin-bottom: 8px;
          }
          .equipment-description {
            font-size: 16px;
            color: #555;
            max-width: 350px;
            padding: 0 20px;
            line-height: 1.4;
            margin-top: 8px;
            white-space: pre-wrap;
            overflow-wrap: break-word;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="qr-code-container">
          <div class="equipment-name">${formData?.name || equipment.name}</div>
          <img src="${qrCodeUrl}" alt="QR Code" class="qr-code" />
          <div class="equipment-id">ID: ${equipment.qrId || "N/A"}</div>
          <div class="equipment-description">${
            equipment.description
              ? `Brief Description:\n${equipment.description}`
              : ""
          }</div>
        </div>
        <script>
          // Print and close window when loaded
          window.onload = function() {
            window.print();
            // Close after printing is done or canceled
            setTimeout(() => window.close(), 500);
          };
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <Holds
      background={"white"}
      className="w-full h-full rounded-[10px] p-3 px-5 relative"
    >
      {/* Loading overlay - only show when saving */}
      {isSaving && (
        <Holds className="w-full h-full justify-center items-center absolute left-0 top-0 z-50 bg-white bg-opacity-80 rounded-[10px]">
          <Spinner size={80} />
        </Holds>
      )}

      <Grids className="w-full h-full grid-rows-[50px_1fr]">
        <Holds position={"row"} className="w-full h-full justify-between">
          <Holds className="w-full">
            <Titles position={"left"} size={"xl"} className="font-bold">
              {formData?.name || equipment.name}
            </Titles>
          </Holds>
          <Holds className="w-full h-full">
            <Holds
              position={"right"}
              className={`w-[50px] h-[50px] border-[3px] border-black rounded-[10px] cursor-pointer hover:opacity-80 hover:border-blue-900 transition-opacity`}
              onClick={printQRCode}
            >
              <Tooltip content="Click to print QR code" delay={0}>
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </Tooltip>
            </Holds>
          </Holds>
        </Holds>

        <Holds className="w-full h-full">
          <Grids className="w-full h-full grid-cols-[1fr_1fr] gap-4">
            <Holds className="w-full h-full col-span-1 overflow-y-scroll no-scrollbar">
              <Holds>
                <EquipmentBasicFields
                  formData={formData}
                  changedFields={changedFields}
                  onInputChange={onInputChange}
                  onRevertField={onRevertField}
                  isSaving={isSaving}
                />

                <VehicleInformationFields
                  formData={formData}
                  changedFields={changedFields}
                  onInputChange={onInputChange}
                  onRevertField={onRevertField}
                  isSaving={isSaving}
                />
              </Holds>
            </Holds>

            <Holds className="w-full h-full">
              <EquipmentDescriptionFields
                description={formData?.description || ""}
                onDescriptionChange={(value) =>
                  onInputChange("description", value)
                }
                isDescriptionChanged={changedFields.has("description")}
                onRevertDescription={() => onRevertField("description")}
                isSaving={isSaving}
              />
            </Holds>
          </Grids>
        </Holds>
      </Grids>
    </Holds>
  );
}
