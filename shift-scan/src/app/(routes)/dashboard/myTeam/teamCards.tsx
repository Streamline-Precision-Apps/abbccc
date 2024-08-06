"use server";
import prisma from "@/lib/prisma";
import Image from "next/image";
import TeamInfoButton from "./button";
import { cookies } from "next/headers";

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
    // console.log(crew.map((userCrewId) => userCrewId.user.id))
    return (
        <div className="w-full flex flex-col items-center p-5 rounded-2xl font-bold">
            {}
            {crew.map((userCrewId) => (
            <TeamInfoButton id={Number(userCrewId.user.id)} key={userCrewId.user.id} >
            <div key={userCrewId.id} className="w-full flex flex-row ">
                <Image src={"/profile.svg"} alt="Team Image" width={80} height={80} className="rounded-full" />
                <div className="w-full flex flex-row space-x-5 justify-center items-center">
                <h2 className="text-3xl">{userCrewId.user.firstName} {userCrewId.user.lastName}</h2>
                </div>
            </div>
            </TeamInfoButton>
            ))}
        </div>
        );
    }