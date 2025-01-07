"use client";
import { Holds } from "@/components/(reusable)/holds";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ReusableViewLayout } from "../../../personnel/@view/[employee]/_components/reusableViewLayout";

import { LeaveRequest } from "@/lib/types";
import { UpdateLeaveRequest } from "@/actions/adminActions";
import { useSession } from "next-auth/react";
import { RequestFooter } from "../[id]/_components/inboxFooter";
import { RequestHeader } from "../[id]/_components/inboxHeader";
import { RequestMainApproved } from "../[id]/_components/inboxMainApproved";
import { RequestMainDenied } from "../[id]/_components/inboxMainDenied";
import { RequestMain } from "../[id]/_components/inboxMainPending";
import { RequestMainCreate } from "../[id]/_components/inboxMainCreate";
import { RequestHeaderCreate } from "../[id]/_components/inboxHeaderCreate";
import { NModals } from "@/components/(reusable)/newmodals";

export default function Page() {
  const t = useTranslations("Admins");
  const [isSubmittable, setSubmittable] = useState(false);
  const [action1, setAction1] = useState(false);
  const [action2, setAction2] = useState(false);
  const [action3, setAction3] = useState(false);
  const [isSignatureShowing, setIsSignatureShowing] = useState(false);
  const session = useSession();
  const user = session.data?.user.firstName + " " + session.data?.user.lastName;
  const [signature, setSignature] = useState("");
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [initialLeaveRequest, setInitialLeaveRequest] = useState<LeaveRequest>({
    id: "",
    requestedStartDate: "",
    requestedEndDate: "",
    requestType: "",
    comment: "",
    managerComment: "",
    status: "APPROVED",
    employeeId: "",
    createdAt: "",
    updatedAt: "",
    decidedBy: "",
    signature: "",
    employee: {
      firstName: "",
      lastName: "",
      image: "",
    },
  });
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest>({
    id: "",
    requestedStartDate: "",
    requestedEndDate: "",
    requestType: "",
    comment: "",
    managerComment: "",
    status: "APPROVED",
    employeeId: "",
    createdAt: "",
    updatedAt: "",
    decidedBy: "",
    signature: "",
    employee: {
      firstName: "",
      lastName: "",
      image: "",
    },
  });

  useEffect(() => {
    const fetchSignature = async () => {
      const response = await fetch("/api/getUserSignature");
      const json = await response.json();
      setSignature(json.signature);
    };
    fetchSignature();
    console.log(signature);
  }, [signature]);

  // Check if any of the fields have changed for action fields
  useEffect(() => {
    if (initialLeaveRequest?.managerComment !== leaveRequest.managerComment) {
      setAction1(true);
    }
  }, [leaveRequest.managerComment, leaveRequest]);

  useEffect(() => {
    if (leaveRequest.status !== initialLeaveRequest.status) {
      setAction2(true);
    }
  }, [leaveRequest.status, leaveRequest]);

  useEffect(() => {
    if (isSignatureShowing) {
      setAction3(true);
    }
  }, [isSignatureShowing]);

  // Check if all actions are completed before submitting
  useEffect(() => {
    if (action1 && action2 && action3) {
      setSubmittable(true);
    }
  }, [leaveRequest, action1, action2, action3]);
  // Handler for the server action to update the leave request
  const handlePendingEdit = async () => {
    console.log("edit pending");
    const formData = new FormData();
    formData.append("id", leaveRequest.id);
    formData.append("status", leaveRequest.status);
    formData.append("managerComment", leaveRequest.managerComment);
    formData.append("decidedBy", user);
    formData.append("signature", signature);
    const updateLeaveRequest = await UpdateLeaveRequest(formData);
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
            isSignatureShowing={isSignatureShowing}
            setIsSignatureShowing={setIsSignatureShowing}
            signature={signature}
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
