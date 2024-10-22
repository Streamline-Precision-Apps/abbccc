export { auth as middleware } from "@/auth";

// import {
//   DEFAULT_LOGIN_REDIRECT,
//   ApiAuthPrefix,
//   authRoutes,
// } from "@/app/routes";
// import { redirect } from "next/dist/server/api-utils";

// export default middleware((req : Request) => {
//   const { nextUrl } = req;
//   const isLoggedIn = !!req.user;
//   const isApiAuthRoute = nextUrl.pathname.startsWith(ApiAuthPrefix);
//   const isAuthRoute = authRoutes.includes(nextUrl.pathname);

//   if (isApiAuthRoute) {
//     return null;
//   }
//   if (isAuthRoute) {
//     if (isLoggedIn) {
//       return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//     }
//     return null;
//   }
//   if (!isLoggedIn) {
//     return Response.redirect(new URL("/signin", nextUrl));
// }
// return null;

// });

export const config = {
  matcher: [
    //     // Skip Next.js internals and all static files, unless found in search params
    //     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    //     // Always run for API routes
    //     "/(api|trpc)(.*)", "/",
  ],
};
