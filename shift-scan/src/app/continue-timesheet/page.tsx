import { redirect } from "next/navigation";
import TimesheetContinueClient from "@/components/TimesheetContinueClient";

type SearchParams = {
  timesheetId: string;
  workType: string;
  jobsiteCode: string;
  jobsiteName: string;
  costCode: string;
  tascoLaborType?: string;
  tascoEquipmentQrId?: string;
  truckingLaborType?: string;
  truckingEquipmentQrId?: string;
  truckingStartingMileage?: string;
};

export default async function ContinueTimesheetPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  try {
    // Await the searchParams Promise
    const params = await searchParams;
    
    // Validate required parameters
    if (!params.timesheetId || !params.workType || !params.jobsiteCode || !params.jobsiteName || !params.costCode) {
      console.error("Missing required timesheet parameters");
      redirect("/dashboard");
    }

    // Prepare data for the client component
    const timesheetData = {
      timesheetId: params.timesheetId,
      workType: params.workType,
      jobsite: {
        code: params.jobsiteCode,
        name: params.jobsiteName,
      },
      costCode: params.costCode,
      tascoLog: params.tascoLaborType ? {
        laborType: params.tascoLaborType,
        equipmentQrId: params.tascoEquipmentQrId,
      } : undefined,
      truckingLog: params.truckingLaborType ? {
        laborType: params.truckingLaborType,
        equipmentQrId: params.truckingEquipmentQrId,
        startingMileage: params.truckingStartingMileage ? Number(params.truckingStartingMileage) : undefined,
      } : undefined,
    };

    // Return the client component that will handle the API call and redirect
    return <TimesheetContinueClient data={timesheetData} />;
  } catch (error) {
    console.error("Failed to process timesheet continuation:", error);
    // Fallback redirect to dashboard if there's any error
    redirect("/dashboard");
  }
}
