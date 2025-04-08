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
  data: Record<string, string>;
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
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const fetchSentContent = async (skip: number, reset: boolean = false) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/formSubmissions/${selectedFilter}?skip=${skip}&take=10`
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

        // Check if there are more items to fetch
        if (data.length < 5) {
          setHasMore(false); // No more items to fetch
        }
      } else {
        setHasMore(false); // No more items to fetch
      }
    } catch (err) {
      console.error("Error fetching sent content:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset states when the filter changes
    setSentContent([]);
    setSkip(0);
    setHasMore(true); // Reset hasMore when the filter changes
    fetchSentContent(0, true); // Fetch initial data for the new filter
  }, [selectedFilter]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchSentContent(skip);
    }
  };

  if (loading) {
    return (
      <Holds
        background={"white"}
        className="rounded-t-none row-span-9 h-full w-full pt-5"
      >
        <Contents width={"section"}>
          <Grids rows={"9"} gap={"4"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full px-2">
              <Selects
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="text-center justify-center h-full"
              >
                <option value="all">Select A Filter</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </Selects>
            </Holds>

            <Holds className="row-start-2 row-end-6 h-full w-full flex justify-center items-center ">
              <Spinner />
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
          <Grids rows={"9"} gap={"4"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full px-2 ">
              <Selects
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="text-center justify-center h-full"
              >
                <option value="all">Select A Filter</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </Selects>
            </Holds>
            <Holds className="row-start-2 row-end-3 pb-5 h-full w-full flex justify-center items-center ">
              <Titles size={"h4"}>No forms found or submitted.</Titles>
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
        <Holds className="h-full w-full ">
          <Grids rows={"9"} gap={"4"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full px-2">
              <Selects
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="text-center justify-center h-full"
              >
                <option value="all">Select A Filter</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </Selects>
            </Holds>

            <Holds className="row-start-2 row-end-9 h-full w-full pb-5 overflow-y-scroll no-scrollbar">
              {sentContent.map((form) => {
                const title = form.title || form.formTemplate?.name;
                return (
                  <Holds key={form.id} className="px-2 pb-5">
                    <Buttons
                      className="py-1 relative"
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
                        className="absolute w-7 h-7 top-[50%] translate-y-[-50%] right-5"
                      />
                    </Buttons>
                  </Holds>
                );
              })}
            </Holds>
            {hasMore && (
              <Holds className="row-start-9 row-end-10 h-full w-full flex justify-center items-center ">
                <Buttons onClick={handleLoadMore} disabled={loading}>
                  {loading ? "Loading..." : "Load More"}
                </Buttons>
              </Holds>
            )}
          </Grids>
        </Holds>
      </Contents>
    </Holds>
  );
}
