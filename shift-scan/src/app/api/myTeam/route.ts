import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GET(req: NextApiRequest & { crewId: string }, res: NextApiResponse) {
    const { crewId } = req;

    if (!crewId) {
        return res.status(400).json({ error: "Crew ID is required" } as { error: string });
    }

    const users = await prisma.crewMember.findMany({
        where: {
            crew_id: parseInt(crewId), // Convert crewId to an integer
        },
        include: {
            employee: true,
        },
    });

    res.status(200).json(users);
}
