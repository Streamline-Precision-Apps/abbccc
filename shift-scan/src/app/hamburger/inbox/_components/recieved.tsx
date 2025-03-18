"use client";
import Spinner from "@/components/(animations)/spinner";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [sentContent, setSentContent] = useState<SentContent[]>([]);
  const [employeeRequests, setEmployeeRequests] = useState<EmployeeRequests[]>(
    []
  );
  const [approver, setApprover] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchSentContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/employeeRequests/${selectedFilter}`);
        const data = await response.json();
        setSentContent(data);

        const names = data.map((item: SentContent) =>
          item.approvals.map(
            (approval) =>
              approval.approver.firstName + "-" + approval.approver.lastName
          )
        );
        if (names.length > 0) {
          setApprover(names);
        }
      } catch (err) {
        console.error("Error fetching sent content:", err);
        setError("An error occurred while fetching sent content");
      } finally {
        setLoading(false);
      }
    };

    fetchSentContent();
  }, [selectedFilter]);

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
        <Contents>
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
            <Holds className="row-start-2 row-end-10 h-full w-full flex justify-center items-center ">
              <Spinner size={50} />
            </Holds>
          </Grids>
        </Contents>
      </Holds>
    );
  }

  if (error) {
    return (
      <Holds
        background={"white"}
        className="rounded-t-none row-span-9 h-full w-full pt-10"
      >
        <Texts size={"p4"}>{error}</Texts>
      </Holds>
    );
  }

  return (
    <Holds
      background={"white"}
      className="rounded-t-none row-span-9 h-full w-full pt-5"
    >
      <Contents>
        <Holds className="h-full">
          <Grids rows={"10"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full px-2">
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
              <Holds className="row-start-2 row-end-11 h-full w-full overflow-y-scroll no-scrollbar px-2">
                {sentContent.map((form) => {
                  const title =
                    form.formTemplate?.formType || form.formTemplate?.name; // Fallback if formTemplate is undefined

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
          </Grids>
        </Holds>
      </Contents>
    </Holds>
  );
}
