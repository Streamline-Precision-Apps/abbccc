"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const filter = url.searchParams.get("filter");

  try {
    let jobsiteData = [];

    if (filter === "Temporary") {
      jobsiteData = await prisma.jobsite.findMany({
        // TODO:Add this back once DB has been updated.
        // where: {
        //   status: "TEMPORARY",
        // },
        select: {
          CCTags: true,
          id: true,
          qrId: true,
          isActive: true,
          status: true,
          name: true,
          address: true,
          city: true,
          state: true,
          country: true,
          description: true,
          comment: true,
        },
      });
    } else if (filter === "Active") {
      jobsiteData = await prisma.jobsite.findMany({
        where: {
          isActive: true,
        },
        select: {
          CCTags: true,
          id: true,
          qrId: true,
          isActive: true,
          status: true,
          name: true,
          address: true,
          city: true,
          state: true,
          country: true,
          description: true,
          comment: true,
        },
      });
    } else if (filter === "Inactive") {
      jobsiteData = await prisma.jobsite.findMany({
        where: {
          isActive: false,
        },
        select: {
          CCTags: true,
          id: true,
          qrId: true,
          isActive: true,
          status: true,
          name: true,
          address: true,
          city: true,
          state: true,
          country: true,
          description: true,
          comment: true,
        },
      });
    } else {
      jobsiteData = await prisma.jobsite.findMany({
        select: {
          CCTags: true,
          id: true,
          qrId: true,
          isActive: true,
          status: true,
          name: true,
          address: true,
          city: true,
          state: true,
          country: true,
          description: true,
          comment: true,
        },
      });
    }

    return NextResponse.json(jobsiteData);
  } catch (error) {
    console.error("Error fetching jobsite data:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobsite data" },
      { status: 500 }
    );
  }
}
