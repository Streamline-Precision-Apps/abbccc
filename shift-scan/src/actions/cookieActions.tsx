"use server";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Options = {
  label: string;
  code: string;
};

export async function getCookie(cookieName: string) {
  const session = await auth();
  // Check if the user is authenticated
  if (!session) {
    console.error("Not Authorized", 201);
    // Perform the redirect to the signin page
    redirect("/signin");
  }
  try {
    const cookie = cookies().get(cookieName);
    if (!cookie || cookie?.value) {
      throw new Error(`Cookie ${cookieName} not found or has no value`);
    }
    return cookie.value;
  } catch (error) {
    console.error("Failed to get cookie:", error);
    return null;
  }
}
/*-----------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------
LOCALE COOKIES
- setting the cookie for locale to either es or en for spanish or english in app
-------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------
*/
export async function setLocale(isSpanish: boolean) {
  try {
    cookies().set("locale", isSpanish ? "es" : "en", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  } catch (error) {
    console.error("Failed to set locale cookie:", error);
  }
}

/*-----------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------

Dashboard Access COOKIES
- setting the cookie for workRole to either mechanic, tasco, truck, general
- deleting the cookie for workRole to either mechanic, tasco, truck, general
- setting the cookie for dashboard access to true or false
- cookie for setting job site access
- cookie for setting cost code access
- cookie for setting time sheet access

-------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------
*/
// setting the cookie for workRole to either mechanic, tasco, truck, general
export async function setWorkRole(workRole: string) {
  if (
    workRole !== "mechanic" &&
    workRole !== "tasco" &&
    workRole !== "truck" &&
    workRole !== "general" &&
    workRole !== ""
  ) {
    throw new Error("Not Authorized - Invalid Work Role");
  }

  try {
    cookies().set({
      name: "workRole",
      value: workRole,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days - made this to not have errors occur is logging out is forgotten
    });
  } catch (error) {
    console.error("Failed to set locale cookie:", error);
  }
}

export async function setLaborType(laborType: string) {
  const VALID_LABOR_TYPES = [
    "truckDriver",
    "truckEquipmentOperator",
    "truckLabor",
    "mechanic",
    "general",
    "tascoAbcdLabor",
    "tascoAbcdEquipment",
    "tascoEEquipment",
    "",
  ];

  if (!VALID_LABOR_TYPES.includes(laborType)) {
    console.log(laborType);
    throw new Error("Not Authorized - Invalid labor type");
  }
  console.log(laborType);
  try {
    if (laborType === "tascoEEquipment") {
      cookies().set({
        name: "laborType",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days - made this to not have errors occur is logging out is forgotten
      });
    } else {
      cookies().set({
        name: "laborType",
        value: laborType,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days - made this to not have errors occur is logging out is forgotten
      });
    }
  } catch (error) {
    console.error("Failed to set locale cookie:", error);
  }
}

// deletes the cookie for workRole to either mechanic, tasco, truck, general
export async function RemoveWorkRole() {
  const session = await auth();
  // Check if the user is authenticated
  if (!session) {
    console.error("Not Authorized - RemoveWorkRole", 201);
    // Perform the redirect to the signin page
    redirect("/signin");
  }
  try {
    cookies().delete("workRole");
  } catch (error) {
    console.error("Failed to delete locale cookie:", error);
  }
}

// idea of this cookie is to set it to true if the user has access to the dashboard and false if not
export async function setCurrentPageView(currentPageView: string) {
  try {
    cookies().set({
      name: "currentPageView",
      value: currentPageView,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days  // Expires in 30 days - made this to not have errors occur is logging out is forgotten
    });
  } catch (error) {
    console.error("Failed to set locale cookie:", error);
  }
}

// cookie for setting job site access
export async function setProfilePicture(profilePicture: string) {
  try {
    cookies().set({
      name: "profilePicture",
      value: profilePicture,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days - made this to not have errors occur is logging out is forgotten
    });
  } catch (error) {
    console.error("Failed to set locale cookie:", error);
  }
}

// cookie for setting job site access
export async function setJobSite(jobSite: Options | null) {
  try {
    cookies().set({
      name: "jobSite",
      value: `${jobSite?.code}|${jobSite?.label}`,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days - made this to not have errors occur is logging out is forgotten
    });
  } catch (error) {
    console.error("Failed to set locale cookie:", error);
  }
}

export async function setCostCode(costCode: string) {
  try {
    cookies().set({
      name: "costCode",
      value: costCode,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days - made this to not have errors occur is logging out is forgotten
    });
  } catch (error) {
    console.error("Failed to set locale cookie:", error);
  }
}

export async function setEquipment(equipment: string) {
  try {
    cookies().set({
      name: "equipment",
      value: equipment,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days - made this to not have errors occur is logging out is forgotten
    });
  } catch (error) {
    console.error("Failed to set locale cookie:", error);
  }
}
export async function setTruck(truck: string) {
  try {
    cookies().set({
      name: "truckId",
      value: truck,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days - made this to not have errors occur is logging out is forgotten
    });
  } catch (error) {
    console.error("Failed to set locale cookie:", error);
  }
}

export async function setMechanicProjectID(mechanicProjectID: string) {
  try {
    cookies().set({
      name: "mechanicProjectID",
      value: mechanicProjectID,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days - made this to not have errors occur is logging out is forgotten
    });
  } catch (error) {
    console.error("Failed to set locale cookie:", error);
  }
}

export async function setStartingMileage(startingMileage: string) {
  try {
    cookies().set({
      name: "startingMileage",
      value: startingMileage,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days - made this to not have errors occur is logging out is forgotten
    });
  } catch (error) {
    console.error("Failed to set locale cookie:", error);
  }
}

export async function setPrevTimeSheet(timeSheetId: string) {
  const session = await auth();
  // Check if the user is authenticated
  if (!session) {
    throw new Error("Not Authorized - setPrevTimeSheet");
  }
  try {
    cookies().set({
      name: "timeSheetId",
      value: timeSheetId,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days - made this to not have errors occur is logging out is forgotten
    });
  } catch (error) {
    console.error("Failed to set locale cookie:", error);
  }
}

/*-----------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------

ADMIN ACCESS COOKIES

-------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------
*/
// a function to set the cookie for admin access
export async function setAdminAccess() {
  const session = await auth();
  // Check if the user is authenticated
  if (!session) {
    console.error("Not Authorized - setAdminAccess", 201);
    // Perform the redirect to the signin page
    redirect("/signin");
  }
  // Check if the user has the required permission
  const permission = session.user.permission;
  if (permission !== "ADMIN" && permission !== "SUPERADMIN") {
    console.error("Not Authorized - setAdminAccess", 201);
    // Perform the redirect to the signin page
    redirect("/dashboard");
  }
  // give the user access to the dashboard
  try {
    cookies().set({
      name: "adminAccess",
      value: "true",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days  // Expires in 30 days - made this to not have errors occur is logging out is forgotten
    });
  } catch (error) {
    console.error("Failed to set locale cookie:", error);
  }
}

// a function to remove the cookie for admin access
export async function RemoveAdminAccess() {
  try {
    cookies().delete("adminAccess");
  } catch (error) {
    console.error("Failed to delete locale cookie:", error);
  }
}
