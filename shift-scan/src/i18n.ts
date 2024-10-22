import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookie = cookies();
  const localeCookie = (await cookie).get("locale")?.value || "en"; // Default to 'en' if not set

  return {
    locale: localeCookie,
    messages: (await import(`../messages/${localeCookie}.json`)).default,
  };
});
