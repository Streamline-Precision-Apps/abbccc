export const calculateDuration = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffMs = endDate.getTime() - startDate.getTime(); // Difference in milliseconds

  if (diffMs < 0) return "Invalid time range";

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // Convert to hours
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Remaining minutes
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000); // Remaining seconds

  return `${diffHours}h ${diffMinutes}m ${diffSeconds}s`;
};
