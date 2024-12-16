import { object, string, z } from "zod";

export const signInSchema = object({
  username: string({ required_error: "username is required" }).min(
    1,
    "Username is required"
  ),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const TimesheetSchema = z.object({
  submitDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid date format",
  }),
  id: z.string(),
  userId: z.string(),
  date: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid date format",
  }),
  jobsiteId: z.string(),
  costcode: z.string(),
  nu: z.string(),
  Fp: z.string(),
  vehicleId: z.string(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  duration: z.number().nullable().optional(),
  startingMileage: z.number().nullable().optional(),
  endingMileage: z.number().nullable().optional(),
  leftIdaho: z.boolean().optional(),
  equipmentHauled: z.string().optional(),
  materialsHauled: z.string().optional(),
  hauledLoadsQuantity: z.number().nullable().optional(),
  refuelingGallons: z.number().nullable().optional(),
  timeSheetComments: z.string().optional(),
  status: z.string(),
});
