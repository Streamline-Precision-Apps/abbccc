// this is a rest api endpoint
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const created = await prisma.user.create({
            ...body 
        });

        return new NextResponse(JSON.stringify(created));

    } catch (error) {
        // Log the error for debugging
        console.error('Failed to create user:', error);
    }
}

export async function GET(req: NextRequest) {
    const result = await prisma.user.findMany()
    return NextResponse.json(result)
    }

