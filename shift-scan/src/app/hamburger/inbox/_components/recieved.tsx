"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { useRouter } from "next/navigation";
import React from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Contents } from "@/components/(reusable)/contents";
import Spinner from "@/components/(animations)/spinner";
import { Images } from "@/components/(reusable)/images";
import { Grids } from "@/components/(reusable)/grids";
import { z } from "zod";
import { Selects } from "@/components/(reusable)/selects";

// Define Zod schema for received content
// Define Zod schema for received content
// Define Zod schema for received content
const receivedContentSchema = z.object({
  id: z.string(), // Adjusted to expect a number
  status: z.enum(["APPROVED", "PENDING", "DENIED"]),
  requestType: z.string(),
  requestedStartDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format for requestedStartDate",
  }),
  requestedEndDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format for requestedEndDate",
  }),
  employee: z.object({
    firstName: z.string(),
    lastName: z.string(),
    crews: z.array(
      z.object({
        leadId: z.string(), // leadId remains a string as per the received data
      })
    ),
  }),
});

type recievedContent = z.infer<typeof receivedContentSchema>;

type FormatOptions = {
  label: string;
  value: string;
};

export default function RTab() {
  const { data: session } = useSession();
  const router = useRouter();
  const [receivedContent, setReceivedContent] = useState<recievedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [pendingFormOptions, setPendingFormOptions] = useState<FormatOptions[]>(
    []
  );
  // Fetch receivedContent when session exists
  useEffect(() => {
    const fetchReceivedContent = async () => {
      try {
        setLoading(true);
        console.log("Getting team request");
        const response = await fetch("/api/getTeamRequest");

        if (!response.ok) {
          throw new Error("Failed to fetch received content");
        }

        const data = await response.json();
        console.log("team request data:", data);
        // Validate the fetched data with Zod
        const validatedData = data.map((item: typeof receivedContentSchema) => {
          try {
            return receivedContentSchema.parse(item);
          } catch (e) {
            console.error("Validation error:", e);
            throw new Error("Invalid data format");
          }
        });

        setReceivedContent(validatedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching received content:", err);
        setError("An error occurred while fetching received content");
        setLoading(false);
      }
    };

    if (session) {
      fetchReceivedContent();
    }
  }, [session]);

  // Use useEffect to handle the redirect
  useEffect(() => {
    if (!session) {
      router.push("/signin");
    }
  }, [session, router]);

  // Filter out requests made by the current user
  const user_Id = session?.user?.id;
  const pending = receivedContent.filter((item) =>
    item.employee.crews.filter((crew) => crew.leadId !== user_Id)
  );

  // If loading, show a loading message
  if (loading) {
    return (
      <Holds background={"white"} className="rounded-t-none row-span-9 h-full ">
        <Holds
          background={"lightGray"}
          className="py-5 rounded-t-none h-full justify-center animate-pulse"
        >
          <Spinner />
        </Holds>
      </Holds>
    );
  }

  // If there's an error, show an error message
  if (error) {
    return (
      <Holds background={"white"} className="rounded-t-none row-span-9 h-full">
        <Holds>
          <Texts>{error}</Texts>
        </Holds>
      </Holds>
    );
  }

  // If there are no pending requests, show a message
  if (!pending || pending.length === 0) {
    return (
      <Holds background={"white"} className="rounded-t-none row-span-9 h-full">
        <Contents width={"section"}>
          <Holds className="pt-5 h-full  ">
            <Grids rows={"9"}>
              <Selects
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                }}
                className="text-center h-full"
              >
                <option value="">Select A Filter</option>
                {pendingFormOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Selects>

              <Holds className="pt-10 row-span-8 h-full ">
                <Titles size={"h4"}>There Are No Requests Currently</Titles>
              </Holds>
            </Grids>
          </Holds>
        </Contents>
      </Holds>
    );
  }

  // Render received requests
  return (
    <Holds background={"white"} className="rounded-t-none row-span-9 h-full">
      <Contents width={"section"}>
        <Holds className="pt-5 h-full  ">
          <Grids rows={"9"} gap={"5"} className="py-5">
            <Selects
              value={selectedFilter}
              onChange={(e) => {
                setSelectedFilter(e.target.value);
              }}
              className="text-center h-full"
            >
              <option value="">Select A Filter</option>
              {pendingFormOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Selects>
            <Holds className="row-span-8  h-full gap-5 overflow-auto no-scrollbar">
              {pending.map((item) => (
                <Holds key={item.id}>
                  <Buttons
                    background={
                      item.status.toString() === "PENDING"
                        ? "orange"
                        : item.status.toString() === "APPROVED"
                        ? "green"
                        : "red"
                    }
                    key={item.id}
                    href={`/hamburger/inbox/received/${item.id}`}
                    size={"90"}
                  >
                    <Titles>{item.requestType}</Titles>
                    <div>
                      {item.employee.firstName} {item.employee.lastName}
                    </div>
                    {new Date(item.requestedStartDate).toLocaleString("en-US", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}{" "}
                    -{" "}
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
