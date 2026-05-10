import z from "zod";

export const createSubjectSchema = z.object({
  subjectName: z.string().min(2).max(100),
  subjectCode: z.string().min(2).max(100),
})

export const enrollSchema = z.object({ subjectCode: z.string().min(2).max(20).trim() })

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>
