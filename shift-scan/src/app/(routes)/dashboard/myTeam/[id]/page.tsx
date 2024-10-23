"use client";

import Spinner from "@/components/(animations)/spinner";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import React, { use, useEffect, useState } from "react";
import { z } from "zod";

// Zod schema for params
const ParamsSchema = z.object({
  id: z.string(),
});

// Zod schema for CrewMember type
const CrewMemberSchema = z.object({
  user: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    image: z.string().nullable(),
  }),
});

// Zod schema for the response containing an array of CrewMember
const CrewResponseSchema = z.array(CrewMemberSchema);

type CrewMember = z.infer<typeof CrewMemberSchema>;

type CrewResponse = CrewMember[];
type Params = Promise<{ id: string }>;

export default function Content(Prop: { params: Promise<Params> }) {
  const params = use(Prop.params);
  // Validate params using Zod
  try {
    ParamsSchema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error in params:", error.errors);
    }
  }

  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { status: status } = useSession();
  const id = use(Prop.params);
  const crewId = Number(id);
  const t = useTranslations("MyTeam");

  useEffect(() => {
    const fetchCrew = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/getCrewById/${crewId}`);

        if (response.ok) {
          const crewData: CrewResponse = await response.json();

          // Validate fetched crew data using Zod
          try {
            CrewResponseSchema.parse(crewData);
          } catch (error) {
            if (error instanceof z.ZodError) {
              console.error("Validation error in crew data:", error.errors);
              return;
            }
          }

          setCrew(crewData);
          localStorage.setItem(`crew-${crewId}`, JSON.stringify(crewData));
        } else {
          console.error("Failed to fetch crew data");
        }
      } catch (error) {
        console.error("Error fetching crew data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      const storedCrew = localStorage.getItem(`crew-${crewId}`);
      if (storedCrew) {
        const parsedCrew = JSON.parse(storedCrew);

        // Validate stored crew data using Zod
        try {
          CrewResponseSchema.parse(parsedCrew);
          setCrew(parsedCrew);
          setIsLoading(false);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error(
              "Validation error in stored crew data:",
              error.errors
            );
            fetchCrew(); // Fetch fresh data if stored data is invalid
          }
        }
      } else {
        fetchCrew();
      }
    }
  }, [crewId, status, id]);

  return (
    <Bases>
      <Contents>
        <Grids rows={"5"} gap={"5"}>
          <Holds background={"white"} className="row-span-1 h-full">
            <Contents width={"section"}>
              <TitleBoxes
                title={`${t("MyTeams-Title")}`}
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
            <Holds background={"white"} className="row-span-6 h-full">
              <Contents width={"section"}>
                <Grids rows={"4"} gap={"5"} className="my-5">
                  {crew.map((member) => (
                    <Holds className="row-span-1 h-full" key={member.user.id}>
                      <Buttons
                        href={`/dashboard/myTeam/${id}/employee/${member.user.id}`}
                        background="lightBlue"
                      >
                        <Holds position={"row"}>
                          <Holds size={"30"}>
                            <Images
                              titleImg={
                                member.user.image ?? "/default-profile.svg"
                              }
                              titleImgAlt="profile picture"
                              loading="lazy"
                              className="rounded-xl"
                            />
                          </Holds>
                          <Holds>
                            <Titles size="h2">
                              {member.user.firstName} {member.user.lastName}
                            </Titles>
                          </Holds>
                        </Holds>
                      </Buttons>
                    </Holds>
                  ))}
                </Grids>
              </Contents>
            </Holds>
          )}
        </Grids>
      </Contents>
    </Bases>
  );
}
