"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import Spinner from "@/components/(animations)/spinner";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeaderContainer } from "./_pages/PageHeaderContainer";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const initialLoad = useRef(true);
  const fetchData = useCallback(async () => {
    try {
      if (initialLoad.current) {
        setIsLoading(true);
        initialLoad.current = false;
      }
      setIsRefreshing(true);
      console.log("🔄 Manual data refresh triggered");
      const response = await fetch("/api/getDashboard");
      const json = await response.json();
      setData(json);
      console.log("✅ Data refresh complete");
    } catch (error) {
      console.error("❌ Error refreshing data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="w-full p-4 grid grid-rows-[3rem_1fr] gap-4">
      {/* Main content goes here */}
      <PageHeaderContainer
        loading={isRefreshing}
        headerText="Admin Dashboard"
        descriptionText="Quick Actions - review pending tasks & keep track of new entries."
        refetch={() => {
          fetchData();
        }}
      />

      <ScrollArea className="h-full max-h-[calc(100vh-6rem)] w-full row-span-1">
        <div className="">
          <div className="w-full flex flex-row flex-wrap gap-4 md:gap-6 lg:gap-10 justify-center md:justify-center">
            <div className="gap-2 h-[160px] bg-white bg-opacity-50 rounded-lg p-4 flex flex-col flex-1 min-w-[280px] lg:max-w-[300px] md:max-w-[300px]">
              <p className="text-lg">Active Employees</p>
              {data && !isRefreshing ? (
                <li className="text-sm list-disc marker:text-white">
                  {data.clockedInUsers}
                  <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                    {` Active on the app`}
                  </span>
                </li>
              ) : isLoading || isRefreshing ? (
                <Spinner size={20} />
              ) : (
                <p className="text-sm text-gray-600">Failed to load data</p>
              )}
            </div>
            <div className="gap-2 h-[160px] bg-white bg-opacity-50 rounded-lg p-4 flex flex-col flex-1 min-w-[280px] lg:max-w-[300px] md:max-w-[300px]">
              <p className="text-lg">Timesheets</p>
              {data && !isRefreshing ? (
                <li className="text-sm list-disc marker:text-white">
                  {data.totalPendingTimesheets}
                  <span className="text-sm text-gray-600 ml-2">{`pending`}</span>
                </li>
              ) : isLoading || isRefreshing ? (
                <Spinner size={20} />
              ) : (
                <p className="text-sm text-gray-600">Failed to load data</p>
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
            <div className="gap-2 h-[160px] bg-white bg-opacity-50 rounded-lg p-4 flex flex-col flex-1 min-w-[280px] lg:max-w-[300px] md:max-w-[300px]">
              <p className="text-lg">Forms</p>
              {data && !isRefreshing ? (
                <li className="text-sm list-disc marker:text-white">
                  {data.pendingForms}
                  <span className="text-sm text-gray-600 ml-2">{`pending`}</span>
                </li>
              ) : isLoading || isRefreshing ? (
                <Spinner size={20} />
              ) : (
                <p className="text-sm text-gray-600">Failed to load data</p>
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

            <div className="gap-2 h-[160px] bg-white bg-opacity-50 rounded-lg p-4 flex flex-col flex-1 min-w-[280px] lg:max-w-[300px] md:max-w-[300px]">
              <p className="text-lg">Jobsites</p>
              {data && !isRefreshing ? (
                <li className="text-sm list-disc marker:text-white">
                  {data.jobsitesAwaitingApproval}
                  <span className="text-sm text-gray-600 ml-2">{`pending`}</span>
                </li>
              ) : isLoading || isRefreshing ? (
                <Spinner size={20} />
              ) : (
                <p className="text-sm text-gray-600">Failed to load data</p>
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
            <div className="gap-2 h-[160px] bg-white bg-opacity-50 rounded-lg p-4 flex flex-col flex-1 min-w-[280px] lg:max-w-[300px] md:max-w-[300px]">
              <p className="text-lg">Equipment</p>
              {data && !isRefreshing ? (
                <li className="text-sm list-disc marker:text-white">
                  {data.equipmentAwaitingApproval}
                  <span className="text-sm text-gray-600 ml-2">{`pending`}</span>
                </li>
              ) : isLoading || isRefreshing ? (
                <Spinner size={20} />
              ) : (
                <p className="text-sm text-gray-600">Failed to load data</p>
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
      </ScrollArea>
    </div>
  );
}
