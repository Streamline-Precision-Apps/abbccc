"use server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const method = request.nextUrl.searchParams.get("method");

    if (!method) {
      return NextResponse.json({ error: "Method is required" }, { status: 400 });
    }

    const name = request.nextUrl.searchParams.get("name");

    switch (method) {
      case "get":
        if (!name) {
          return NextResponse.json({ error: "Cookie name is required" }, { status: 400 });
        }

        const requestedCookie = cookies().get(name)?.value;
        if (!requestedCookie) {
          return NextResponse.json("");
        }

        return NextResponse.json(requestedCookie);

      case "deleteAll":
        const cookieNames = [
          "costCode",
          "currentPageView",
          "equipment",
          "jobSite",
          "startingMileage",
          "timeSheetId",
          "truckId",
          "adminAccess",
          "laborType",
        ];

        try {
          cookieNames.forEach((cookieName) => {
            cookies().delete({
              name: cookieName,
              path: "/",
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              maxAge: 0,
            });
          });

          // Reset `workRole` cookie
          cookies().set({
            name: "workRole",
            value: "",
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });

          return NextResponse.json({ message: "All cookies deleted successfully" });
        } catch (error) {
          console.error("Error deleting cookies:", error);
          return NextResponse.json({ error: "Failed to delete cookies" }, { status: 500 });
        }

      default:
        return NextResponse.json({ error: "Invalid method" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
