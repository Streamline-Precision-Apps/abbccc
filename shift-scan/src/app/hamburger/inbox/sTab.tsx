"use client";

import Spinner from "@/components/(animations)/spinner";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { sentContent } from "@/lib/types";
import React from "react";
import { useState, useEffect } from "react";
import { z } from "zod";

// Define Zod schema for sent content
const sentContentSchema = z.object({
  id: z.string(),
  requestType: z.string(),
  status: z.enum(["APPROVED", "PENDING", "DENIED"]),
  requestedStartDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date format",
  }),
  requestedEndDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date format",
  }),
});

export default function STab() {
  const [sentContent, setSentContent] = useState<sentContent[]>([]);
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState<string | null>(null); // To track error state
  const [pending, setPending] = useState<sentContent[]>([]);
  const [approved, setApproved] = useState<sentContent[]>([]);
  const [denied, setDenied] = useState<sentContent[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchSentContent = async () => {
      try {
        // Fetch data from your API
        const response = await fetch("/api/getTimeoffRequests?type=sent");
        if (!response.ok) {
          throw new Error("Failed to fetch sent content");
        }

        const data = await response.json();

        // Validate the fetched data with Zod
        const validatedData = data.map((item: typeof sentContentSchema) => {
          try {
            return sentContentSchema.parse(item);
          } catch (e) {
            console.error("Validation error:", e);
            throw new Error("Invalid data format");
          }
        });

        setSentContent(validatedData); // Update state with validated data
        setLoading(false);
      } catch (err) {
        console.error("Error fetching sent content:", err);
        setError("An error occurred while fetching sent content");
        setLoading(false);
      }
    };

    fetchSentContent();
  }, []);

  // Filter the content based on status
  useEffect(() => {
    setApproved(sentContent.filter((item) => item.status === "APPROVED"));
    setPending(sentContent.filter((item) => item.status === "PENDING"));
    setDenied(sentContent.filter((item) => item.status === "DENIED"));
  }, [sentContent]);

  // If loading, show a loading message
  if (loading) {
    return (
      <Holds className="py-5">
        <Texts>Loading...</Texts>
        <Spinner />
      </Holds>
    );
  }

  // If there's an error, show an error message
  if (error) {
    return (
      <Holds>
        <Texts>{error}</Texts>
      </Holds>
    );
  }

  // If there are no requests, show a message
  if (pending.length === 0 && approved.length === 0 && denied.length === 0) {
    return (
      <Contents width={"section"}>
        <Grids rows={"5"} cols={"3"} gap={"5"} className="py-5">
          <Holds className="row-start-1 row-end-5 col-span-3 h-full mt-5">
            <Titles>There Are No Requests Currently</Titles>
          </Holds>

          <Holds
            size={"full"}
            className="row-start-5 row-end-6 col-start-3 col-end-4 h-full my-auto"
          >
            <Buttons href="/hamburger/inbox/form" background={"green"}>
              <Holds className="h-full my-auto">
                <Holds size={"80"} className="my-auto">
                  <Images titleImg={"/Plus.svg"} titleImgAlt={"plus"} />
                </Holds>
              </Holds>
            </Buttons>
          </Holds>
        </Grids>
      </Contents>
    );
  }

  return (
    <Contents width={"section"}>
      <Grids rows={"5"} cols={"3"} gap={"5"} className="py-5">
        <Holds className="row-start-1 row-end-5 col-span-3 h-full mt-5 pb-5 overflow-auto no-scrollbar gap-5">
          {/* Display approved requests */}
          {approved.map((item) => (
            <Holds key={item.id}>
              <Buttons
                background={"green"}
                href={`/hamburger/inbox/sent/approved/${item.id}`}
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

          {/* Display pending requests */}
          {pending.map((item) => (
            <Holds key={item.id}>
              <Buttons
                background={"orange"}
                href={`/hamburger/inbox/sent/${item.id}`}
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

          {/* Display denied requests */}
          {denied.map((item) => (
            <Holds key={item.id} className="py-2">
              <Buttons
                background={"red"}
                href={`/hamburger/inbox/sent/denied/${item.id}`}
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

        <Holds
          size={"full"}
          className="row-start-5 row-end-6 col-start-3 col-end-4"
        >
          <Buttons
            href="/hamburger/inbox/form"
            background={"green"}
            size={"70"}
            className="h-full my-auto"
          >
            <Holds>
              <Images titleImg={"/Plus.svg"} titleImgAlt={"plus"} />
            </Holds>
          </Buttons>
        </Holds>
      </Grids>
    </Contents>
  );
}
