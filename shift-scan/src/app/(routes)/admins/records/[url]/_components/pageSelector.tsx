"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PageSelector() {
  const pathname = usePathname();
  console.log("Current pathname:", pathname);

  return (
    <div className="w-fit h-fit flex flex-row justify-end gap-2 mr-2 text-white">
      {!pathname.includes("/records/forms") && (
        <Button asChild>
          <Link
            href="/admins/records/forms"
            className="bg-gray-900 hover:bg-gray-800 rounded-lg p-2 "
          >
            Forms
          </Link>
        </Button>
      )}
      {!pathname.includes("/records/reports") && (
        <Button asChild>
          <Link
            href="/admins/records/reports"
            className="bg-gray-900 hover:bg-gray-800 rounded-lg p-2 "
          >
            Reports
          </Link>
        </Button>
      )}
      {!pathname.includes("/records/timesheets") && (
        <Button asChild>
          <Link
            href="/admins/records/timesheets"
            className="bg-gray-900 hover:bg-gray-800 rounded-lg p-2 "
          >
            Timesheets
          </Link>
        </Button>
      )}
    </div>
  );
}
