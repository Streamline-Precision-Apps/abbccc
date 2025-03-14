"use client";
import Employee from "@/app/(routes)/admins/personnel/@view/[employee]/page";
import SlidingDiv from "@/components/(animations)/slideDelete";
import Spinner from "@/components/(animations)/spinner";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
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
  data: Record<string, any>;
  formTemplate: {
    name: string;
    formType: string;
  };
  status: FormStatus;
};

type EmployeeRequests = {
  id: string;
  firstName: string;
  lastName: string;
  formTemplateId: string;
};

export default function RTab() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [sentContent, setSentContent] = useState<SentContent[]>([]);
  const [employeeRequests, setEmployeeRequests] = useState<EmployeeRequests[]>(
    []
  );
  const router = useRouter();

  useEffect(() => {
    const fetchSentContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/teamSubmissions`);
        const data = await response.json();
        setSentContent(data);
      } catch (err) {
        console.error("Error fetching sent content:", err);
        setError("An error occurred while fetching sent content");
      } finally {
        setLoading(false);
      }
    };

    fetchSentContent();
  }, []);

  useEffect(() => {
    const fetchEmployeeRequests = async () => {
      try {
        const response = await fetch(`/api/employeeRequests`);
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
        className="rounded-t-none row-span-9 h-full w-full "
      >
        <Holds className="flex justify-center items-center h-3/4">
          <Spinner size={50} />
        </Holds>
      </Holds>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!sentContent || sentContent.length === 0) {
    return (
      <Holds
        background={"white"}
        className="rounded-t-none row-span-9 h-full w-full pt-10"
      >
        <Titles size={"h4"}>No forms found or submitted.</Titles>
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
          <Grids rows={"9"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full px-2">
              <Selects
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="text-center justify-center"
              >
                <option value="all">All</option>
                {employeeRequests.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ))}
              </Selects>
            </Holds>

            <Holds className="row-start-2 row-end-10 h-full w-full overflow-y-scroll no-scrollbar">
              {sentContent.map((form) => {
                const title =
                  form.data["title_(optional)"] || form.formTemplate?.name; // Fallback if formTemplate is undefined

                return (
                  <Holds key={form.id} className="px-2">
                    <Buttons
                      className="py-2 relative"
                      background={"lightBlue"}
                      onClick={() => {
                        router.push(
                          `/hamburger/inbox/formSubmission/${form.formTemplateId}?submissionId=${form.id}&status=${form.status}&manger={managerId}`
                        );
                      }}
                    >
                      {title && <Titles size={"h3"}>{title}</Titles>}
                      <Titles size={"h5"}>{form.formTemplate?.formType}</Titles>
                    </Buttons>
                  </Holds>
                );
              })}
            </Holds>
          </Grids>
        </Holds>
      </Contents>
    </Holds>
  );
}
