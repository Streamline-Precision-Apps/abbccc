"use client";

import { Button } from "@/components/ui/button";

export default function EditEquipmentModal({
  cancel,
  pendingEditId,
}: {
  cancel: () => void;
  pendingEditId: string;
}) {
  const handleSaveChanges = () => {
    // Handle save changes logic here
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg min-w-[500px] max-w-[90vw] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
        <div className="flex flex-col gap-4 w-full items-center">
          <h2>Edit Equipment</h2>
          <div className="flex flex-row justify-end gap-4 w-full">
            <Button variant="outline" onClick={handleSaveChanges}>
              Save Changes
            </Button>
            <Button variant="outline" onClick={cancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
