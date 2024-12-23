export const formatTime = (timestamp: string | Date): string => {
  const date = new Date(timestamp);

  // Check for invalid date
  if (isNaN(date.getTime())) {
    console.error("Invalid timestamp:", timestamp);
    return "Invalid Time";
  }

  // Convert the UTC time to local time
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

  // Format the local time
  return localDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // 12-hour format with AM/PM
  });
};
