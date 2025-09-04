import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  triggerFormSubmitted,
  triggerItemApprovalRequested,
  triggerTimecardChanged,
  triggerTimesheetSubmitted,
} from "@/lib/notifications";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // Ensure user is authenticated
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get parameters from request body
    const { type, id, userName, message, additionalInfo } = await req.json();

    let result;

    // Trigger the appropriate notification based on type
    switch (type) {
      case "timesheet":
        result = await triggerTimesheetSubmitted({
          timesheetId: id,
          submitterName: userName,
          message,
        });
        break;

      case "form":
        result = await triggerFormSubmitted({
          formId: id,
          submitterName: userName,
          message,
          formType: additionalInfo,
        });
        break;

      case "item":
        result = await triggerItemApprovalRequested({
          itemId: id,
          requesterName: userName,
          message,
          itemType: additionalInfo,
        });
        break;

      case "timecard-change":
        result = await triggerTimecardChanged({
          timesheetId: id,
          changerName: userName,
          message,
          changeType: additionalInfo,
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid notification type" },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      message: `${type} notification triggered successfully`,
    });
  } catch (error: any) {
    console.error("Error triggering test notification:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 },
    );
  }
}
