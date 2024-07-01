
import prisma from "@/lib/prisma";
import Image from "next/image";

export default async function TeamCards() {

    const users = await prisma.crewMember.findMany(
        {
            where: {
                crew_id: 1 // Replace with the ID of the crew you want to query
            },
            include: {
                employee: true
            }   
        },
    );
    return (
        <div className="  w-full flex flex-col justify-center items-center p-5 rounded-2xl text-4xl font-bold ">
            {users.map((user) => (
                <button className="bg-app-blue h-1/6 w-full flex flex-row items-center py-5 px-10 rounded-2xl mb-5 ">
                <Image src={"/profile-icon.png"} alt="Team Image" width={80} height={80} className="rounded-full" />
                <div className="w-full flex flex-row space-x-5 justify-center items-center">
                    <h2 className="text-4xl">{user.employee.first_name} </h2>
                    <h2 className="text-4xl">{user.employee.last_name}</h2>
                </div>
                </button>
        ))}
        </div>
    )
}