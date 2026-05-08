import z from "zod";

export const startSessionSchema = z.object({
  subjectId: z.string().min(1, "Subject ID is required"),
  durationMinutes: z.number().min(1, "Minimum 1 minute").max(180, "Minimum 3 hours")
})

export const markAttendanceSchema = z
  .object({
    sessionId: z.string().min(1,"Session ID is required").max(24),
    token: z.string().optional(),
    manualCode: z.string().optional(),
  })
  .refine(
    data => data.token || data.manualCode,
    { message: "Provide QR or manual code" }
  )

export type StartSessionInput = z.infer<typeof startSessionSchema>
export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>