"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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

export default function Content() {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [crewType, setCrewType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [titles, setTitles] = useState<string>("");
  const t = useTranslations("MyTeam");
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("rPath");
  const timeCard = searchParams.get("timecard");
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
    <Bases>
      <Contents>
        <Grids rows={"7"} gap={"5"} className="h-full">
          <Holds background={"white"} className="row-start-1 row-end-2 h-full">
            <TitleBoxes
              onClick={() => router.push(`/dashboard/myTeam?rPath=${url}`)}
            >
              <Titles size={"h2"}>{titles}</Titles>
            </TitleBoxes>
          </Holds>

          {isLoading ? (
            <Holds
              background={"white"}
              className="row-start-2 row-end-8 py-5  h-full"
            >
              <Contents width={"section"}>
                <Holds className="my-auto">
                  <Spinner />
                </Holds>
              </Contents>
            </Holds>
          ) : (
            <>
              <Holds
                background={"white"}
                className="row-start-2 row-end-8 py-5 h-full"
              >
                <Grids rows={"7"} gap={"5"} className="h-full w-full">
                  <Holds
                    className={`row-start-1 ${
                      crewType === "Mechanic" ? "row-end-7" : "row-end-8"
                    } h-full w-full overflow-y-auto no-scrollbar`}
                  >
                    <Contents width={"section"}>
                      {crewMembers.map((member) => (
                        <Holds key={member.id} className="w-full pb-3.5 ">
                          <Buttons
                            href={`/dashboard/myTeam/${id}/employee/${member.id}?rPath=${url}`}
                            background="lightBlue"
                            className="w-full h-full py-2 relative"
                          >
                            <Holds position={"row"} className="w-full gap-x-4">
                              <Holds size={"20"} className="relative">
                                <Images
                                  titleImg={
                                    member.image
                                      ? member.image
                                      : "/profileEmpty.svg"
                                  }
                                  titleImgAlt="profileFilled"
                                  loading="lazy"
                                  className={`rounded-full max-w-12 h-auto object-contain ${
                                    member.image
                                      ? "border-[3px] border-black"
                                      : ""
                                  } `}
                                />
                                <Holds
                                  background={
                                    member.clockedIn ? "green" : "red"
                                  }
                                  className="absolute top-1 right-0 w-3 h-3 rounded-full p-1.5 border-[3px] border-black"
                                />
                              </Holds>
                              <Holds size={"80"}>
                                <Titles position={"left"} size="h4">
                                  {member.firstName} {member.lastName}
                                </Titles>
                              </Holds>
                            </Holds>
                          </Buttons>
                        </Holds>
                      ))}
                    </Contents>
                  </Holds>
                  {crewType === "Mechanic" && (
                    <Holds className="row-start-7 row-end-8 ">
                      <Contents width={"section"}>
                        <Buttons
                          background={"green"}
                          className="w-full py-3"
                          href={`/dashboard/mechanic?rUrl=/dashboard/myTeam/${id}?rPath=${url}`}
                        >
                          <Titles size={"h2"}>{t("ManageProjects")}</Titles>
                        </Buttons>
                      </Contents>
                    </Holds>
                  )}
                </Grids>
              </Holds>
            </>
          )}
        </Grids>
      </Contents>
    </Bases>
  );
}
