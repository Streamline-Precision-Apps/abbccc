"use client";
import { Holds } from "@/components/(reusable)/holds";
import { useEffect, useState } from "react";
import { ReusableViewLayout } from "../../../personnel/@view/[employee]/_components/reusableViewLayout";
import { LeaveRequest } from "@/lib/types";
import { RequestFooter } from "../[id]/_components/inboxFooter";
import { RequestMainCreate } from "./_components/inboxMainCreate";
import { RequestHeaderCreate } from "./_components/inboxHeaderCreate";
import { CreateLeaveRequest } from "@/actions/adminActions";

export default function NewInboxRequestPage() {
  // const t = useTranslations("Admins");
  const [isSubmittable, setSubmittable] = useState(false);
  const [action1, setAction1] = useState(false);
  const [action2, setAction2] = useState(false);
  const [action3, setAction3] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);

  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest>({
    id: "",
    name: "",
    requestedStartDate: "",
    requestedEndDate: "",
    requestType: "",
    comment: "",
    managerComment: "",
    status: "PENDING",
    employeeId: "",
    createdAt: "",
    updatedAt: "",
    decidedBy: "",
    signature: "",
    employee: {
      id: "",
      firstName: "",
      lastName: "",
      image: "",
    },
  });

  // Check if any of the fields have changed for action fields
  useEffect(() => {
    if (leaveRequest.comment.length > 3) {
      setAction1(true);
    } else {
      setAction1(false);
    }
  }, [leaveRequest, leaveRequest.comment]);

  useEffect(() => {
    if (leaveRequest.requestedStartDate && leaveRequest.requestedEndDate) {
      setAction2(true);
    } else {
      setAction2(false);
    }
  }, [leaveRequest]);

  useEffect(() => {
    if (leaveRequest.requestType) {
      setAction3(true);
    } else {
      setAction3(false);
    }
  }, [leaveRequest]);

  // Check if all actions are completed before submitting
  useEffect(() => {
    if (action1 && action2 && action3) {
      setSubmittable(true);
    } else {
      setSubmittable(false);
    }
  }, [leaveRequest, action1, action2, action3]);
  // Handler for the server action to update the leave request
  const handlePendingEdit = async () => {
    console.log("edit pending");
    const formData = new FormData();
    formData.append("id", leaveRequest.id);
    formData.append("name", leaveRequest.name); // to update the name of the leave request
    formData.append("status", leaveRequest.status); // to update the status to pending
    formData.append("comment", leaveRequest.comment); // to add the comment to the leave request
    formData.append("employeeId", leaveRequest.employee.id); // to connect the leave request to the employee
    formData.append("requestType", leaveRequest.requestType); // to add the request type to the leave request
    formData.append("requestedStartDate", leaveRequest.requestedStartDate); // to add the start date to the leave request
    formData.append("requestedEndDate", leaveRequest.requestedEndDate); // to add the end date to the leave request
    const updateLeaveRequest = await CreateLeaveRequest(formData);
    console.log(updateLeaveRequest);
  };

  return (
    <Holds className="w-full h-full">
      <ReusableViewLayout
        custom={true}
        header={
          <RequestHeaderCreate
            userModalOpen={userModalOpen}
            setUserModelOpen={setUserModalOpen}
            leaveRequest={leaveRequest}
            setLeaveRequest={setLeaveRequest}
          />
        }
        mainHolds="h-full w-full flex flex-row row-span-5 col-span-2 bg-app-dark-blue px-4 py-2 rounded-[10px] gap-4"
        main={
          <RequestMainCreate
            leaveRequest={leaveRequest}
            setLeaveRequest={setLeaveRequest}
          />
        }
        footer={
          <RequestFooter
            SubmitButton={isSubmittable}
            handlePendingEdit={handlePendingEdit}
          />
        }
      />
    </Holds>
  );
}
