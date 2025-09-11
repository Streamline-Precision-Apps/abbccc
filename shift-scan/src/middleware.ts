import { NextResponse, userAgent } from "next/server";
import { NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { auth } from "@/auth";
import is from "zod/v4/locales/is.cjs";

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

const MOBILE_ALLOWED_PATHS = [
  "/dashboard",
  "/break",
  "/clock",
  "/forms",
  "/hamburger",
  "/signin",
  "/timesheets",
  "/continue-timesheet",
  "/",
];

/**
 * Middleware function that runs before each request
 * Checks if the user is authenticated and redirects to signin if not
 */
export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const { isBot, device } = userAgent(request);

    const isMobile = device.type === "mobile" || device.type === "tablet";

    // adds bot detection to app
    if (isBot) {
      return NextResponse.redirect(new URL("/not-authorized", request.url));
    }

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
    const isAdmin =
      userPermission === "ADMIN" || userPermission === "SUPERADMIN";

    if (isMobile) {
      // Allow API routes for mobile
      if (pathname.startsWith("/api/")) {
        return NextResponse.next();
      }
      // On mobile, check if the current path starts with any allowed mobile path
      const isMobileAllowedPath = MOBILE_ALLOWED_PATHS.some((path) => {
        // For root path, only exact match is allowed
        if (path === "/") {
          return pathname === "/";
        }
        // For other paths, allow the exact path or any subpath
        return pathname === path || pathname.startsWith(`${path}/`);
      });

      if (!isMobileAllowedPath) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else {
      const isAdminPath = ADMIN_PATHS.some((path) => pathname.startsWith(path));

      if (isAdminPath && !isAdmin) {
        return NextResponse.redirect(new URL("/not-authorized", request.url));
      }
      //they have access to API routes
      if (isAdmin && pathname.startsWith("/api/")) {
        return NextResponse.next();
      }
      // If the user is an admin and trying to access mobile-only paths, redirect to admin section
      if (isAdmin) {
        // Only apply mobile path restrictions if not in development
        if (process.env.NODE_ENV !== "development") {
          const isMobilePath = MOBILE_ALLOWED_PATHS.some((path) => {
            // Skip the check for paths that are allowed on both mobile and desktop
            if (path === "/signin") {
              return false;
            }

            // Check if the current path matches a mobile-only path
            if (path === "/") {
              return pathname === "/";
            }
            return pathname === path || pathname.startsWith(`${path}/`);
          });

          if (isMobilePath) {
            return NextResponse.redirect(new URL("/admins", request.url));
          }
        }
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
