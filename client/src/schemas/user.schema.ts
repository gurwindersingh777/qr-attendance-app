import { z } from "zod"

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "At least 2 characters")
    .max(50)
    .regex(/^[a-zA-Z\s]+$/, "Letters only"),

  email: z.string().email("Invalid email"),

  role: z.enum(["student", "teacher", "admin"]),

  rollNumber: z.string().max(20).optional(),
})

export type UpdateUserForm = z.infer<typeof updateUserSchema>