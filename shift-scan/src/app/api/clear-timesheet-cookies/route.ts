import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Clear all timesheet-related cookies
    const cookiesToClear = [
      "prevTimeSheet",
      "currentPageView", 
      "workRole",
      "jobSite",
      "costCode",
      "laborType",
      "equipment",
      "truck",
      "startingMileage"
    ];

    cookiesToClear.forEach(cookieName => {
      cookieStore.delete(cookieName);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to clear timesheet cookies:", error);
    return NextResponse.json(
      { error: "Failed to clear cookies" },
      { status: 500 }
    );
  }
}
