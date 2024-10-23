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
  requestedStartDate: z.string(),
  requestedEndDate: z.string(),
});

export default function STab() {
  const [sentContent, setSentContent] = useState<sentContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentContent = async () => {
      try {
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

  if (loading) {
    return (
      <Holds className="py-5">
        <Texts>Loading...</Texts>
        <Spinner />
      </Holds>
    );
  }

  if (error) {
    return (
      <Holds>
        <Texts>{error}</Texts>
      </Holds>
    );
  }

  if (sentContent.length === 0) {
    return (
      <Contents width={"section"}>
        <Grids rows={"5"} cols={"3"} gap={"5"} className="py-5">
          <Holds className="row-start-1 row-end-5 col-span-3 h-full mt-5">
            <Titles>No Requests Available</Titles>
          </Holds>
          <Holds className="row-start-5 col-start-3 col-end-4 h-full">
            <Buttons background={"green"} href="/hamburger/inbox/form">
              <Holds>
                <Images
                  titleImg="/home.svg"
                  titleImgAlt="Home Icon"
                  size={"50"}
                />
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
        {sentContent.map((item) => (
          <Holds key={item.id}>
            <Buttons
              background={"green"}
              href={item.id ? `/hamburger/inbox/sent/approved/${item.id}` : "#"}
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
        <Holds className="row-start-5 col-start-3 col-end-4 h-full">
          <Buttons background={"green"} href="/hamburger/inbox/form">
            <Holds>
              <Images
                titleImg="/home.svg"
                titleImgAlt="Home Icon"
                size={"50"}
              />
            </Holds>
          </Buttons>
        </Holds>
      </Grids>
    </Contents>
  );
}
