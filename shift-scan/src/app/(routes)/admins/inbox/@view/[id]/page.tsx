"use client";
import { Holds } from "@/components/(reusable)/holds";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ReusableViewLayout } from "../../../personnel/@view/[employee]/_components/reusableViewLayout";

import { RequestHeader } from "./_components/inboxHeader";

export type LeaveRequest = {
  id: string;
  requestedStartDate: string;
  requestedEndDate: string;
  requestType: string;
  comment: string;
  managerComment: string;
  status: string;
  employeeId: string;
  createdAt: string;
  updatedAt: string;
  decidedBy: string;
  employee: {
    firstName: string;
    lastName: string;
    image: string;
  };
};

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const t = useTranslations("Admins");
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest>({
    id: "",
    requestedStartDate: "",
    requestedEndDate: "",
    requestType: "",
    comment: "",
    managerComment: "",
    status: "",
    employeeId: "",
    createdAt: "",
    updatedAt: "",
    decidedBy: "",
    employee: {
      firstName: "",
      lastName: "",
      image: "",
    },
  });

  useEffect(() => {
    const fetchLeaveRequest = async () => {
      try {
        const leaveRequestRes = await fetch("/api/getTimeOffRequestById/" + id);
        const leaveRequestData = await leaveRequestRes.json();
        // const validatedLeaveRequest = leaveRequestSchema.parse(leaveRequestData);
        setLeaveRequest(leaveRequestData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLeaveRequest();
  }, [id, t]);

  return (
    <Holds className="w-full h-full">
      <ReusableViewLayout
        custom={true}
        header={
          <RequestHeader
            leaveRequest={leaveRequest}
            setLeaveRequest={setLeaveRequest}
          />
        }
        mainHolds="h-full w-full flex flex-row row-span-6 col-span-2 bg-app-dark-blue px-4 py-2 rounded-[10px] gap-4"
        main={<></>}
        footer={<></>}
      />
    </Holds>
  );
}
