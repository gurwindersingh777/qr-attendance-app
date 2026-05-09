import z from "zod";

export const updateUserSchema = z.object({
  name: z
    .string().min(2).max(50)
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .trim()
    .optional(),
  email: z.string().email().toLowerCase().trim().optional(),
  role: z.enum(["student", "teacher", "admin"]).optional(),
  rollNumber: z
    .string().min(1).max(20)
    .regex(/^[a-zA-Z0-9]+$/, "Roll number can only contain letters and numbers")
    .trim()
    .optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema> 