"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Holds } from "@/components/(reusable)/holds";
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
    <Bases>
        <Contents>
            <Holds 
            background={"white"}
            className="mb-3">
                <TitleBoxes
                title="My Team"
                titleImg="/team.svg"
                titleImgAlt="Team"
                />
            </Holds>
            {isLoading ? <>
                <Holds background={"white"}>
                    <Contents width={"section"}>
                        <Buttons>
                            <Holds>
                                <Titles size="h4">Loading...</Titles>
                                <Images 
                                titleImg="/ongoing.svg"
                                titleImgAlt="loading icon"
                                size={"20"}
                                className="animate-spin"
                                />
                            </Holds>
                        </Buttons>
                    </Contents> 
                </Holds>
                </> :
                <Holds background={"white"}>
                    <Contents width={"section"}>
                        {crew.map((userCrewId) => (
                            <Holds className="my-3">
                                <Buttons
                                key={userCrewId.user.id}
                                id={userCrewId.user.id}
                                href={`/dashboard/myTeam/${userCrewId.user.id}`}
                                background="lightBlue"
                                >
                                    <Holds 
                                    position={"row"}>
                                        <Holds size={"30"}>
                                            <Images
                                            titleImg={
                                                userCrewId.user.image ?? "./default-profile.svg"
                                            }
                                            titleImgAlt="profile picture"
                                            size="full"
                                            loading="lazy"
                                            className="rounded-xl"
                                            />
                                        </Holds>
                                        <Holds>
                                            <Titles size="h2">
                                                {userCrewId.user.firstName} {userCrewId.user.lastName}
                                            </Titles>
                                        </Holds>
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