/**
 * Utility functions for handling authentication-related errors during sign-out
 */

/**
 * Check if an error should be silently ignored during the sign-out process
 * @param error - The error to check
 * @returns true if the error should be silently ignored, false otherwise
 */
export function isAuthenticationError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('Unexpected token') ||
      error.message.includes('<!DOCTYPE') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('Authentication required') ||
      error.message.includes('Not Authorized') ||
      error.message.includes('Unauthorized')
    );
  }
  return false;
}

/**
 * Check if a fetch response indicates a redirect to the sign-in page
 * @param response - The fetch Response object
 * @returns true if the response is an HTML redirect to sign-in
 */
export function isSignInRedirect(response: Response): boolean {
  const contentType = response.headers.get('content-type');
  return contentType?.includes('text/html') ?? false;
}

/**
 * Safely handle server action calls that might fail during sign-out
 * @param serverAction - The server action function to call
 * @param args - Arguments to pass to the server action
 * @param onError - Optional callback for handling non-authentication errors
 */
export async function safeServerAction<T extends unknown[], R>(
  serverAction: (...args: T) => Promise<R>,
  args: T,
  onError?: (error: Error) => void
): Promise<R | void> {
  try {
    return await serverAction(...args);
  } catch (error) {
    if (isAuthenticationError(error)) {
      // Silently ignore authentication errors during sign-out
      return;
    }
    
    if (onError && error instanceof Error) {
      onError(error);
    } else if (error instanceof Error) {
      console.error('Server action error:', error);
    }
  }
}