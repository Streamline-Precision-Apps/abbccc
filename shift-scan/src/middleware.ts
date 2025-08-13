import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { auth } from "@/auth";

/**
 * Array of paths that don't require authentication
 * Users can access these paths without being logged in
 */
const PUBLIC_PATHS = [
  "/information",
  "/signin",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/manifest.json",
  "/sentry-example-page",
];

// Paths that require ADMIN or SUPERADMIN permissions
const ADMIN_PATHS = ["/admins"];

/**
 * Middleware function that runs before each request
 * Checks if the user is authenticated and redirects to signin if not
 */
export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Allow public paths without authentication
    if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // Get the session
    const session = await auth();

    // If user is not authenticated and trying to access a protected route,
    // redirect to signin page
    if (!session) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    const userPermission = session.user?.permission;

    const isAdminPath = ADMIN_PATHS.some((path) => pathname.startsWith(path));

    if (isAdminPath) {
      if (userPermission !== "ADMIN" && userPermission !== "SUPERADMIN") {
        return NextResponse.redirect(new URL("/not-authorized", request.url));
      }
    }

    // User is authenticated, allow access
    return NextResponse.next();
  } catch (error) {
    Sentry.captureException(error);
    console.error("Middleware error:", error);
    return NextResponse.json(
      { error: "Internal middleware error" },
      { status: 500 },
    );
  }
}

export const config = {
  // runtime: "nodejs",
  matcher: [
    // Match all paths except Next.js internal paths and static files
    "/((?!_next|.*\\..*).*)",
    // Match API routes except auth routes (which are handled separately)
    "/api/((?!auth).*)",
  ],
};
