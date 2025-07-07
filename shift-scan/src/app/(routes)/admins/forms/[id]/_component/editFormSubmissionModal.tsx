import { getFormSubmissionById } from "@/actions/records-forms";
import { Button } from "@/components/ui/button";

import { use, useEffect } from "react";

export default function EditFormSubmissionModal({
  id,
  closeModal,
}: {
  id: string;
  closeModal: () => void;
}) {
  // Assuming getFormSubmissionById is a function that fetches the
  useEffect(() => {
    const fetchData = async () => {
      const submissionId = await getFormSubmissionById(id);
    };
    fetchData();
  }, []);

  const saveChanges = () => {
    console.log("Changes saved for submission ID:", id);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg min-w-[500px] max-w-[90vw] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
        <div className="flex flex-col gap-4 w-full items-center">
          <div className="w-full flex flex-row justify-start">
            <p className="text-base font-semibold ">Edit Form Submission</p>
          </div>
          <div className="w-full flex flex-row justify-end gap-2">
            <Button
              size={"sm"}
              onClick={closeModal}
              variant="outline"
              className="bg-gray-100 text-gray-800 hover:bg-gray-50 hover:text-gray-800"
            >
              Close
            </Button>
            <Button
              size={"sm"}
              onClick={saveChanges}
              variant="outline"
              className="bg-emerald-500 text-white hover:bg-emerald-400 hover:text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
