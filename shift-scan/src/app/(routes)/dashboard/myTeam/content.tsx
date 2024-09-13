"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { Suspense } from "react";

type Props = {
    crew: {
        user: {
            id: string;
            image: string | null;
            firstName: string;
            lastName: string;
        };
    }[]
}
export default function Content({crew}: Props ){

return (
    <Bases variant={"default"}>
<Contents size={"default"}>
    <Sections size={"titleBox"}>
        <TitleBoxes 
        title="My Team" 
        titleImg="/new/team.svg" 
        titleImgAlt="Team" 
        variant={"default"} 
        size={"default"}/>
    </Sections>
    <Sections size={"dynamic"}>
        <Suspense fallback={<p>Loading crew...</p>}>
    {crew.map((userCrewId) => (
        <Buttons key={userCrewId.user.id} id={userCrewId.user.id} href={`/dashboard/myTeam/${userCrewId.user.id}`} variant={"default"} size={"listLg"}>
        <Contents variant={"image" } size={"listImage"}>
            <Images titleImg={userCrewId.user.image ?? "./new/default-profile.svg"} titleImgAlt="profile picture" variant={"icon"} size={"default"} loading="lazy"></Images>
        </Contents>
        <Contents variant={"row"} size={"listTitle"}>
            <Titles size={"h1"}>{userCrewId.user.firstName} {userCrewId.user.lastName}</Titles>
        </Contents>
    </Buttons>
    ))}
</Suspense>
</Sections>
</Contents>
</Bases>
)   
}
