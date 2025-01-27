"use client";
import { useParams } from "next/navigation";
import Spinner from "@/components/(animations)/spinner";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { z } from "zod";

// Zod schema for CrewMember type
const CrewMemberSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  image: z.string().nullable(), // image can be null
  // clockedIn: z.boolean(),
});

// Zod schema for the response containing an array of CrewMember
const CrewResponseSchema = z.array(CrewMemberSchema);

type CrewMember = z.infer<typeof CrewMemberSchema>;

type CrewResponse = CrewMember[];

export default function Content() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [titles, setTitles] = useState<string>("");
  const t = useTranslations("MyTeam");

  const params = useParams(); // remove typing here
  const { id } = params;

  useEffect(() => {
    const fetchCrew = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`/api/getCrewById/${id}`);
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
      } catch (error) {
        console.error("Error fetching crew data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrew();
  }, [id]);

  useEffect(() => {
    const fetchCrew = async () => {
      const response = await fetch("/api/getTeam");
      const data = await response.json();
      console.log("data", data);
      const setName = data[0].name;
      setTitles(setName);
    };
    fetchCrew();
  }, [id]);

  return (
    <Bases className="h-screen">
      <Contents className="h-full">
        <Grids rows={"10"} gap={"4"} className="h-full">
          <Holds background={"white"} className="row-span-2 h-full">
            <Contents width={"section"}>
              <TitleBoxes
                title={`${titles}`}
                titleImg="/team.svg"
                titleImgAlt={`${t("Teams-Logo-Title")}`}
                className="my-auto"
              />
            </Contents>
          </Holds>

          {isLoading ? (
            <Holds background={"white"} className="row-span-8 h-full">
              <Contents width={"section"}>
                <Holds className="my-auto">
                  <Spinner />
                </Holds>
              </Contents>
            </Holds>
          ) : (
            <>
              <Holds background={"white"} className="row-span-7 h-full">
                <Contents width={"section"}>
                  <Grids rows={"4"} gap={"5"} className="my-5">
                    {crew.map((member) => (
                      <Holds className="row-span-1 h-full" key={member.id}>
                        <Buttons
                          href={`/dashboard/myTeam/${id}/employee/${member.id}`}
                          background="lightBlue"
                        >
                          <Holds position={"row"}>
                            <Holds size={"30"} className="relative">
                              <Images
                                titleImg={
                                  member.image || "/profile-default.svg"
                                }
                                titleImgAlt="profile picture"
                                loading="lazy"
                                className="rounded-xl"
                              />
                              <Holds className="absolute bottom-0 left-8">
                                {
                                  // member.clockedIn
                                  false ? (
                                    <Holds
                                      background={"white"}
                                      className="w-5 h-5 justify-center items-center rounded-full"
                                    >
                                      <Images
                                        titleImg="/clockedIn.svg"
                                        titleImgAlt="Active"
                                      />
                                    </Holds>
                                  ) : null
                                }
                              </Holds>
                            </Holds>
                            <Holds size={"70"}>
                              <Titles size="h2">
                                {member.firstName} {member.lastName}
                              </Titles>
                            </Holds>
                          </Holds>
                        </Buttons>
                      </Holds>
                    ))}
                  </Grids>
                </Contents>
              </Holds>
              <Holds className="row-span-1 h-full">
                <Buttons
                  background={"orange"}
                  className="w-5/6"
                  href={`/dashboard/myTeam/${id}/timecards`}
                >
                  <Titles size={"h4"}>Approve Time Cards </Titles>
                </Buttons>
              </Holds>
            </>
          )}
        </Grids>
      </Contents>
    </Bases>
  );
}
