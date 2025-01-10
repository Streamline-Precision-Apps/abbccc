/**
 * Splits a time card into multiple segments if it spans across midnight.
 *
 * @function SplitTimeSheet
 * @param {string} startTimeISO - The start time in ISO 8601 format (e.g., "2025-01-10T20:00:00Z").
 * @param {string} endTimeISO - The end time in ISO 8601 format (e.g., "2025-01-11T04:00:00Z").
 * @returns {Array<Object>} An array of split time cards with `start` and `end` in ISO 8601 format.
 *
 * @example
 * const result = splitTimeCard("2025-01-10T20:00:00Z", "2025-01-11T04:00:00Z");
 * console.log(result);
 */
export function SplitTimeSheet(startTimeISO: string, endTimeISO: string) {
  const splitTimeCards = [];
  const startDate = new Date(startTimeISO);
  const endDate = new Date(endTimeISO);

  if (startDate.getDate() !== endDate.getDate()) {
    // Create the end time for the first segment (11:59:59 PM)
    const midnight = new Date(startDate);
    midnight.setHours(23, 59, 59, 999);

    // Start the next segment at midnight
    const nextDayStart = new Date(midnight);
    nextDayStart.setMilliseconds(1);

    splitTimeCards.push({
      start: startDate.toISOString(),
      end: midnight.toISOString(),
    });
    splitTimeCards.push({
      start: nextDayStart.toISOString(),
      end: endDate.toISOString(),
    });
  } else {
    // Single segment
    splitTimeCards.push({
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    });
  }

  return splitTimeCards;
}
