"use client";

import Button from "@mui/material/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PageSelector() {
  const pathname = usePathname();
  console.log("Current pathname:", pathname);

  return (
    <div className="w-fit h-fit flex flex-row justify-end gap-2 mr-2 text-white">
      {!pathname.includes("/records/forms") && (
        <Button
          variant="contained"
          href="/admins/records/forms"
          className="bg-gray-900hover:bg-gray-800 rounded-lg p-2 "
        >
          Forms
        </Button>
      )}
      {!pathname.includes("/records/reports") && (
        <Button
          variant="contained" // Added variant for consistency
          href="/admins/records/reports"
          className="bg-gray-900 hover:bg-gray-800 rounded-lg p-2 "
        >
          Reports
        </Button>
      )}
      {!pathname.includes("/records/timesheets") && (
        <Button
          variant="contained" // Added variant for consistency
          href="/admins/records/timesheets"
          className="bg-gray-900 hover:bg-gray-800 rounded-lg p-2 "
        >
          Timesheets
        </Button>
      )}
    </div>
  );
}
