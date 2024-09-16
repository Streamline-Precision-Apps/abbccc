// this file is for server side validation
import { number,string, z } from "zod";

export const clockInFormSchema = z.object({
id: number().int().min(4, "must be at least 4 character"),
name: string(),
});