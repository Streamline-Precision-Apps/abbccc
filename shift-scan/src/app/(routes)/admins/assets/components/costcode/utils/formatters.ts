/**
 * Utility functions for formatting and manipulating cost code data
 */

/**
 * Formats a cost code name by properly separating number and description parts
 *
 * @param name Full cost code name including number and description
 * @param options Formatting options
 * @returns Properly formatted cost code name
 */
export function formatCostCodeName(
  name: string | undefined,
  options: { includeInactiveStatus?: boolean; inactiveText?: string } = {}
): string {
  if (!name) return "";

  const parts = name.split(" ");
  const number = parts[0];
  const description = parts.slice(1).join(" ");

  const formattedName = `${number} - ${description}`;

  return formattedName;
}

/**
 * Extracts the number part of a cost code name
 *
 * @param name Full cost code name
 * @returns The number portion of the cost code name
 */
export function getCostCodeNumber(name: string | undefined): string {
  if (!name) return "";

  const parts = name.split(" ");
  return parts[0] || "";
}

/**
 * Extracts the descriptive part of a cost code name
 *
 * @param name Full cost code name
 * @returns The descriptive portion of the cost code name
 */
export function getCostCodeDescription(name: string | undefined): string {
  if (!name) return "";

  const parts = name.split(" ");
  return parts.slice(1).join(" ") || "";
}

/**
 * Combines a cost code number and description into a full name
 *
 * @param number The cost code number (e.g., "#123")
 * @param description The descriptive name
 * @returns Full combined cost code name
 */
export function combineCostCodeName(
  number: string,
  description: string
): string {
  const formattedNumber = number.startsWith("#") ? number : `#${number}`;
  return `${formattedNumber} ${description}`;
}
