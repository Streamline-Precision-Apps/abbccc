"use client";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

// change back to async later
export default function Admins() {
  const { setOpen, open } = useSidebar();
  const { data: session } = useSession();
  const [position, setPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          setGeoError("Unable to fetch location: " + err.message);
        }
      );
    } else {
      setGeoError("Geolocation is not supported by your browser.");
    }
  }, []);

  if (!session) {
    return (
      <>
        <p>You must be logged in to view this page</p>
      </>
    );
  }

  return (
    <div className="h-full w-full p-4">
      {/* Main content goes here */}
      <div className="flex flex-row gap-5 h-full max-h-[4vh]">
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 p-0 hover:bg-slate-500 hover:bg-opacity-20 ${
              open ? "bg-slate-500 bg-opacity-20" : "bg-app-blue "
            }`}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <img
              src={open ? "/condense-white.svg" : "/condense.svg"}
              alt="logo"
              className="w-4 h-auto object-contain "
            />
          </Button>
        </div>
        <div className="h-full justify-center items-center">
          <p className="text-white text-lg">
            Welcome {session?.user.firstName + " " + session?.user.lastName}!
          </p>
        </div>
      </div>

      <div></div>
    </div>
  );
}
