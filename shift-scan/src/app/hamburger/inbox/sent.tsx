"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { Titles } from "@/components/(reusable)/titles";
import { sentContent } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { z } from "zod";

// Define Zod schema for sent content
const sentContentSchema = z.object({
  id: z.string(),
  requestType: z.string(),
  status: z.enum(["APPROVED", "PENDING", "DENIED"]),
  requestedStartDate: z.string(),
  requestedEndDate: z.string(),
});

export default function STab() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all"); // Default to "all"

  const [sentContent, setSentContent] = useState<sentContent[]>([]);

  useEffect(() => {
    const fetchSentContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/getTimeoffRequests`);
        const data = await response.json();

        console.log(data);
        const validatedData = data.map((item: typeof sentContentSchema) => {
          return sentContentSchema.parse(item);
        });

        setSentContent(validatedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching sent content:", err);
        setError("An error occurred while fetching sent content");
        setLoading(false);
      }
    };

    fetchSentContent();
  }, []);

  // Filter sentContent based on selectedFilter
  const filteredContent = sentContent.filter((item) => {
    if (selectedFilter === "all") return true;
    return item.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <Holds background={"white"} className="rounded-t-none row-span-9 h-full">
      <Contents width={"section"}>
        <Holds className="pt-5 h-full  ">
          <Grids rows={"9"}>
            {/* Select Dropdown for Filtering */}
            <Selects
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="text-center h-full"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
            </Selects>

            {/* Render Filtered Content */}
            <Holds className="row-start-2 row-end-9 h-full overflow-y-scroll no-scrollbar">
              {filteredContent.map((item) => (
                <Holds key={item.id} className="col-span-4 mt-5">
                  <Buttons
                    background={
                      item.status === "APPROVED"
                        ? "green"
                        : item.status === "PENDING"
                        ? "orange"
                        : "red"
                    }
                    href={
                      item.status === "APPROVED"
                        ? `/hamburger/inbox/sent/approved/${item.id}`
                        : item.status === "DENIED"
                        ? `/hamburger/inbox/sent/denied/${item.id}`
                        : `/hamburger/inbox/sent/${item.id}`
                    }
                    size={"90"}
                  >
                    <Titles>{item.requestType}</Titles>
                    {new Date(item.requestedStartDate).toLocaleString("en-US", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}
                    {" - "}
                    {new Date(item.requestedEndDate).toLocaleString("en-US", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}
                  </Buttons>
                </Holds>
              ))}
            </Holds>
          </Grids>
        </Holds>
      </Contents>
    </Holds>
  );
}
