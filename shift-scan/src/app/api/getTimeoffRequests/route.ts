"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function GET(
  request: Request,
  props: {
    params: Params;
    searchParams: SearchParams;
  }
) {
  const session = await auth();
  const userId = session?.user?.id;
  const manager = `${session?.user?.firstName} ${session?.user?.lastName}`;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract query parameters
  const searchParams = await props.searchParams;
  const type = searchParams.type;
  const params = await props.params;

  try {
    // Validate `params.id`
    const requestId = Number(params.id);
    if (isNaN(requestId)) {
      return NextResponse.json(
        { error: "Invalid ID parameter" },
        { status: 400 }
      );
    }

    // Fetch time-off requests /getTimeoffRequests/5?type=sent
    if (type === "sent") {
      // Fetch received requests based on `id` and `userId`
      const sentContent = await prisma.timeoffRequestForms.findMany({
        where: {
          id: requestId,
          employeeId: userId,
        },
      });

      // If no content is found, return a 404 response use this to redirect
      if (sentContent.length === 0) {
        return NextResponse.json(
          { error: "No content found" },
          { status: 404 }
        );
      }

      return NextResponse.json(sentContent);
    }

    if (type === "received") {
      // Fetch received requests based on `id` and `userId`

      const receivedContent = await prisma.timeoffRequestForms.findMany({
        where: {
          id: requestId,
          status: "PENDING",
        },
        include: {
          employee: true,
        },
      });

      // If no content is found, return a 404 response use this to redirect
      if (receivedContent.length === 0) {
        return NextResponse.json(
          { error: "No content found" },
          { status: 404 }
        );
      }
      const receivedContentWManager = receivedContent.map((request) => ({
        manager: manager,
        ...request,
      }));

      return NextResponse.json(receivedContentWManager);
    }

    // If type is not recognized, return an error
    return NextResponse.json(
      { error: "Invalid type parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching Time Off Requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch time off requests" },
      { status: 500 }
    );
  }
}
