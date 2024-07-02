
import prisma from "@/lib/prisma";
import Image from "next/image";
import TeamInfoButton from "./button";

export default async function TeamCards() {

    const crew = await prisma.crewMember.findMany(
        {
            where: {
                crew : {
                    id: 1
                }
            },
            include: {
                employee: true,
                
            }
        },
    );
    // console.table(crew)
    return (
        <div className="w-full flex flex-col justify-center items-center p-5 rounded-2xl text-4xl font-bold">
            
            {crew.map((key) => (
            <TeamInfoButton id={key.id} >
            <div key={key.id} className="w-full flex flex-row items-center rounded-2xl">
                <Image src={"/profile-icon.png"} alt="Team Image" width={80} height={80} className="rounded-full" />
                <div className="w-full flex flex-row space-x-5 justify-center items-center">
                <h2 className="text-4xl">{key.employee.first_name} {key.employee.last_name}</h2>
                </div>
            </div>
            </TeamInfoButton>
            ))}
            </div>
        );
    }