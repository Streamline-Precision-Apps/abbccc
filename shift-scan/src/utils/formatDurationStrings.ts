import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";

export function formatDurationStrings(
  startDate: Date | string,
  endDate: Date | string
) {
  console.log("start", startDate);
  console.log("end", endDate);
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  const hours = differenceInHours(end, start);
  const minutes = differenceInMinutes(end, start) % 60;

  const seconds = (differenceInSeconds(end, start) % 60) % 60;

  console.log("hours", hours);
  console.log("minutes", minutes);
  console.log("seconds", seconds);

  if (hours > 0) {
    return `${hours} hrs ${minutes} mins`;
  } else if (minutes > 0) {
    return `${minutes} mins `;
  } else {
    return `< 1 min`;
  }
}
