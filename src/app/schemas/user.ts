import { z } from 'zod'

export const userSchema = z.object({
  userId: z.number().default(-1),
  name: z.string().min(2, {
    message: 'Member name must be valid.'
  }),
  email: z.string().min(2, {
    message: 'Email must be valid.'
  }),
  libraryCardNo: z.string(),
  role: z.string(),
  isActive: z.boolean().default(true)
})
