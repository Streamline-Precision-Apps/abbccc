/**
 * Utility functions for Firebase Cloud Messaging (FCM) topics
 */

/**
 * Creates a valid FCM condition expression for topics
 *
 * @param topics Array of topics or a single topic string
 * @param operator Logical operator to combine topics ('OR' or 'AND')
 * @returns A valid FCM condition string for use with admin.messaging().send()
 *
 * @example
 * // Single topic
 * createTopicCondition('weather')
 * // Result: "'weather' in topics"
 *
 * @example
 * // Multiple topics with OR logic (user subscribed to any of these)
 * createTopicCondition(['news', 'sports'], 'OR')
 * // Result: "'news' in topics || 'sports' in topics"
 *
 * @example
 * // Multiple topics with AND logic (user subscribed to all of these)
 * createTopicCondition(['premium', 'sports'], 'AND')
 * // Result: "'premium' in topics && 'sports' in topics"
 */
export function createTopicCondition(
  topics: string | string[],
  operator: "OR" | "AND" = "OR",
): string {
  // Handle single topic case
  if (typeof topics === "string") {
    return `'${topics}' in topics`;
  }

  // Validate topics array
  if (!Array.isArray(topics) || topics.length === 0) {
    throw new Error("Topics must be a non-empty string or array");
  }

  // FCM has a limit of 5 topics in a condition
  if (topics.length > 5) {
    throw new Error("FCM supports a maximum of 5 topics in a condition");
  }

  // Format each topic and join with the appropriate operator
  const op = operator === "AND" ? " && " : " || ";
  return topics.map((topic) => `'${topic}' in topics`).join(op);
}

/**
 * Creates a complex topic condition with nested AND/OR logic
 *
 * @param condition An object specifying topics and logic
 * @returns A valid FCM condition string
 *
 * @example
 * // User must be subscribed to 'news' AND either 'sports' OR 'weather'
 * createComplexTopicCondition({
 *   and: [
 *     'news',
 *     { or: ['sports', 'weather'] }
 *   ]
 * })
 * // Result: "'news' in topics && ('sports' in topics || 'weather' in topics)"
 */
export function createComplexTopicCondition(condition: TopicCondition): string {
  if (typeof condition === "string") {
    return `'${condition}' in topics`;
  }

  if (Array.isArray(condition)) {
    throw new Error("Top-level condition cannot be an array");
  }

  if ("and" in condition) {
    return processAndCondition(condition.and);
  }

  if ("or" in condition) {
    return processOrCondition(condition.or);
  }

  throw new Error("Invalid condition format");
}

// Process AND conditions
function processAndCondition(conditions: (string | TopicCondition)[]): string {
  if (conditions.length > 5) {
    throw new Error("FCM supports a maximum of 5 topics in a condition");
  }

  return conditions.map(processCondition).join(" && ");
}

// Process OR conditions
function processOrCondition(conditions: (string | TopicCondition)[]): string {
  if (conditions.length > 5) {
    throw new Error("FCM supports a maximum of 5 topics in a condition");
  }

  const processed = conditions.map(processCondition).join(" || ");

  // Add parentheses for nested OR conditions
  return conditions.length > 1 ? `(${processed})` : processed;
}

// Process individual condition
function processCondition(condition: string | TopicCondition): string {
  if (typeof condition === "string") {
    return `'${condition}' in topics`;
  }

  if (Array.isArray(condition)) {
    throw new Error("Nested condition cannot be an array");
  }

  if ("and" in condition) {
    return processAndCondition(condition.and);
  }

  if ("or" in condition) {
    return processOrCondition(condition.or);
  }

  throw new Error("Invalid nested condition format");
}

// Types
type TopicCondition =
  | string
  | { and: (string | TopicCondition)[] }
  | { or: (string | TopicCondition)[] };
