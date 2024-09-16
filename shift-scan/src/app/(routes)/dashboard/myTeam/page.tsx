"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Sections } from "@/components/(reusable)/sections";
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

export default function Content() {
const [crew, setCrew] = useState<CrewMember[]>([]);
const [isLoading, setIsLoading] = useState(true);
const { data: session, status } = useSession();

useEffect(() => {
const fetchCrew = async () => {
    try {
    setIsLoading(true);
    const response = await fetch("/api/getCrew");
    if (response.ok) {
        const crewData = await response.json();
        setCrew(crewData);
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
    fetchCrew();
}
}, [status]);

return (
<Bases variant="default">
    <Contents size="default">
    <Sections size="titleBox">
        <TitleBoxes
        title="My Team"
        titleImg="/new/team.svg"
        titleImgAlt="Team"
        variant="default"
        size="default"
        />
    </Sections>
    {isLoading ? <>
        <Sections size="dynamic">
        <Buttons
            variant="lightBlue"
            size={null}
            >
            <Contents variant="row" size="listTitle">
            <Titles size="h1">
            </Titles>
            <Images 
            titleImg="/new/ongoing.svg"
            titleImgAlt="loading icon"
            variant="icon"
            size={"default"}
            className="animate-spin"
            />
            </Contents>
        </Buttons>
        </Sections>
    </> :
    <Sections size="dynamic">
        {crew.map((userCrewId) => (
            <Buttons
            key={userCrewId.user.id}
            id={userCrewId.user.id}
            href={`/dashboard/myTeam/${userCrewId.user.id}`}
            variant="lightBlue"
            size={null}
            >
            <Contents variant="image" size="listImage">
            <Images
            titleImg={
                userCrewId.user.image ?? "./new/default-profile.svg"
            }
            titleImgAlt="profile picture"
            variant="icon"
            size="default"
            loading="lazy"
            />
            </Contents>
            <Contents variant="row" size="listTitle">
            <Titles size="h1">
            {userCrewId.user.firstName} {userCrewId.user.lastName}
            </Titles>
            </Contents>
            </Buttons>
        ))}
        </Sections>
    }
        </Contents>
        </Bases>
    );
}