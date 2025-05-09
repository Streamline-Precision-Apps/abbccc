"use client";

import Spinner from "@/components/(animations)/spinner";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import React from "react";
import { z } from "zod";
import { Texts } from "@/components/(reusable)/texts";

// Zod schema for Team data
const countSchema = z.object({
  users: z.number(),
});

// Define the main schema
const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  _count: countSchema,
});

// Zod schema for the response containing an array of Teams
const TeamsResponseSchema = z.array(TeamSchema);

type Team = z.infer<typeof TeamSchema>;

export default function Content() {
  const t = useTranslations("MyTeam");
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    const fetchCrew = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/getTeam");

        if (response.ok) {
          const myTeamsData = await response.json();

          // Validate fetched data using Zod
          try {
            TeamsResponseSchema.parse(myTeamsData);
            setMyTeams(myTeamsData);

            localStorage.setItem("myTeams", JSON.stringify(myTeamsData));
          } catch (error) {
            if (error instanceof z.ZodError) {
              console.error("Validation error in team data:", error.errors);
              return;
            }
          }
        } else {
          console.error("Failed to fetch crew data");
        }
      } catch (error) {
        console.error("Error fetching crew data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionStatus === "authenticated") {
      // Check if data is already in local storage
      const storedTeams = localStorage.getItem("myTeams");
      if (storedTeams) {
        const parsedTeams = JSON.parse(storedTeams);

        // Validate stored data using Zod
        try {
          TeamsResponseSchema.parse(parsedTeams);
          setMyTeams(parsedTeams);
          setIsLoading(false);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error(
              "Validation error in stored team data:",
              error.errors
            );
            fetchCrew(); // Fetch fresh data if stored data is invalid
          }
        }
      } else {
        fetchCrew(); // Fetch from server if no data in local storage
      }
    }
  }, [sessionStatus]);

  return (
    <Bases>
      <Contents>
        <Grids rows={"5"} gap={"5"}>
          <Holds background={"white"} className="row-span-1 h-full">
            <Contents width={"section"}>
              <TitleBoxes
                title={`${t("Teams-Title")}`}
                titleImg="/team.svg"
                titleImgAlt={`${t("Teams-Logo-Title")}`}
                className="my-auto"
              />
            </Contents>
          </Holds>

          {isLoading ? (
            <Holds background={"white"} className="row-span-4 h-full">
              <Contents width={"section"}>
                <Holds className="my-auto">
                  <Spinner />
                </Holds>
              </Contents>
            </Holds>
          ) : (
            <Holds background={"white"} className="row-span-6 h-full p-3">
              <Holds className="h-full p-3 border-[3px] border-black rounded-[10px]">
                {myTeams.map((teams) => (
                  <Holds className="w-full" key={teams.id}>
                    <Buttons
                      background="lightBlue"
                      href={`/dashboard/myTeam/${teams.id}`}
                      className="py-2 w-full relative"
                    >
                      <Titles size="h2">{teams.name}</Titles>
                      <Texts
                        size="p4"
                        className="absolute top-1/2 transform -translate-y-1/2 right-2"
                      >
                        ({teams._count.users})
                      </Texts>
                    </Buttons>
                  </Holds>
                ))}
              </Holds>
            </Holds>
          )}
        </Grids>
      </Contents>
    </Bases>
  );
}
