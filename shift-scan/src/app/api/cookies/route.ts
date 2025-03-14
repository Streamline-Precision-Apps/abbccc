"use server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
// example of using cookies- only works in async
// const tId = await fetch("/api/cookies?method=get&name=timeSheetId").then(
//   (res) => res.json()
// );
export async function GET(request: NextRequest) {
  const method = request.nextUrl.searchParams.get("method");

  if (!method) {
    return NextResponse.json({ error: "Method is required" });
  }

  try {
    const name = request.nextUrl.searchParams.get("name");

    switch (method) {
      case "get":
        if (!name) {
          return NextResponse.json({ error: "Cookie name is required" });
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
        cookieNames.forEach((name) => {
          return cookies().delete({
            name: name,
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 0,
          });
        });

        // Reset `workRole` as well
        cookies().set({
          name: "workRole",
          value: "",
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        return NextResponse.json("");

      default:
        return NextResponse.json({ error: "Invalid method" });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" });
  }
}
