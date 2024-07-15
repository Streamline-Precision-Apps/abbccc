"use server"
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getSentContent() {
    const content = await prisma.employee.findMany(
        {
            where: {
                id: 1
            },
            // include: {
            //     formSubmissions: true,
                
            // }
        },
    );
    console.log(content)
    return content
  }
  

//   export async function getSentContentbyId(id: number) {
//     const content = await prisma.employee.findMany(
//         {
//             where: {
//                 id: id
//             },
//             // include: {
//             //     formSubmissions: true,
                
//             // }
//         },
//     );
//     console.log(content)
//     return content
//   }

// export async function getReceivedContentbyCrew(id: number) {
//     const content = await prisma.user.findMany(
//         {
//             where: {
//                 crew: {
//                     id: id
//                 }
//                 supervisor: false
//                 formStatus: pending
//             },
//             include: {
//                 timesheets: true,
//                 crewmembers: true,
//                 formSubmissions: true
//             }
//         },
//     );
//     console.log(content)
//     return content
// }

