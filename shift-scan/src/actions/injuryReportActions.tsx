"use server";
import prisma from "@/lib/prisma";

// Get all injuryForms
export async function getInjuryForms() {
  const injuryForms = prisma.injuryForms.findMany();
  console.log(injuryForms);
  return injuryForms;
}

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

    await prisma.injuryForms.create({
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
        verifyFormSignature: formData.get("signedForm") === "true",
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

// Delete injuryForm by id
// will be used by Admin only
export async function deleteInjuryForm(id: number) {
  await prisma.injuryForms.delete({
    where: { id },
  });
}
