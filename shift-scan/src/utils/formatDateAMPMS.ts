"use server";
export const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const hours = date.getHours(); // Use local hours instead of UTC
  const minutes = date.getMinutes(); // Use local minutes
  const seconds = date.getSeconds(); // Use local seconds
  const isPM = hours >= 12;
  const formattedHours = hours % 12 || 12; // Converts 0 to 12 for midnight and 13-23 to 1-11 for PM times
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes; // Ensures two-digit minutes
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds; // Ensures two-digit seconds
  const period = isPM ? "PM" : "AM";

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${period}`;
};
