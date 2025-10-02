"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function ContinueTimesheetCheck({
  id,
}: {
  id: number | undefined;
}) {
  const router = useRouter();

  useEffect(() => {
    const continueTimesheet = async () => {
      if (!id) return; // Don't make the request if ID is undefined

      try {
        const response = await fetch(`/api/continue-timesheet?id=${id}`).then(
          (res) => res.json(),
        );
        if (response.success) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error continuing timesheet:", error);
      }
    };
    continueTimesheet();
  }, [id]);

  return null; // This component does not render anything
}
