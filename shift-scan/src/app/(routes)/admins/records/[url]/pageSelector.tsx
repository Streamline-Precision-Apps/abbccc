"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PageSelector() {
  const pathname = usePathname();
  console.log("Current pathname:", pathname);

  return (
    <div className="w-fit h-fit flex flex-row justify-end gap-2 mr-2 text-white">
      {!pathname.includes("/records/forms") && (
        <Link
          href="/admins/records/forms"
          className="bg-gray-900 rounded-lg p-2 "
        >
          Forms
        </Link>
      )}
      {!pathname.includes("/records/reports") && (
        <Link
          href="/admins/records/reports"
          className="bg-gray-900 rounded-lg p-2 "
        >
          Reports
        </Link>
      )}
      {!pathname.includes("/records/timesheets") && (
        <Link
          href="/admins/records/timesheets"
          className="bg-gray-900 rounded-lg p-2 "
        >
          Timesheets
        </Link>
      )}
    </div>
  );
}
