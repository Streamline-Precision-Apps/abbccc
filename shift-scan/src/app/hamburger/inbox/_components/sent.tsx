"use client";
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
  title: string;
  formTemplateId: string;
  data: Record<string, any>;
  formTemplate: {
    name: string;
    formType: string;
  };
  status: FormStatus;
};

export default function STab() {
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [sentContent, setSentContent] = useState<SentContent[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSentContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/formSubmissions/${selectedFilter}`);
        const data = await response.json();
        setSentContent(data);
      } catch (err) {
        console.error("Error fetching sent content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSentContent();
  }, [selectedFilter]);

  if (loading) {
    return (
      <Holds
        background={"white"}
        className="rounded-t-none row-span-9 h-full w-full pt-5"
      >
        <Contents width={"section"}>
          <Grids rows={"9"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full">
              <Selects
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="text-center justify-center"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
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

  if (!sentContent || sentContent.length === 0) {
    return (
      <Holds
        background={"white"}
        className="rounded-t-none row-span-9 h-full w-full pt-5"
      >
        <Contents width={"section"}>
          <Grids rows={"10"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full ">
              <Selects
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="text-center justify-center"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </Selects>
            </Holds>
            <Titles size={"h4"}>No forms found or submitted.</Titles>
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
            <Holds className="row-start-1 row-end-2 h-full">
              <Selects
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="text-center justify-center"
              >
                <option value="all">Select A Filter</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </Selects>
            </Holds>

            <Holds className="row-start-2 row-end-11 h-full w-full overflow-y-scroll no-scrollbar">
              {sentContent.map((form) => {
                const title = form.title || form.formTemplate?.name;
                return (
                  <Holds key={form.id} className=" pb-5">
                    <Buttons
                      className="py-0.5 relative"
                      background={
                        form.status === "PENDING"
                          ? "orange"
                          : form.status === "APPROVED"
                          ? "green"
                          : "red"
                      }
                      onClick={() => {
                        router.push(
                          `/hamburger/inbox/formSubmission/${form.formTemplateId}?submissionId=${form.id}&status=${form.status}`
                        );
                      }}
                    >
                      <Titles size={"h3"}>{title}</Titles>
                      <Titles size={"h5"}>{form.formTemplate?.formType}</Titles>
                      <Images
                        titleImgAlt={"form Status"}
                        titleImg={
                          form.status === "PENDING"
                            ? "/Ongoing.svg"
                            : form.status === "APPROVED"
                            ? "/Checkmark.svg"
                            : "/statusReject.svg"
                        }
                        className="absolute w-8 h-8 top-4 right-5"
                      />
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
