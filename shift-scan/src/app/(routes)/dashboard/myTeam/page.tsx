"use client";
import Spinner from "@/components/(animations)/spinner";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Holds } from "@/components/(reusable)/Holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


export default function Content() {
const [myTeams,  setMyTeams] = useState<any[]>([]);
const [isLoading, setIsLoading] = useState(true);
const { data: session, status } = useSession();

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

if (status === "authenticated") {
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
<Bases variant="default">
    <Contents size="default">
    <Holds size="titleBox">
        <TitleBoxes
        title="My Teams"
        titleImg="/new/team.svg"
        titleImgAlt="Team"
        variant="default"
        size="default"
        />
    </Holds>
    {isLoading ? <>
        <Holds size="dynamic">
            <Contents variant="row" size="listTitle">
            <Titles size="h1">
            </Titles>
            <Spinner />
            </Contents>
        </Holds>
    </> :
    <Holds size="dynamic">
        {myTeams.map((teams) => (
            <Buttons
            variant="lightBlue"
            href={`/dashboard/myTeam/${teams.id}`}
            key={teams.id}
            >
            <Contents variant="row" size="listTitle">
            <Titles size="h1">
                Team {teams.id}
            </Titles>
            </Contents>
            </Buttons>
        ))}
    </Holds>
    }
        </Contents>
        </Bases>
    );
}