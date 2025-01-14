import { z } from 'zod'

export const catalogueSchema = z.object({
  id: z.number().default(-1),
  name: z.string().min(1),
  isbn: z.string().min(10).max(13),
  author: z.string(),
  publishYear: z.coerce
    .number({ invalid_type_error: 'must be a number' })
    .positive({ message: 'Value must be positive' })
    .finite({ message: 'Must be a valid number' }),
  noOfCopies: z.coerce
    .number({ invalid_type_error: 'must be a number' })
    .positive({ message: 'Value must be positive' })
    .finite({ message: 'Must be a valid number' }),
  category: z.array(z.number()).min(1, {
    message: 'A book must have a category'
  }),
  photos: z.array(z.string())
})
