import { z } from 'zod'

export const activitiesSchema = z.object({
  activityId: z.number().default(-1),
  title: z
    .string()
    .min(2, {
      message: 'Actiivity title must be entered'
    })
    .max(20),
  description: z.string().min(10).max(255),
  activityDate: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  ageGroup: z.string(),
  capacity: z.coerce
    .number({ invalid_type_error: 'must be a number' })
    .positive({ message: 'Value must be positive' })
    .finite({ message: 'Must be a valid number' }),
  photos: z.array(z.string()).default([])
})
