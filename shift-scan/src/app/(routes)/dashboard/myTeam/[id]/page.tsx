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
}, [status, id]);

return (
<Bases>
    <Contents>
    {/* This part always renders */}
    <Sections size="titleBox">
        <TitleBoxes
        title="My Team"
        titleImg="/new/team.svg"
        titleImgAlt="Team"
        variant="default"
        size="default"
        />
    </Sections>

    {/* Conditional rendering for crew data */}
    <Sections size="dynamic">
        {isLoading ? (
        <Buttons variant="lightBlue">
            <Contents variant="row" size="listTitle">
            <Titles size="h1"></Titles>
            <Images
                titleImg="/new/ongoing.svg"
                titleImgAlt="loading icon"
                variant="icon"
                size="default"
                className="animate-spin"
            />
            </Contents>
        </Buttons>
        ) : ( 
            crew.map((user) => (
                <Buttons
                  key={user.id} // No need for optional chaining since it's a flat structure
                  href={`/dashboard/myTeam/${params.id}/employee/${user.id}`}
                  variant="lightBlue"
                  size={null}
                >
                  <Contents variant="image" size="listImage">
                    <Images
                      titleImg={user.image ?? "/new/default-profile.svg"} // Optional chaining for image fallback (if user.image exists)
                      titleImgAlt="profile picture"
                      variant="icon"
                      size="default"
                      loading="lazy"
                    />
                  </Contents>
                  <Contents variant="row" size="listTitle">
                    <Titles size="h1">
                      {user.firstName} {user.lastName} {/* Display first and last name directly */}
                    </Titles>
                  </Contents>
                </Buttons>
            ))
        )}
    </Sections>
    </Contents>
</Bases>
);
}