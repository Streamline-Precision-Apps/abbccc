import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "@/auth";

/**
 * Array of paths that don't require authentication
 * Users can access these paths without being logged in
 */
const PUBLIC_PATHS = [
  "/signin",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/manifest.json",
];

/**
 * Middleware function that runs before each request
 * Checks if the user is authenticated and redirects to signin if not
 */
export async function middleware(request: NextRequest) {
  // Check if the path is in the public paths
  const isPublicPath = PUBLIC_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Allow access to public paths without authentication
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get the session
  const session = await auth();

  // If user is not authenticated and trying to access a protected route,
  // redirect to signin page
  if (!session) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // User is authenticated, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except Next.js internal paths and static files
    "/((?!_next|.*\\..*).*)",
    // Match API routes except auth routes (which are handled separately)
    "/api/((?!auth).*)",
  ],
};
