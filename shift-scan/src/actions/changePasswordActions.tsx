"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
const prisma = new PrismaClient();

export async function updatePassword(formData: FormData, id: string) {
    try {
        const password = formData.get("password") as string;
    console.log("formData:", formData);
    console.log("Updating Password...");
    const updatedPassword = await prisma.user.update({
    where: {id} ,
    data: {
        password: formData.get("password") as string,
    },
    });
    console.log("Password updated successfully.");
    console.log(updatedPassword);
    
    // Revalidate the path
    revalidatePath(`/`);

    // Redirect to the success page
    redirect(`/hamburger/change-password/success`);

} catch(error){
    console.log(error);
}
}

// const parseDate = (timestamp: string) => {
    //     const date = new Date(timestamp); // Directly parse the string as a date
    //     if (isNaN(date.getTime())) {
    //         throw new RangeError(`Invalid time value: ${timestamp}`);
    //     }
    //     date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Adjust for the timezone offset
    //     return date;
    // };