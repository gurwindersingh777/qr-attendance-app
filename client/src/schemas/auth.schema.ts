import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'At least 6 characters')
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Must contain uppercase, number and special character'
    ),
  role: z.enum(['student', 'teacher', 'admin']),
  rollNumber: z.string().min(1).max(20).optional(),
}).refine(
  (data) => data.role !== 'student' || !!data.rollNumber,
  { message: 'Roll number is required for students', path: ['rollNumber'] }
)

export type LoginFormInput = z.infer<typeof loginSchema>
export type RegisterFormInput = z.infer<typeof registerSchema>