"use client";
import Spinner from "@/components/(animations)/spinner";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
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
  data: Record<string, string>;
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

export default function RTab({
  isManager,
  setActiveTab,
  activeTab,
}: {
  isManager: boolean;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  activeTab: number;
}) {
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
      <Holds className=" h-full w-full ">
        <Grids rows={"7"} gap={"5"} className="h-full w-full">
          <Holds className="row-start-1 row-end-8 h-full ">
            <Holds position={"row"} className="gap-x-1 h-fit">
              <NewTab
                onClick={() => setActiveTab(1)}
                isActive={activeTab === 1}
                isComplete={true}
                titleImage={"/formSelection.svg"}
                titleImageAlt={""}
                animatePulse={loading}
              >
                <Titles size={"h5"}>Form Selection</Titles>
              </NewTab>
              <NewTab
                onClick={() => setActiveTab(2)}
                isActive={activeTab === 2}
                isComplete={true}
                titleImage={"/submittedForms.svg"}
                titleImageAlt={""}
                animatePulse={loading}
              >
                <Titles size={"h5"}>Submitted Forms</Titles>
              </NewTab>
              {isManager && (
                <NewTab
                  onClick={() => setActiveTab(3)}
                  isActive={activeTab === 3}
                  isComplete={true}
                  titleImage={"/pendingForms.svg"}
                  titleImageAlt={""}
                  animatePulse={loading}
                >
                  <Titles size={"h5"}>Pending Forms</Titles>
                </NewTab>
              )}

              <NewTab
                onClick={() => setActiveTab(4)}
                isActive={activeTab === 4}
                isComplete={true}
                titleImage={"/pendingForms.svg"}
                titleImageAlt={""}
                animatePulse={loading}
              >
                <Titles size={"h5"}>Company Documents</Titles>
              </NewTab>
            </Holds>
            <Selects
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="text-center justify-center h-full"
            >
              <option value="all">Select A Filter</option>
              <option value="approved">Recently Approved</option>
              {employeeRequests.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.user.firstName} {employee.user.lastName}
                </option>
              ))}
            </Selects>
          </Holds>
          <Holds className="row-start-2 row-end-6 h-full w-full flex justify-center items-center  ">
            <Spinner size={50} />
          </Holds>
        </Grids>
      </Holds>
    );
  }

  return (
    <Holds className=" h-full w-full ">
      <Grids rows={"7"} gap={"5"} className="h-full w-full">
        <Holds className="row-start-1 row-end-8 h-full ">
          <Holds position={"row"} className="gap-x-1 h-fit">
            <NewTab
              onClick={() => setActiveTab(1)}
              isActive={activeTab === 1}
              isComplete={true}
              titleImage={"/formSelection.svg"}
              titleImageAlt={""}
              animatePulse={loading}
            >
              <Titles size={"h5"}>Form Selection</Titles>
            </NewTab>
            <NewTab
              onClick={() => setActiveTab(2)}
              isActive={activeTab === 2}
              isComplete={true}
              titleImage={"/submittedForms.svg"}
              titleImageAlt={""}
              animatePulse={loading}
            >
              <Titles size={"h5"}>Submitted Forms</Titles>
            </NewTab>
            {isManager && (
              <NewTab
                onClick={() => setActiveTab(3)}
                isActive={activeTab === 3}
                isComplete={true}
                titleImage={"/pendingForms.svg"}
                titleImageAlt={""}
                animatePulse={loading}
              >
                <Titles size={"h5"}>Pending Forms</Titles>
              </NewTab>
            )}

            <NewTab
              onClick={() => setActiveTab(4)}
              isActive={activeTab === 4}
              isComplete={true}
              titleImage={"/pendingForms.svg"}
              titleImageAlt={""}
              animatePulse={loading}
            >
              <Titles size={"h5"}>Company Documents</Titles>
            </NewTab>
          </Holds>
          <Holds background={"white"} className={`h-full rounded-t-none`}>
            <Contents width={"section"}>
              <Grids rows={"9"} className="h-full w-full pt-3 pb-5">
                <Holds className="row-start-1 row-end-2 w-full">
                  <Selects
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="text-center justify-center h-full"
                  >
                    <option value="all">Select A Filter</option>
                    <option value="approved">Approved</option>
                    {employeeRequests.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.user.firstName} {employee.user.lastName}
                      </option>
                    ))}
                  </Selects>
                </Holds>
                <Holds className="row-start-2 row-end-9 w-full">
                  {!sentContent || sentContent.length === 0 ? (
                    <Holds className=" h-full w-full flex justify-center items-center ">
                      <Contents width={"section"}>
                        <Texts size={"p6"} className="italic text-gray-500">
                          No forms or requests found or submitted.
                        </Texts>
                      </Contents>
                    </Holds>
                  ) : (
                    <Holds className="row-start-2 row-end-9 h-full w-full overflow-y-scroll no-scrollbar">
                      {sentContent.map((form) => {
                        const title =
                          form.formTemplate?.formType ||
                          form.formTemplate?.name; // Fallback if formTemplate is undefined

                        return (
                          <Holds key={form.id} className="pb-3">
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
                    </Holds>
                  )}
                </Holds>
                {hasMore && (
                  <Holds className="row-start-9 row-end-10 h-full w-full flex justify-center items-center ">
                    <Buttons onClick={handleLoadMore} disabled={loading}>
                      {loading ? "Loading..." : "Load More"}
                    </Buttons>
                  </Holds>
                )}
              </Grids>
            </Contents>
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
