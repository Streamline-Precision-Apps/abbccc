"use client";

import Spinner from "@/components/(animations)/spinner";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type CrewMember = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
};

type CrewResponse = CrewMember[];

export default function Content({ params }: { params: { id: string } }) {
  const [crew, setCrew] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const { id } = params;
  const crewId = Number(id);

  useEffect(() => {
    const fetchCrew = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/getCrewById/${crewId}`);
        if (response.ok) {
          const crewData: CrewResponse = await response.json();
          setCrew(crewData);
          // Store the crew data in localStorage
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
      // First, try to load data from localStorage
      const storedCrew = localStorage.getItem(`crew-${crewId}`);
      if (storedCrew) {
        setCrew(JSON.parse(storedCrew));
        setIsLoading(false); // Data loaded from localStorage, no need to fetch
      } else {
        fetchCrew(); // If no data in localStorage, fetch from API
      }
    }
  }, [status, id]);

  return (
    <Bases>
      <Contents>
        <Holds size="titleBox">
          <TitleBoxes
            title="My Team"
            titleImg="/new/team.svg"
            titleImgAlt="Team"
            variant="default"
            size="default"
          />
        </Holds>

        <Holds size="dynamic">
          {isLoading ? (
            <Contents variant="row" size="listTitle">
              <Titles size="h1"></Titles>
              <Spinner />
            </Contents>
          ) : (
            crew.map((user) => (
              <Buttons
                key={user.id}
                href={`/dashboard/myTeam/${params.id}/employee/${user.id}`}
                variant="lightBlue"
                size={null}
              >
                <Contents variant="image" size="listImage">
                  <Images
                    titleImg={user.image ?? "/new/default-profile.svg"}
                    titleImgAlt="profile picture"
                    variant="icon"
                    size="default"
                    loading="lazy"
                  />
                </Contents>
                <Contents variant="row" size="listTitle">
                  <Titles size="h1">
                    {user.firstName} {user.lastName}
                  </Titles>
                </Contents>
              </Buttons>
            ))
          )}
        </Holds>
      </Contents>
    </Bases>
  );
}