"use client";
import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import Spinner from "@/components/(animations)/spinner";
import Link from "next/link";

type DashboardData = {
  clockedInUsers: number;
  totalPendingTimesheets: number;
  pendingForms: number;
  equipmentAwaitingApproval: number;
  jobsitesAwaitingApproval: number;
};
export default function Admins() {
  const { setOpen, open } = useSidebar();
  const [data, setData] = useState<DashboardData | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/getDashboard");
      const json = await response.json();
      setData(json);
    };
    fetchData();
  }, []);

  return (
    <div className="w-full p-4 grid grid-rows-[3rem_1fr] gap-4">
      {/* Main content goes here */}
      <div className="flex flex-row gap-5 h-full max-h-[3rem] row-span-1">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 p-0 hover:bg-slate-500 hover:bg-opacity-20 ${
              open ? "bg-slate-500 bg-opacity-20" : "bg-app-blue "
            }`}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <img
              src={open ? "/condense-white.svg" : "/condense.svg"}
              alt="logo"
              className="w-4 h-auto object-contain "
            />
          </Button>
          <p className="text-white text-lg">Admin Dashboard</p>
        </div>
      </div>
      <div className="h-full w-full row-span-1">
        <p className="text-sm font-bold text-white pb-2">Approval Status</p>
        <div className="w-full h-[120px]  grid grid-cols-5 gap-10 justify-center">
          <div className="gap-2 h-full bg-white bg-opacity-50 row-span-1 col-span-1 rounded-lg p-4  flex flex-col">
            <p className="text-lg">Active Employees</p>
            {data ? (
              <li className="text-sm list-disc marker:text-white">
                {data.clockedInUsers}
                <span className="text-sm text-gray-600 ml-2">
                  {` Active on the app`}
                </span>
              </li>
            ) : (
              <Spinner size={20} />
            )}
          </div>
          <div className="gap-2 h-full bg-white bg-opacity-50 row-span-1 col-span-1 rounded-lg p-4  flex flex-col">
            <p className="text-lg">Timesheets</p>
            {data ? (
              <li className="text-sm list-disc marker:text-white">
                {data.totalPendingTimesheets}
                <span className="text-sm text-gray-600 ml-2">{`pending`}</span>
              </li>
            ) : (
              <Spinner size={20} />
            )}
            <Button variant={"outline"} className="mt-2">
              <Link href="/admins/timesheets">
                <div className="flex items-center">
                  <img
                    src="/statusApproved.svg"
                    alt="View"
                    className="w-4 h-2 mr-2"
                  />
                  Review Timesheets
                </div>
              </Link>
            </Button>
          </div>
          <div className="gap-2 h-full bg-white bg-opacity-50 row-span-1 col-span-1 rounded-lg p-4  flex flex-col">
            <p className="text-lg">Forms</p>
            {data ? (
              <li className="text-sm list-disc marker:text-white">
                {data.pendingForms}
                <span className="text-sm text-gray-600 ml-2">{`pending`}</span>
              </li>
            ) : (
              <Spinner size={20} />
            )}
            <Button variant={"outline"} className="mt-2">
              <Link href="/admins/forms">
                <div className="flex items-center">
                  <img
                    src="/statusApproved.svg"
                    alt="View"
                    className="w-4 h-2 mr-2"
                  />
                  Review Forms
                </div>
              </Link>
            </Button>
          </div>

          <div className="gap-2 h-full bg-white bg-opacity-50 row-span-1 col-span-1 rounded-lg p-4  flex flex-col">
            <p className="text-lg">Jobsites</p>
            {data ? (
              <li className="text-sm list-disc marker:text-white">
                {data.jobsitesAwaitingApproval}
                <span className="text-sm text-gray-600 ml-2">{`pending`}</span>
              </li>
            ) : (
              <Spinner size={20} />
            )}
            <Button variant={"outline"} className="mt-2">
              <Link href="/admins/jobsites">
                <div className="flex items-center">
                  <img
                    src="/statusApproved.svg"
                    alt="View"
                    className="w-4 h-2 mr-2"
                  />
                  Review Jobsites
                </div>
              </Link>
            </Button>
          </div>
          <div className="gap-2 h-full bg-white bg-opacity-50 row-span-1 col-span-1 rounded-lg p-4  flex flex-col">
            <p className="text-lg">Equipment</p>
            {data ? (
              <li className="text-sm list-disc marker:text-white">
                {data.equipmentAwaitingApproval}
                <span className="text-sm text-gray-600 ml-2">{`pending`}</span>
              </li>
            ) : (
              <Spinner size={20} />
            )}
            <Button variant={"outline"} className="mt-2">
              <Link href="/admins/equipment">
                <div className="flex items-center">
                  <img
                    src="/statusApproved.svg"
                    alt="View"
                    className="w-4 h-2 mr-2"
                  />
                  Review Equipment
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
