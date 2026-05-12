import z from "zod"

export const updateUserSchema = z.object({
  name: z
    .string().min(2, 'At least 2 characters').max(50)
    .regex(/^[a-zA-Z\s]+$/, 'Letters only')
    .trim().optional(),
  email: z.string().email('Invalid email').toLowerCase().trim().optional(),
  role: z.enum(['student', 'teacher', 'admin']).optional(),
  rollNumber: z.string().min(1).max(20).trim().optional(),
})

export type UpdateUserForm = z.infer<typeof updateUserSchema>