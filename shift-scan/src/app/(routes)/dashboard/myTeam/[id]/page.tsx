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
  image: z.string().nullable(),
  clockedIn: z.boolean(),
});

// Zod schema for the API response
const CrewApiResponseSchema = z.tuple([
  z.array(CrewMemberSchema), // crew members array
  z.string(), // crew type
]);

type CrewMember = z.infer<typeof CrewMemberSchema>;
type CrewApiResponse = z.infer<typeof CrewApiResponseSchema>;

export default function Content() {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [crewType, setCrewType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [titles, setTitles] = useState<string>("");
  const t = useTranslations("MyTeam");

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchCrewData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`/api/getCrewById/${id}`);
        const data = await response.json();

        // Validate the API response
        try {
          const [members, type] = CrewApiResponseSchema.parse(data);
          setCrewMembers(members);
          setCrewType(type);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error("Validation error in crew data:", error.errors);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching crew data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrewData();
  }, [id]);

  useEffect(() => {
    const fetchTeamName = async () => {
      try {
        const response = await fetch("/api/getTeam");
        const data = await response.json();
        const teamName = data[0]?.name || "";
        setTitles(teamName);
      } catch (error) {
        console.error("Error fetching team name:", error);
      }
    };
    fetchTeamName();
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
              <Holds background={"white"} className="row-span-8 h-full">
                <Contents width={"section"}>
                  <Grids rows={"8"} gap={"5"} className="my-5">
                    <Holds className="row-span-6 p-2 h-full w-full border-[3px] border-black rounded-[10px] overflow-y-auto no-scrollbar">
                      {crewMembers.map((member) => (
                        <Holds key={member.id} className="w-full p-2 ">
                          <Buttons
                            href={`/dashboard/myTeam/${id}/employee/${member.id}`}
                            background="lightBlue"
                            className="w-full h-full p-2 relative"
                          >
                            <Holds position={"row"}>
                              <Holds size={"20"} className="relative">
                                <Images
                                  titleImg={
                                    member.image || "/profile-default.svg"
                                  }
                                  titleImgAlt="profile picture"
                                  loading="lazy"
                                  className="rounded-xl"
                                />
                                <Holds className="absolute bottom-0 left-8">
                                  {false && (
                                    <Holds
                                      background={"white"}
                                      className="w-5 h-5 justify-center items-center rounded-full"
                                    >
                                      <Images
                                        titleImg="/clockedIn.svg"
                                        titleImgAlt="Active"
                                      />
                                    </Holds>
                                  )}
                                </Holds>
                              </Holds>
                              <Holds size={"80"}>
                                <Titles
                                  position={"left"}
                                  size="h4"
                                  className="ml-2"
                                >
                                  {member.firstName} {member.lastName}
                                </Titles>
                              </Holds>
                            </Holds>
                            <Holds
                              background={member.clockedIn ? "green" : "red"}
                              className="absolute top-[-5px] right-[-5px] w-3 h-3 rounded-full p-1.5 border-[3px] border-black"
                            />
                          </Buttons>
                        </Holds>
                      ))}
                    </Holds>
                    {crewType !== "Mechanic" && (
                      <Holds className="row-start-7 row-end-8 h-full">
                        <Buttons
                          background={"green"}
                          className="w-full"
                          href={`/dashboard/mechanic?rUrl=/dashboard/myTeam/${id}`}
                        >
                          <Titles size={"h4"}>Manage Projects</Titles>
                        </Buttons>
                      </Holds>
                    )}
                    <Holds className="row-start-8 row-end-9 h-full">
                      <Buttons
                        background={"green"}
                        className="w-full"
                        href={`/dashboard/myTeam/${id}/timecards`}
                      >
                        <Titles size={"h4"}>Approve Time Cards </Titles>
                      </Buttons>
                    </Holds>
                  </Grids>
                </Contents>
              </Holds>
            </>
          )}
        </Grids>
      </Contents>
    </Bases>
  );
}
