// this page is used to determine if the user is authenticated or not via middleware

/**
 * An array of auth routes for the app.
 * these routes are not protected but redirect to the landing page if a user is authenticated
 * @type {string[]}
 */
export const authRoutes = [
  "/signin", // landing page
  "/signin/new-password", // a way to confirm password reset via email
  "/signin/forgot-password", // a way to reset password
];

/**
 * The prefix for Api routes
 * Routes that start with this prefix are used for API auth purposes and should not be protected
 * @type {string}
 */
export const ApiAuthPrefix = "/api/auth";

/**
 * The default login redirect
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
