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
    <Holds>
      {/* Request button */}

      <Contents width={"section"} className="mb-5">
        <Holds size={"full"}>
          <Buttons
            href="/hamburger/inbox/form"
            background={"green"}
            className="h-full py-2"
          >
            <Titles size={"h2"}>Request</Titles>
          </Buttons>
        </Holds>
      </Contents>
      <Contents width={"section"}>
        {/* Display approved requests */}
        {approved.map((item) => (
          <Holds key={item.id} className="py-2">
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
          </Holds>
        ))}

        {/* Display pending requests */}
        {pending.map((item) => (
          <Holds key={item.id} className="py-2">
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
          </Holds>
        ))}

        {/* Display denied requests */}
        {denied.map((item) => (
          <Holds key={item.id} className="py-2">
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
          </Holds>
        ))}
      </Contents>
    </Holds>
  );
}
