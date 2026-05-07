import z from 'zod';

const name = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, "Name too long")
  .trim()
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

const email = z.string().email('Invalid email address').toLowerCase().trim();


const password = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100)
  .trim()
  .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 'Password must contain at least one uppercase letter, one number and one special character');

const rollNumber = z
  .string()
  .min(1, 'Roll number is required')
  .max(20, 'Roll number too long')
  .trim()
  .regex(/^[a-zA-Z0-9]+$/, 'Roll number can only contain letters and numbers');

const role = z.enum(['student', 'admin', 'teacher']);


export const registerSchema = z.object({
  name,
  email,
  password,
  rollNumber: rollNumber.optional(),
  role,
}).refine((data) => {
  if (data.role === 'student') {
    return !!data.rollNumber;
  }
  return true;
}, {
  message: 'Roll number is required for students',
  path: ['rollNumber']
});

export const loginSchema = z.object({
  email,
  password : z.string().min(1, 'Password is required').trim()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;