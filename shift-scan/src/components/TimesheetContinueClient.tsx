"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type TimesheetData = {
  timesheetId: string;
  workType: string;
  jobsite: {
    code: string;
    name: string;
  };
  costCode: string;
  tascoLog?: {
    laborType?: string;
    equipmentQrId?: string;
  };
  truckingLog?: {
    laborType?: string;
    equipmentQrId?: string;
    startingMileage?: number;
  };
};

export default function TimesheetContinueClient({ data }: { data: TimesheetData }) {
  const router = useRouter();

  useEffect(() => {
    const setCookiesAndRedirect = async () => {
      try {
        const response = await fetch("/api/set-timesheet-cookies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to set cookies");
        }

        // Redirect to dashboard after cookies are set
        router.replace("/dashboard");
      } catch (error) {
        console.error("Failed to continue timesheet:", error);
        // Fallback redirect to dashboard
        router.replace("/dashboard");
      }
    };

    setCookiesAndRedirect();
  }, [data, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Continuing your timesheet...</p>
      </div>
    </div>
  );
}
