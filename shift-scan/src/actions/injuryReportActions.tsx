"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAuthStep } from "@/app/api/auth";

// Get all injuryForms
export async function getInjuryForms() {
  const injuryForms = prisma.injuryForms.findMany();
  console.log(injuryForms);
  return injuryForms;
}

// Get injuryForm by id
// export async function fetchInjuryForms(id: string, date: string) {
//     const startOfDay = new Date(date);
//     startOfDay.setUTCHours(0, 0, 0, 0);

//     const endOfDay = new Date(date);
//     endOfDay.setUTCHours(23, 59, 59, 999);

//     const injuryForms = await prisma.injuryForm.findMany({
//         where: {
//             userId: employeeId,
//             date: {
//                 gte: startOfDay.toISOString(),
//                 lte: endOfDay.toISOString(),
//             },
//         },
//     });

//     console.log("\n\n\nInjury Forms:", injuryForms);
//     return injuryForms;
// }

// alter the injuryForm function to include the date
// export async function handleFormSubmit(employeeId: string, date: string) {
//     date = new Date(date).toISOString();
//     return fetchInjuryForms(employeeId, date);
//     }

// Create injuryForm
export async function CreateInjuryForm(formData: FormData) {
  try {
    console.log("Creating injuryForm...");
    console.log(formData);

    const parseDate = (timestamp: string) => {
      const date = new Date(timestamp); // Directly parse the string as a date
      if (isNaN(date.getTime())) {
        throw new RangeError(`Invalid time value: ${timestamp}`);
      }
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Adjust for the timezone offset
      return date;
    };

    const newInjuryForm = await prisma.injuryForms.create({
      data: {
        submitDate: parseDate(
          new Date().toISOString().split("T")[0]
        ).toISOString(),
        date: parseDate(formData.get("date") as string).toISOString(),
        contactedSupervisor: formData.get("contactedSupervisor")
        ? Boolean(formData.get("contactedSupervisor"))
        : undefined,
        incidentDescription: formData.get("incidentDescription") as string,
        signature: formData.get("signature") as string,
        verifyFormSignature: formData.get("signedForm") === 'true',
        user: { connect: { id: formData.get("userId") as string } },
      },
    });
    console.log("injuryForm created successfully.");
    // Redirect to the success page
  } catch (error) {
    console.error("Error creating injuryForm:", error);
    throw error;
  }
}

function parseUTC(dateString: any) {
  const date = new Date(dateString);
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    )
  );
}

// provides a way to update a timesheet and will give supervisor access to all timesheets
// and provide a way to alter them as needed by employee accuracy.
// export async function updateInjuryForm(formData: FormData) {
//   try {
//     const parseDate = (timestamp: string) => {
//       const date = new Date(timestamp); // Directly parse the string as a date
//       if (isNaN(date.getTime())) {
//         throw new RangeError(`Invalid time value: ${timestamp}`);
//       }
//       date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Adjust for the timezone offset
//       return date;
//     };
//     console.log("formData:", formData);
//     console.log("Updating Timesheet...");
//     const id = Number(formData.get("id"));
//     const endTime = parseUTC(formData.get("endTime"));
//     const startTime = parseUTC(formData.get("startTime"));
//     const duration =
//       Math.floor(endTime.getSeconds() - startTime.getSeconds()) / 3600; // Duration in hours
//     const updatedTimeSheet = await prisma.timeSheet.update({
//       where: { id },
//       data: {
//         vehicleId: Number(formData.get("vehicleId")) || null,
//         endTime: parseDate(formData.get("endTime") as string).toISOString(),
//         total_break_time: Number(formData.get("total_break_time") as string),
//         duration: duration || null,
//         startingMileage: Number(formData.get("startingMileage")) || null,
//         endingMileage: Number(formData.get("endingMileage")) || null,
//         leftIdaho: Boolean(formData.get("leftIdaho")) || null,
//         equipmentHauled: (formData.get("equipmentHauled") as string) || null,
//         materialsHauled: (formData.get("materialsHauled") as string) || null,
//         hauledLoadsQuantity:
//           Number(formData.get("hauledLoadsQuantity")) || null,
//         refuelingGallons: Number(formData.get("refuelingGallons")) || null,
//         timeSheetComments: formData.get("timeSheetComments") as string,
//       },
//     });
//     console.log("Timesheet updated successfully.");
//     console.log(updatedTimeSheet);
//   } catch (error) {
//     console.log(error);
//   }
//   revalidatePath("/dashboard/clock-out/clock-out-success");
// }

// Delete injuryForm by id
// will be used by Admin only
export async function deleteInjuryForm(id: number) {
  await prisma.injuryForms.delete({
    where: { id },
  });
}

function resdirect(arg0: string) {
  throw new Error("Function not implemented.");
}
