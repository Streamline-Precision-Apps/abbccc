import prisma from "@/lib/prisma";
//TODO: Add Flagging of Timecards here
export async function GET() {
  try {
    const timecards = await prisma.timeSheet.findMany({
      where: {
        OR: [
          { endTime: null },
          {
            startTime: {
              gte: new Date(
                new Date().setDate(new Date().getDate() - 1)
              ).toISOString(), // Previous day
              lt: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), // Less than current day start
            },
          },
          {
            endTime: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), // Current day start
              lt: new Date(
                new Date().setDate(new Date().getDate() + 1)
              ).toISOString(), // Less than next day
            },
          },
        ],
      },
    });

    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999); // Set to 11:59:59 PM of the current day
    const midnightISOString = new Date(
      midnight.getTime() - new Date().getTimezoneOffset() * 60 * 1000
    ).toISOString();

    const nextDayStart = new Date(midnight);
    nextDayStart.setMilliseconds(1); // Start the next segment at 00:00:00
    const nextDayStartISOString = new Date(
      nextDayStart.getTime() - new Date().getTimezoneOffset() * 60 * 1000
    ).toISOString();
    // Process timecards individually
    for (const card of timecards) {
      // Update the existing timecard with endTime set to midnight
      if (card.endTime === null && card.workType === "TASCO") {
        await prisma.timeSheet.update({
          where: { id: card.id },
          data: {
            ...card,
            endTime: midnightISOString,
          },
        });

        // Create a new timecard for the next day's segment
        await prisma.timeSheet.create({
          data: {
            ...card,
            id: undefined, // Exclude ID if auto-generated
            startTime: nextDayStartISOString,
            endTime: null, // Keep open if the shift hasn't ended
          },
        });
      } else if (card.endTime === null) {
        await prisma.timeSheet.update({
          where: { id: card.id },
          data: {
            ...card,
            endTime: midnightISOString,
            statusComment: "Forgot to clock out of app",
            // status:"FLAGGED"
          },
        });
      }
    }

    console.log(`${timecards.length} timecards processed.`);
  } catch (error) {
    console.error("Error processing timecards:", error);
  }

  return Response.json({ success: true });
}
