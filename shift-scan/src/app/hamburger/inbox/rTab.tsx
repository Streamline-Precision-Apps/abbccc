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

export default function RTab() {
  const { data: session, status } = useSession(); // Use `useSession` to fetch session
  const router = useRouter();
  const [receivedContent, setReceivedContent] = useState<receivedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if there's no session
  useEffect(() => {
    if (status === "loading") return; // Wait for session to be loaded
    if (!session) {
      router.push("/signin");
    }
  }, [session, status, router]);

  // Fetch receivedContent when session exists
  useEffect(() => {
    if (!session) return; // Exit early if no session is available

    const fetchReceivedContent = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/getTimeoffRequests?type=received");

        if (!response.ok) {
          throw new Error("Failed to fetch received content");
        }

        const data = await response.json();
        setReceivedContent(data); // Update state with the received content
        setLoading(false);
      } catch (err) {
        console.error("Error fetching received content:", err);
        setError("An error occurred while fetching received content");
      } finally {
        setLoading(false);
      }
    };

    fetchReceivedContent();
  }, [session]);

  // Check if user has appropriate permissions
  if (!session) return null;

  const userPermission = session.user.permission;
  if (!["SUPERADMIN", "MANAGER", "ADMIN"].includes(userPermission)) {
    return (
      <Holds className="h-full justify-center">
        <Titles>Coming Soon</Titles>
        <Holds>
          <Images size={"30"} titleImg="/logo.svg" titleImgAlt="coming soon" />
        </Holds>
      </Holds>
    );
  }

  // Filter out requests made by the current user
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

  // If there are no pending requests, show a message
  if (!pending || pending.length === 0) {
    return (
      <Holds className="mt-10">
        <Titles>There Are No Requests Currently</Titles>
      </Holds>
    );
  }

  // Render received requests
  return (
    <Contents width={"section"} className="mb-5">
      <Grids rows={"1"} gap={"5"} className="py-5">
        <Holds className="row-span-1 h-full gap-5 overflow-auto no-scrollbar">
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
