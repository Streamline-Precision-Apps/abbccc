"use client";
import Spinner from "@/components/(animations)/spinner";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
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
  title: string;
  formTemplateId: string;
  data: Record<string, string>;
  formTemplate: {
    name: string;
    formType: string;
  };
  status: FormStatus;
};

export default function STab({
  setActiveTab,
  activeTab,
  isManager,
}: {
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  activeTab: number;
  isManager: boolean;
}) {
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
      <Holds className=" h-full w-full">
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
            <Holds
              background={"white"}
              className="h-full w-full rounded-t-none"
            >
              <Grids rows={"9"} className="h-full w-full">
                <Holds className="row-start-1 row-end-2  w-full">
                  <Contents width={"section"}>
                    <Selects
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="text-center justify-center "
                    >
                      <option value="all">Select A Filter</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="denied">Denied</option>
                    </Selects>
                  </Contents>
                </Holds>
                <Holds className="row-start-2 row-end-9 h-full w-full">
                  <Contents width={"section"}>
                    <Holds className="h-full justify-center items-center">
                      <Spinner />
                    </Holds>
                  </Contents>
                </Holds>
              </Grids>
            </Holds>
          </Holds>
        </Grids>
      </Holds>
    );
  }

  if (!sentContent || sentContent.length === 0) {
    return (
      <Holds className=" h-full w-full">
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
              <Grids rows={"9"} className="h-full w-full">
                <Holds className="row-start-1 row-end-2  w-full">
                  <Contents width={"section"}>
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
                  </Contents>
                </Holds>
                <Holds className="row-start-2 row-end-9 h-full w-full">
                  <Contents width={"section"}>
                    <Holds className="h-full justify-center items-center">
                      <Texts size={"p5"} className="italic text-gray-500">
                        {selectedFilter === "denied"
                          ? "No denied forms submitted"
                          : selectedFilter === "pending"
                          ? "No pending forms submitted"
                          : selectedFilter === "approved"
                          ? "No approved forms submitted"
                          : "No submitted forms"}
                      </Texts>
                    </Holds>
                  </Contents>
                </Holds>
              </Grids>
            </Holds>
          </Holds>
        </Grids>
      </Holds>
    );
  }

  return (
    <Holds className="h-full w-full">
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
          <Holds background={"white"} className={`h-full rounded-t-none `}>
            <Grids rows={"9"} className="h-full w-full">
              <Holds className="row-start-1 row-end-2  w-full">
                <Contents width={"section"}>
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
                </Contents>
              </Holds>
              <Holds className="row-start-2 row-end-9 h-full w-full pb-5 overflow-y-scroll no-scrollbar">
                <Contents width={"section"}>
                  {sentContent.map((form) => {
                    const title = form.title || form.formTemplate?.name;
                    return (
                      <Holds key={form.id} className="pb-5">
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
                          <Titles size={"h5"}>
                            {form.formTemplate?.formType}
                          </Titles>
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
                </Contents>
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
        </Holds>
      </Grids>
    </Holds>
  );
}
