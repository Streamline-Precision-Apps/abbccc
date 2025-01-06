"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ReusableViewLayout } from "../../../personnel/@view/[employee]/_components/reusableViewLayout";
import { Images } from "@/components/(reusable)/images";
import { Grids } from "@/components/(reusable)/grids";
import { Inputs } from "@/components/(reusable)/inputs";

type LeaveRequest = {
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
    <Holds>
      <ReusableViewLayout
        custom={true}
        header={<RequestHeader leaveRequest={leaveRequest} />}
        mainHolds="h-full w-full flex flex-row row-span-6 col-span-2 bg-app-dark-blue px-4 py-2 rounded-[10px] gap-4"
        main={<></>}
        footer={<></>}
      />
    </Holds>
  );
}

export function RequestHeader({
  leaveRequest,
}: {
  leaveRequest: LeaveRequest;
}) {
  const t = useTranslations("Admins");
  return (
    <Holds className=" row-span-1 col-span-2 bg-white rounded-[10px] gap-4">
      <Grids cols={"10"} rows={"3"} className="w-full h-full px-2 py-4">
        {/* Image for employee*/}
        <Holds className="row-start-1 row-end-4 col-start-1 col-end-3 ">
          <Images
            className="w-full h-full rounded bg-cover bg-center"
            titleImg={"/person.svg"}
            titleImgAlt={"Employee Image"}
            size={"60"}
          />
        </Holds>
        {/* Input for employee name*/}
        <Holds className="row-start-1 row-end-4 col-start-3 col-end-7">
          <Inputs
            type={"text"}
            readOnly={true}
            name={"firstName"}
            className=" text-[20px] font-bold h-16"
            value={"Devun"}
          />
        </Holds>
        {/* Date request was submitted*/}
        <Holds className="row-start-4 row-end-5 col-start-3 col-end-6">
          <Texts
            position={"left"}
            text={"black"}
            size={"p6"}
            className="font-bold"
          >{`${t("DateCreated")}: ${new Date(
            leaveRequest.createdAt
          ).toLocaleString("en-US", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })}`}</Texts>
        </Holds>
        {/* Date request was submitted*/}
        <Holds className="row-start-4 row-end-5 col-start-9 col-end-11">
          <Texts
            position={"right"}
            text={"black"}
            size={"p6"}
            className="font-bold"
          >{`${t("EmployeeComment")}: ${new Date(
            leaveRequest.createdAt
          ).toLocaleString("en-US", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })}`}</Texts>
        </Holds>
      </Grids>
    </Holds>
  );
}
