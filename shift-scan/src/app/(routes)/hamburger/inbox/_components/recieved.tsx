"use client";
import { PullToRefresh } from "@/components/(animations)/pullToRefresh";
import Spinner from "@/components/(animations)/spinner";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useTranslations } from "next-intl";
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

export default function RTab({ isManager }: { isManager: boolean }) {
  const t = useTranslations("Hamburger-Inbox");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [employeeRequests, setEmployeeRequests] = useState<EmployeeRequests[]>(
    []
  );
  const router = useRouter();

  const fetchRequests = async (skip: number, reset: boolean = false) => {
    const response = await fetch(
      `/api/employeeRequests/${selectedFilter}?skip=${skip}&take=10`
    );
    return await response.json();
  };

  const {
    data: sentContent,
    isLoading,
    isInitialLoading,
    lastItemRef,
    refresh,
  } = useInfiniteScroll<SentContent>({
    fetchFn: fetchRequests,
    dependencies: [selectedFilter],
  });

  const handleRefresh = async () => {
    await refresh(); // Use the hook's refresh function
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

  return (
    <Holds background={"white"} className={`h-full rounded-t-none`}>
      <Grids rows={"10"} className="h-full w-full">
        <Holds className="row-start-1 row-end-2 h-fit w-full">
          <Contents width={"section"}>
            <Selects
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="text-center justify-center"
              disabled={isLoading}
            >
              <option value="all">{t("SelectAFilter")}</option>
              <option value="approved">{t("Approved")}</option>
              {employeeRequests.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.user.firstName} {employee.user.lastName}
                </option>
              ))}
            </Selects>
          </Contents>
        </Holds>
        {isInitialLoading ? (
          <Holds className="row-start-2 row-end-9 h-full w-full  border-t-black border-opacity-5 border-t-2">
            <Contents width={"section"}>
              <Holds className="h-full justify-center items-center">
                <Spinner />
              </Holds>
            </Contents>
          </Holds>
        ) : (
          <Holds className="row-start-2 row-end-11 h-full w-full overflow-y-scroll no-scrollbar border-t-black border-opacity-5 border-t-2">
            <PullToRefresh onRefresh={handleRefresh}>
              <Contents width={"section"}>
                {!sentContent ||
                  (sentContent.length === 0 && (
                    <Holds className="mt-2 h-full">
                      <Texts size={"p5"} className="italic text-gray-500">
                        {selectedFilter === "all"
                          ? t("NoTeamRequestsSubmittedOrFound")
                          : selectedFilter === "approved"
                          ? t("NoRecentlyApprovedRequests")
                          : t("NoRequestsFromSelectedEmployee")}
                      </Texts>
                      <Texts size={"p7"} className="italic text-gray-500">
                        {t("PleaseCheckBackLaterForNewRequests")}
                      </Texts>
                    </Holds>
                  ))}
                <Holds className="gap-y-4 pt-3 pb-5">
                  {sentContent.map((form, index) => {
                    const title =
                      form.formTemplate?.formType || form.formTemplate?.name; // Fallback if formTemplate is undefined
                    const isLastItem = index === sentContent.length - 1;
                    return (
                      <Buttons
                        key={form.id}
                        ref={isLastItem ? lastItemRef : null}
                        className="py-0.5 relative"
                        background={"lightBlue"}
                        onClick={() => {
                          router.push(
                            `/hamburger/inbox/formSubmission/${form.formTemplateId}?submissionId=${form.id}&status=${form.status}&approvingStatus=${isManager}&formApprover=TRUE`
                          );
                        }}
                        disabled={isLoading}
                      >
                        <Holds className="w-full h-full relative">
                          <Titles size={"h3"}>{title}</Titles>
                          <Titles size={"h7"}>
                            {form.user.firstName + " " + form.user.lastName}
                          </Titles>
                        </Holds>
                      </Buttons>
                    );
                  })}
                  {isLoading && (
                    <Holds className="flex justify-center py-4">
                      <Spinner />
                    </Holds>
                  )}
                </Holds>
              </Contents>
            </PullToRefresh>
          </Holds>
        )}
      </Grids>
    </Holds>
  );
}
