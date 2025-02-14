import { intervalToDuration, formatDuration } from "date-fns";

export function getFormattedDuration(
  startTimeISO: string,
  endTimeISO: string
): string {
  // Convert the ISO strings to Date objects
  const start = new Date(startTimeISO);
  const end = new Date(endTimeISO);

  // Calculate the duration object between the start and end times
  const duration = intervalToDuration({ start, end });

  // Format the duration object into a string (showing only hours and minutes)
  return formatDuration(duration, { format: ["hours", "minutes"] });
}
