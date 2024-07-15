// "use server";
// import prisma from "@/lib/prisma";
// import { permission } from "@prisma/client";
// import { revalidatePath } from "next/cache";


// export async function getAllInjuryReports() {
// try{
//     await prisma.FormSubmissions.findMany({
//       where: {
//         formType: "INJURY"
//       }
//       });
// } catch(error){
//     console.log(error);
// }
//     revalidatePath('/');
// }

// export async function createInjuryReport(formData: FormData) {
// try{
//     await prisma.FormSubmissions.create({
//         data: {
//           userId: formData.get('id') as string,
//           type: "INJURY",
//           createdAt: new Date(),
//           updatedAt: new Date(),
//           status: "PENDING",
//         }
//     });
// } catch(error){
//     console.log(error);
// }

// export async function updateInjuryReport(formData: FormData, id: string) {
//     await prisma.FormSubmissions.update({
//         where: { id },
//         data: {
          
//         }
//     });
// }

// export async function deleteInjuryReport(id: string) {
//     await prisma.FormSubmissions.delete({
//         where: { id },
//     });
// }


// // we call these function by using a form action={...} in the form ... = post, delete, put, patch