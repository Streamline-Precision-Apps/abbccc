"use server";
import prisma from "@/lib/prisma";
import Image from "next/image";
import TeamInfoButton from "./button";
import employeeInfo from "./[id]/employee-info";

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
        <div className="w-full flex flex-col items-center p-5 rounded-2xl font-bold">
            
            {crew.map((employee) => (
            <TeamInfoButton id={employee.id} key={employee.id} >
            <div key={employee.id} className="w-full flex flex-row ">
                <Image src={"/profile-icon.png"} alt="Team Image" width={80} height={80} className="rounded-full" />
                <div className="w-full flex flex-row space-x-5 justify-center items-center">
                <h2 className="text-3xl">{employee.employee.first_name} {employee.employee.last_name}</h2>
                </div>
            </div>
            </TeamInfoButton>
            ))}
            </div>
        );
    }