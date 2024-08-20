"use server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";


/* Todo: Make the  team card section use zacks code and get ride of the button 
- provide routing for the buttons to go to the correct page */
export default async function TeamCards() {
    const user = cookies().get("user");
    const id = user?.value;
    const userCrewId = await prisma.user.findUnique({
        where: {
            id: id
        },
        include: {
            crewMembers: true
        }
    }).then((data) => {
        return data?.crewMembers[0].crew_id
    })
    
    const crew = await prisma.crewMember.findMany( 
        {
            where: {
                // supervisor: false,
                crew : {
                    id: userCrewId
                }
            },
            include: {
                user: true,
                crew: true
                
            }
        },
    );
    return (
        <div>
            {crew.map((userCrewId) => (
            <Buttons id={userCrewId.user.id} href={`/dashboard/myTeam/${userCrewId.user.id}`} variant={"default"} size={"listLg"}>
                <Contents variant={"image" } size={"listImage"}>
                    <Images titleImg={userCrewId.user.image ?? "/johnDoe.webp"} titleImgAlt="profile picture" variant={"icon"} size={"default"}></Images>
                </Contents>
                <Contents variant={"row"} size={"listTitle"}>
                    <Titles size={"h1"}>{userCrewId.user.firstName} {userCrewId.user.lastName}</Titles>
                </Contents>
            </Buttons>
            ))}
                <Buttons id="{userCrewId.user.id}" href="/dashboard/myTeam/{userCrewId.user.id}" variant={"default"} size={"listLg"}>
                    <Contents variant={"image" } size={"listImage"}>
                        <Images titleImg="/johnDoe.webp" titleImgAlt="my team" variant={"icon"} size={"default"}></Images>
                    </Contents>
                    <Contents variant={"row"} size={"listTitle"}>
                        <Titles size={"h1"}>Jose Felipe Perez Alverado</Titles>
                    </Contents>
                </Buttons>
        </div>
        );
    }