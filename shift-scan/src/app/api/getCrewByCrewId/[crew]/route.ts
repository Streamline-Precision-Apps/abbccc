"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { crew: string } }
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const crewId = Number(params.crew);
  if (isNaN(crewId)) {
    return NextResponse.json({ error: "Invalid crew ID" }, { status: 400 });
  }

  try {
    const crewMembers = await prisma.crewMembers.findMany({
      where: { crewId: crewId },
      include: {
        crew: {
          select: {
            name: true,
            description: true,
            crewMembers: {
              select: {
                supervisor: true,
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    permission: true,
                    image: true, // Ensure base64 image field is included
                  },
                },
              },
            },
          },
        },
      },
    });

    const crew = crewMembers[0].crew.crewMembers.map((member) => ({
      id: member.user.id,
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      permission: member.user.permission,
      supervisor: member.supervisor,
      image: member.user.image, // Embed base64 string as a data URL
    }));
    const crewName = crewMembers[0].crew.name;
    const crewDescription = crewMembers[0].crew.description;

    console.log(crew);
    const data = { crew, crewName, crewDescription };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching crew data:", error);
    return NextResponse.json(
      { error: "Failed to fetch crew data" },
      { status: 500 }
    );
  }
}
