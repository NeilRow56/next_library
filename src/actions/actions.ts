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

export async function deleteCategory(id: number, path: string) {
  try {
    await db.$transaction([
      db.bookCategory.delete({
        where: {
          category_id: id
        }
      })
    ])

    revalidatePath(path)
  } catch (error) {
    throw error
  }
}

export async function getCategories(offset: number, limit: number) {
  try {
    let categories
    let total

    if (limit === -1) {
      categories = await db.bookCategory.findMany()
      total = categories.length
    } else {
      ;[categories, total] = await db.$transaction([
        db.bookCategory.findMany({ skip: offset, take: limit }),
        db.bookCategory.count()
      ])
    }

    return { data: categories, total: total }
  } catch (error) {
    throw error
  }
}
