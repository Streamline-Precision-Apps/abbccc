export const calculateDuration = (
  duration: number | string | null,
  start: string,
  end: string
): string => {
  if (typeof duration === "number") {
    // Convert float duration into hours, minutes, and seconds
    const totalSeconds = Math.round(duration * 3600); // 1 hour = 3600 seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((unit) => String(unit).padStart(2, "0"))
      .join(":");
  }

  if (typeof duration === "string" && duration.includes(":")) {
    // Handle the case where duration is provided as a "hh:mm:ss" string
    const time = duration.split(":");
    const hours = Number(time[0]);
    const minutes = Number(time[1]);
    const seconds = Number(time[2]);
    return [hours, minutes, seconds]
      .map((unit) => String(unit).padStart(2, "0"))
      .join(":");
  }

  // Fallback to calculating the duration from start and end times
  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffMs = endDate.getTime() - startDate.getTime(); // Difference in milliseconds
  if (diffMs < 0) return "Invalid time range";

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // Convert to hours
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Remaining minutes
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000); // Remaining seconds

  return [diffHours, diffMinutes, diffSeconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
};
