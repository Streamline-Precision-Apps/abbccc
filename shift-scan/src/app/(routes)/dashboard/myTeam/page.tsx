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
type Teams = {
  id: string;
  name: string;
  totalMembers: number;
};

export default function Content() {
  const t = useTranslations("MyTeam");
  const [myTeams, setMyTeams] = useState<Teams[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    const fetchCrew = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/getTeam");
        if (response.ok) {
          const myTeams = await response.json();
          setMyTeams(myTeams);
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
        // Parse and set local data
        setMyTeams(JSON.parse(storedTeams));
        setIsLoading(false); // Stop loading
      } else {
        // Fetch from server if no data in local storage
        fetchCrew();
      }
    }
  }, [status]);

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
            <>
              <Holds background={"white"} className="row-span-4 h-full">
                <Contents width={"section"}>
                  <Holds className="my-auto">
                    <Spinner />
                  </Holds>
                </Contents>
              </Holds>
            </>
          ) : (
            <Holds background={"white"} className="row-span-6 h-full">
              <Contents width={"section"}>
                <Grids gap={"5"} rows={"4"} className="py-5">
                  {myTeams.map((teams) => (
                    <Holds key={teams.id} className="row-span-1 h-full">
                      <Buttons
                        background="lightBlue"
                        href={`/dashboard/myTeam/${teams.id}`}
                        key={teams.id}
                      >
                        <Holds>
                          <Titles size="h1">
                            {teams.name} ({teams.totalMembers})
                          </Titles>
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
