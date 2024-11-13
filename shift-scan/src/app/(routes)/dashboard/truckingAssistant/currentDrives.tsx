"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { receivedContent } from "@/lib/types";
import { useRouter } from "next/navigation";
import React from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Contents } from "@/components/(reusable)/contents";
import Spinner from "@/components/(animations)/spinner";
import { Images } from "@/components/(reusable)/images";
import { Grids } from "@/components/(reusable)/grids";
import { z } from "zod";

// Define Zod schema for received content
const receivedContentSchema = z.object({
  id: z.number(),
  submitDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format for submitDate",
  }),
  userId: z.string(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format for date",
  }),
  jobsiteId: z.string(),
  costcode: z.string(),
  nu: z.string().default("nu"), // "nu" is the default
  Fp: z.string().default("fp"), // "fp" is the default
  vehicleId: z.number().nullable(),
  startTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format for startTime",
  }),
  endTime: z.string().nullable().refine((date) => date === null || !isNaN(Date.parse(date)), {
    message: "Invalid date format for endTime",
  }),
  duration: z.number().nullable(),
  startingMileage: z.number().nullable(),
  endingMileage: z.number().nullable(),
  leftIdaho: z.boolean().nullable().default(false),
  equipmentHauled: z.string().nullable(),
  materialsHauled: z.string().nullable(),
  hauledLoadsQuantity: z.number().nullable(),
  refuelingGallons: z.number().nullable(),
  timeSheetComments: z.string().nullable(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("PENDING"),
});

export default function CurrentDrives() {
  const { data: session } = useSession();
  const router = useRouter();
  const [receivedContent, setReceivedContent] = useState<receivedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch receivedContent when session exists
  useEffect(() => {
    const fetchReceivedContent = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/getDrives");

        if (!response.ok) {
          throw new Error("Failed to fetch received content");
        }

        const data = await response.json();

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

  // TODO Add this back.
  // Use useEffect to handle the redirect
  // useEffect(() => {
  //   if (!session) {
  //     router.push("/signin");
  //   }
  // }, [session, router]);

  // Check if the user has appropriate permissions
  if (
    session &&
    !["SUPERADMIN", "MANAGER", "ADMIN"].includes(session?.user?.permission)
  ) {
    return (
      <Holds className="h-full justify-center">
        <Titles>Coming Soon</Titles>
        <Holds>
          <Images size={"30"} titleImg="/logo.svg" titleImgAlt="coming soon" />
        </Holds>
      </Holds>
    );
  }

  // Filter out drivess made by the current user
  const user_Id = session?.user?.id;
  const pending = receivedContent.filter((item) => item.employeeId !== user_Id);

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

  // If there are no pending drives, show a message
  if (!pending || pending.length === 0) {
    return (
      <Holds className="mt-10">
        <Titles>There Are No Drives Currently</Titles>
      </Holds>
    );
  }

  // Render received drives
  return (
    <Contents width={"section"} className="mb-5">
      <Grids rows={"1"} gap={"5"} className="py-5">
        <Holds className="row-span-1  h-full gap-5 overflow-auto no-scrollbar">
          {pending.map((item) => (
            <Holds key={item.id}>
              <Buttons
                background={"orange"}
                key={item.id}
                href={`/hamburger/inbox/received/${item.id}`}
                size={"90"}
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
        </Holds>
      </Grids>
    </Contents>
  );
}
