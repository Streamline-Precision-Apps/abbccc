import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  itemName?: string;
}

export default function TimesheetDeleteModal({
  isOpen,
  onClose,
  onDelete,
  isDeleting = false,
  itemName,
}: DeleteModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto">
        <div className="flex flex-col items-center text-center">
          <AlertTriangle className="text-red-600 mb-3" size={40} />

          <Texts size="sm" className="text-gray-700">
            {`Are you sure you want to delete this timesheet? This action cannot be undone.`}
          </Texts>
        </div>

        <Holds className="flex justify-center gap-4 mt-6">
          <Button
            variant="destructive"
            className="min-w-[120px] p-3"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
          <Button
            variant="outline"
            className="min-w-[120px] p-3 bg-app-gray text-black"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
        </Holds>
      </div>
    </div>
  );
}
