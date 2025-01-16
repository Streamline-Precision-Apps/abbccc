"use server";
import { cookies } from "next/headers";

export async function setLocale(isSpanish: boolean) {
  try {
    (await cookies()).set("locale", isSpanish ? "es" : "en", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  } catch (error) {
    console.error("Failed to set locale cookie:", error);
  }
}

// setting the cookie for workRole to either mechanic, tasco, truck, general
export async function setWorkRole(workRole: string) {
  try {
    cookies().set("workRole", workRole, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  } catch (error) {
    console.error("Failed to set locale cookie:", error);
  }
}

// idea of this cookie is to set it to true if the user has access to the dashboard and false if not
export async function setDashboardAccess(dashboard_access: boolean) {
  try {
    cookies().set("dashboard_access", dashboard_access ? "true" : "false", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  } catch (error) {
    console.error("Failed to set locale cookie:", error);
  }
}
