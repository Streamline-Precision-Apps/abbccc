"use client";
import Spinner from "@/components/(animations)/spinner";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { Titles } from "@/components/(reusable)/titles";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

enum FormStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  DRAFT = "DRAFT",
}

type SentContent = {
  id: string;
  formTemplateId: string;
  status: FormStatus;
  data: Record<string, any>;
  formTemplate: {
    name: string;
    formType: string;
  };
  user: {
    firstName: string;
    lastName: string;
  };
  approvals: {
    approver: {
      firstName: string;
      lastName: string;
    };
  }[];
};

type EmployeeRequests = {
  id: string;
  formTemplateId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

export default function RTab({ isManager }: { isManager: boolean }) {
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [sentContent, setSentContent] = useState<SentContent[]>([]);
  const [employeeRequests, setEmployeeRequests] = useState<EmployeeRequests[]>(
    []
  );
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();

  const fetchRequests = async (skip: number, reset: boolean = false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/employeeRequests/${selectedFilter}?skip=${skip}&take=10`
      );
      const data = await response.json();
      if (data.length > 0) {
        if (reset) {
          // Reset the content if it's a new filter
          setSentContent(data);
        } else {
          // Append new data to existing content
          setSentContent((prev) => [...prev, ...data]);
        }
        setSkip((prev) => prev + 5);
      } else {
        setHasMore(false); // No more requests to load
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset states when the filter changes
    setSentContent([]);
    setSkip(0);
    fetchRequests(0, true); // Fetch initial data for the new filter
  }, [selectedFilter]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchRequests(skip);
    }
  };

  useEffect(() => {
    const fetchEmployeeRequests = async () => {
      try {
        const response = await fetch(`/api/getEmployees`);
        const data = await response.json();
        setEmployeeRequests(data);
      } catch (err) {
        console.error("Error fetching employee requests:", err);
      }
    };

    fetchEmployeeRequests();
  }, []);

  if (loading) {
    return (
      <Holds
        background={"white"}
        className="rounded-t-none row-span-9 h-full w-full pt-5 "
      >
        <Contents width={"section"}>
          <Grids rows={"10"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full px-2">
              <Selects
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="text-center justify-center"
              >
                <option value="all">All</option>
                <option value="approved">Recently Approved</option>
                {employeeRequests.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.user.firstName} {employee.user.lastName}
                  </option>
                ))}
              </Selects>
            </Holds>
            <Holds className="row-start-2 row-end-6 h-full w-full flex justify-center items-center ">
              <Spinner size={50} />
            </Holds>
          </Grids>
        </Contents>
      </Holds>
    );
  }

  return (
    <Holds
      background={"white"}
      className="rounded-t-none row-span-9 h-full w-full pt-5"
    >
      <Contents width={"section"}>
        <Holds className="h-full w-full">
          <Grids rows={"10"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full px-2 ">
              <Selects
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="text-center justify-center"
              >
                <option value="all">All</option>
                <option value="approved">Approved</option>
                {employeeRequests.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.user.firstName} {employee.user.lastName}
                  </option>
                ))}
              </Selects>
            </Holds>
            {!sentContent || sentContent.length === 0 ? (
              <Titles size={"h4"}>No forms found or submitted.</Titles>
            ) : (
              <Holds className="row-start-2 row-end-11 h-full w-full overflow-y-scroll no-scrollbar">
                {sentContent.map((form) => {
                  const title =
                    form.formTemplate?.formType || form.formTemplate?.name; // Fallback if formTemplate is undefined

                  return (
                    <Holds key={form.id} className="px-2 pb-5">
                      <Buttons
                        className="py-0.5 relative"
                        background={"lightBlue"}
                        onClick={() => {
                          router.push(
                            `/hamburger/inbox/formSubmission/${form.formTemplateId}?submissionId=${form.id}&status=${form.status}&approvingStatus=${isManager}&formApprover=TRUE`
                          );
                        }}
                      >
                        <Titles size={"h4"}>{title}</Titles>
                        <Titles size={"h6"}>
                          {form.user.firstName + " " + form.user.lastName}
                        </Titles>
                      </Buttons>
                    </Holds>
                  );
                })}
                {hasMore && (
                  <Holds className="h-full w-full flex justify-center items-center px-2">
                    <Buttons onClick={handleLoadMore} disabled={loading}>
                      {loading ? "Loading..." : "Load More"}
                    </Buttons>
                  </Holds>
                )}
              </Holds>
            )}
          </Grids>
        </Holds>
      </Contents>
    </Holds>
  );
}
