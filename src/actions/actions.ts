'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

////////////////////////////////////////////////////////////////////////////////
//              Category
////////////////////////////////////////////////////////////////////////////////

export async function addCategory(name: string, path: string) {
  try {
    const category = await db.$transaction([
      db.bookCategory.create({
        data: {
          category_name: name
        }
      })
    ])

    revalidatePath(path)
    return category
  } catch (error) {
    throw error
  }
}

export async function updateCategory(id: number, name: string, path: string) {
  if (!id) throw new Error('Missing id')
  try {
    await db.$transaction([
      db.bookCategory.update({
        where: {
          category_id: id
        },
        data: {
          category_name: name
        }
      })
    ])

    revalidatePath(path)
  } catch (error) {
    throw error
  }
}
