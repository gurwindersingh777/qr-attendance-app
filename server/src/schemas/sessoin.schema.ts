import z from "zod";

export const location = z.object({
  latitude: z.number(),
  longitude: z.number()
})

export const startSessionSchema = z.object({
  subjectId: z.string().min(1, "Subject ID is required"),
  durationMinutes: z.number().min(1, "Minimum 1 minute").max(180, "Maximum 3 hours"),
  location
})

export const markAttendanceSchema = z
  .object({
    token: z.string().optional(),
    manualCode: z.string().optional(),
    location
  })
  .refine(
    data => data.token || data.manualCode,
    { message: "Provide QR or manual code" }
  )

export type StartSessionInput = z.infer<typeof startSessionSchema>
export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>