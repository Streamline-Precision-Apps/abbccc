import "@/app/globals.css";
import { auth } from "@/auth";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Sections } from "@/components/(reusable)/sections";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import prisma from "@/lib/prisma";
import Content from "@/app/(routes)/dashboard/myTeam/content"
import { Suspense } from "react";

export default async function MyTeam(){
    const session = await auth();
    const userId = session?.user.id
    const userCrewData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            crewMembers: {
                select: {
                    crew_id: true,
                    crew: {
                        select: {
                            crewMembers: {
                                select: {
                                    user: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            image: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    
    // Extract crew members from the fetched data
    const crew = userCrewData?.crewMembers[0]?.crew?.crewMembers || [];
    
    return (
    <Content crew={crew}/>
    )

}
