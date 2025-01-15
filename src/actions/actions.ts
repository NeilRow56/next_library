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

////////////////////////////////////////////////////////////////////////////////
//              Books
////////////////////////////////////////////////////////////////////////////////
export async function addBook({
  name,
  isbn,
  noOfCopies,
  category,
  path,
  photos,
  publishYear,
  author
}: {
  name: string
  isbn: string
  noOfCopies: number
  category: number[]
  path: string
  photos: string[]
  publishYear: number
  author: string
}) {
  try {
    await db.$transaction(async t => {
      const book = await t.book.create({
        data: {
          name: name,
          isbn: isbn,
          noOfCopies: noOfCopies,
          publishYear: publishYear,
          author: author
        }
      })

      if (category && category.length > 0) {
        const data = category.map(cat => ({
          bookId: book.bookId,
          categoryId: cat
        }))

        await t.bookCategoryLink.createMany({ data })
      }

      // save photos
      if (photos && photos.length > 0) {
        const data = photos.map(photo => ({
          bookId: book.bookId,
          url: photo
        }))

        await t.bookPhoto.createMany({ data })
      }

      revalidatePath(path)
    })
  } catch (error) {
    throw error
  }
}

export async function updateBook({
  id,
  name,
  isbn,
  noOfCopies,
  category,
  path,
  publishYear,
  author
}: {
  id: number
  name: string
  isbn: string
  noOfCopies: number
  category: number[]
  path: string
  photos: string[]
  publishYear: number
  author: string
}) {
  try {
    await db.$transaction(async t => {
      const book = await t.book.update({
        where: {
          bookId: id
        },
        data: {
          name: name,
          isbn: isbn,
          noOfCopies: noOfCopies,
          publishYear: publishYear,
          author: author
        }
      })

      await t.bookCategoryLink.deleteMany({
        where: {
          bookId: id
        }
      })

      if (category && category.length > 0) {
        const data = category.map(cat => ({
          bookId: book.bookId,
          categoryId: cat
        }))

        await t.bookCategoryLink.createMany({ data })
      }

      revalidatePath(path)
    })
  } catch (error) {
    throw error
  }
}

export async function deleteBook(bookId: number, path: string) {
  await db.$transaction(
    async t =>
      await t.book.delete({
        where: {
          bookId: bookId
        }
      })
  )

  revalidatePath(path)
}

////////////////////////////////////////////////////////////////////////////////
//              Photos
////////////////////////////////////////////////////////////////////////////////
export async function addPhoto(
  table: string,
  entity_id: number,
  url: string,
  path: string
) {
  try {
    const newPhoto = await db.$transaction(async t => {
      if (table === 'book') {
        return await t.bookPhoto.create({
          data: {
            bookId: entity_id,
            url: url
          }
        })
      } else if (table === 'activity') {
        return await t.activityPhoto.create({
          data: {
            activityId: entity_id,
            url: url
          }
        })
      }
    })

    revalidatePath(path)
    return {
      photoId: newPhoto?.photoId as number,
      url: newPhoto?.url as string
    }
  } catch (error) {
    throw error
  }
}

export async function deletePhoto(table: string, id: number, path: string) {
  try {
    const result = await db.$transaction(async t => {
      if (table === 'book') {
        await t.bookPhoto.delete({
          where: {
            photoId: id
          }
        })
      } else if (table === 'activity') {
        await t.activityPhoto.delete({
          where: {
            photoId: id
          }
        })
      }
    })

    revalidatePath(path)
    return result
  } catch (error) {
    throw error
  }
}
