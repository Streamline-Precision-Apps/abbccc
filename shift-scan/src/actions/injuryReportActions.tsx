"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAuthStep } from "@/app/api/auth";

const prisma = new PrismaClient();

// Get all injuryForms
export async function getInjuryForms() {
  const injuryForms = prisma.injuryForm.findMany();
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

    const newInjuryForm = await prisma.injuryForm.create({
      data: {
        // user_id: { connect: { id: formData.get("userId") as string } },
        // submit_date: parseDate(
        //   formData.get("submit_date") as string
        // ).toISOString(),
        // date: parseDate(formData.get("date") as string).toISOString(),
        contactedSupervisor: formData.get("contactedSupervisor")
          ? Boolean(formData.get("contactedSupervisor"))
          : undefined,
        incidentDescription: formData.get("incidentDescription") as string,
      },
    });
    console.log("injuryForm created successfully.");

    // Revalidate the path
    await revalidatePath(`/dashboard/clock-out/clock-out-success`);

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
//     const end_time = parseUTC(formData.get("end_time"));
//     const start_time = parseUTC(formData.get("start_time"));
//     const duration =
//       Math.floor(end_time.getSeconds() - start_time.getSeconds()) / 3600; // Duration in hours
//     const updatedTimeSheet = await prisma.timeSheet.update({
//       where: { id },
//       data: {
//         vehicle_id: Number(formData.get("vehicle_id")) || null,
//         end_time: parseDate(formData.get("end_time") as string).toISOString(),
//         total_break_time: Number(formData.get("total_break_time") as string),
//         duration: duration || null,
//         starting_mileage: Number(formData.get("starting_mileage")) || null,
//         ending_mileage: Number(formData.get("ending_mileage")) || null,
//         left_idaho: Boolean(formData.get("left_idaho")) || null,
//         equipment_hauled: (formData.get("equipment_hauled") as string) || null,
//         materials_hauled: (formData.get("materials_hauled") as string) || null,
//         hauled_loads_quantity:
//           Number(formData.get("hauled_loads_quantity")) || null,
//         refueling_gallons: Number(formData.get("refueling_gallons")) || null,
//         timesheet_comments: formData.get("timesheet_comments") as string,
//         app_comment: formData.get("app_comment") as string,
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
  await prisma.injuryForm.delete({
    where: { id },
  });
}

function resdirect(arg0: string) {
  throw new Error("Function not implemented.");
}
