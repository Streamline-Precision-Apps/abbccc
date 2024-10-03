"use client";

import Spinner from "@/components/(animations)/spinner";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { sentContent } from "@/lib/types"; // Define appropriate type for your content
import React from "react";
import { useState, useEffect } from "react";

export default function STab() {
  const [sentContent, setSentContent] = useState<sentContent[]>([]);
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState<string | null>(null); // To track error state

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
        setSentContent(data); // Update state with fetched data
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
  const approved = sentContent.filter((item) => item.status === "APPROVED");
  const pending = sentContent.filter((item) => item.status === "PENDING");
  const denied = sentContent.filter((item) => item.status === "DENIED");

  // If loading, show a loading message
  if (loading) {
    return (
      <Holds>
        <Texts>Loading...</Texts>
        <Spinner />
      </Holds>
    );
  }

  // If there's an error, show an error message
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Holds className="h-full">
      <Contents width={"section"}>
        <Grids className="grid-rows-10 py-5">
          <Holds position={"left"} className="row-span-9 ">
            {/* Display approved requests */}
            {approved.map((item) => (
              <Buttons
                background={"green"}
                key={item.id}
                href={`/hamburger/inbox/sent/approved/${item.id}`}
              >
                <Titles>{item.requestType}</Titles>
                {new Date(item.date).toLocaleString("en-US", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </Buttons>
            ))}

            {/* Display pending requests */}
            {pending.map((item) => (
              <Buttons
                background={"orange"}
                key={item.id}
                href={`/hamburger/inbox/sent/${item.id}`}
              >
                <Titles>{item.requestType}</Titles>
                {new Date(item.date).toLocaleString("en-US", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </Buttons>
            ))}

            {/* Display denied requests */}
            {denied.map((item) => (
              <Buttons
                background={"red"}
                key={item.id}
                href={`/hamburger/inbox/sent/denied/${item.id}`}
              >
                <Titles>{item.requestType}</Titles>
                {new Date(item.date).toLocaleString("en-US", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </Buttons>
            ))}
          </Holds>
          {/* Request button */}
          <Holds position={"row"} className="row-span-1 h-full">
            <Buttons href="/hamburger/inbox/form" background={"green"}>
              <Titles>Request</Titles>
            </Buttons>
          </Holds>
        </Grids>
      </Contents>
    </Holds>
  );
}
