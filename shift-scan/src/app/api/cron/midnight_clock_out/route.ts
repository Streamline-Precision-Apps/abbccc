import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const timecards = await prisma.timeSheet.findMany({
      where: {
        OR: [
          { endTime: null }, // Open timesheets
          {
            AND: [
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
        ],
      },
    });

    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999); // Set to 11:59:59 PM of the current day

    const nextDayStart = new Date(midnight);
    nextDayStart.setMilliseconds(1); // Start the next segment at 00:00:00

    // Process timecards individually
    for (const card of timecards) {
      // Update the existing timecard with endTime set to midnight
      await prisma.timeSheet.update({
        where: { id: card.id },
        data: {
          ...card,
          endTime: midnight.toISOString(),
        },
      });

      // Create a new timecard for the next day's segment
      await prisma.timeSheet.create({
        data: {
          ...card,
          id: undefined, // Exclude ID if auto-generated
          startTime: nextDayStart.toISOString(),
          endTime: null, // Keep open if the shift hasn't ended
        },
      });
    }

    console.log(`${timecards.length} timecards processed.`);
  } catch (error) {
    console.error("Error processing timecards:", error);
  }

  return Response.json({ success: true });
}
