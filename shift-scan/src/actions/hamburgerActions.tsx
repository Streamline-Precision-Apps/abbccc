// "use server";

// import prisma from "@/lib/prisma";
// import { revalidatePath } from "next/cache";

// export async function updateSetting(userId: any, setting: any, value: any) {
//     await prisma.userSettings.update({
//         where: { userId },
//         data: { [setting]: value },
//     });
//     revalidatePath("/hamburger/settings"); // Adjust the path to revalidate as needed
// }