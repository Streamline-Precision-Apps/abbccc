"use client";
import Spinner from "@/components/(animations)/spinner";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import React from "react";


export default function Content() {
const t = useTranslations("MyTeam");
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
<Bases>
<Contents>
    <Holds 
            background={"white"}
            className="mb-3">
        <TitleBoxes
        title={`${t('Teams-Title')}`}
        titleImg="/team.svg"
        titleImgAlt={`${t('Teams-Logo-Title')}`}
        />
    </Holds>
    {isLoading ? <>
        <Holds background={"white"}>
            <Contents width={"section"}>
            <Spinner />
            </Contents>
        </Holds>
    </> :
    <Holds background={"white"}>
        <Contents width={"section"}>
        {myTeams.map((teams) => (
            <Holds className="my-3">
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
        </Contents>
    </Holds>
    }
        </Contents>
        </Bases>
    );
}