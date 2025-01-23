'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { auth } from '@/app/utils/auth'
import { addDays } from 'date-fns'

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

export async function placeHold(bookId: number, path: string) {
  const session = await auth()

  if (!session) {
    throw new Error('You must be logged in')
  }

  //The unary plus (+) operator precedes its operand and evaluates to its operand but attempts to convert it into a number, if it isn't already.

  //Its called non-null assertion operator. Its telling the compiler that you are sure that the value won't be null or undefined. It's a way to assert to the TypeScript compiler that you've manually checked that a value isn't null and you're telling it to proceed without emitting a null check.

  await db.$transaction(t =>
    t.reservation.create({
      data: {
        bookId: +bookId,
        userId: session?.user.userId,
        reservationDate: new Date(),
        expirationDate: addDays(new Date(), 15)
      }
    })
  )

  revalidatePath(path)
}

export async function cancelHold(id: number, path: string) {
  await db.$transaction(t =>
    t.reservation.delete({
      where: {
        reservationId: id
      }
    })
  )

  revalidatePath(path)
}

////////////////////////////////////////////////////////////////////////////////
//              Staff picks
////////////////////////////////////////////////////////////////////////////////
export async function addToStaffPicks(bookId: number, path: string) {
  const session = await auth()

  if (!session) {
    throw new Error('You must be logged in')
  }

  try {
    await db.$transaction([
      db.staffPick.create({
        data: {
          bookId: bookId,
          userId: +session?.user.id!,
          pickDate: new Date()
        }
      })
    ])

    revalidatePath(path)
  } catch (error) {
    throw error
  }
}

export async function removeFromStaffPicks(pickId: number, path: string) {
  const session = await auth()

  if (!session) {
    throw new Error('You must be logged in')
  }

  try {
    await db.$transaction([
      db.staffPick.delete({
        where: {
          pickId: pickId
        }
      })
    ])

    revalidatePath(path)
  } catch (error) {
    throw error
  }
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

////////////////////////////////////////////////////////////////////////////////
//              Activities
////////////////////////////////////////////////////////////////////////////////
export async function addActivity({
  title,
  description,
  activityDate,
  startTime,
  endTime,
  ageGroup,
  capacity,
  photos,
  path
}: {
  title: string
  description: string
  activityDate: Date
  startTime: string
  endTime: string
  ageGroup: string
  capacity: number
  photos: string[]
  path: string
}) {
  try {
    await db.$transaction(async t => {
      const result = await t.activity.create({
        data: {
          title: title,
          description: description,
          activityDate: activityDate,
          startTime: startTime,
          endTime: endTime,
          ageGroup: ageGroup,
          capacity: capacity
        }
      })

      // save photos
      if (photos && photos.length > 0) {
        const data = photos.map(photo => ({
          activityId: result.activityId,
          url: photo
        }))

        await t.activityPhoto.createMany({ data })
      }
    })

    revalidatePath(path)
  } catch (error) {
    throw error
  }
}

export async function updateActivity({
  activityId,
  title,
  description,
  activityDate,
  startTime,
  endTime,
  ageGroup,
  capacity,
  path
}: {
  activityId: number
  title: string
  description: string
  activityDate: Date
  startTime: string
  endTime: string
  ageGroup: string
  capacity: number
  path: string
}) {
  try {
    await db.$transaction([
      db.activity.update({
        where: {
          activityId: activityId
        },
        data: {
          title: title,
          description: description,
          activityDate: activityDate,
          startTime: startTime,
          endTime: endTime,
          ageGroup: ageGroup,
          capacity: capacity
        }
      })
    ])

    revalidatePath(path)
  } catch (error) {
    throw error
  }
}

export async function deleteActivity(id: number, path: string) {
  try {
    await db.$transaction([
      db.activity.delete({
        where: {
          activityId: id
        }
      })
    ])

    revalidatePath(path)
  } catch (error) {
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////
//              Users
////////////////////////////////////////////////////////////////////////////////
export async function addUser(
  name: string,
  email: string,
  libraryCardNo: string,
  role: string,
  isActive: boolean,
  path: string
) {
  try {
    const hashPassword = await bcrypt.hash('password', 10)

    const user = await db.$transaction([
      db.user.create({
        data: {
          name: name,
          email: email,
          libraryCardNo: libraryCardNo,
          role: role,
          isActive: isActive,
          password: role === 'staff' ? hashPassword : '',
          image: '',
          profileStatus: role === 'staff' ? 'pending' : ''
        }
      })
    ])

    revalidatePath(path)
    return user
  } catch (error) {
    throw error
  }
}

export async function updateUser(
  userId: number,
  name: string,
  email: string,
  libraryCardNo: string,
  role: string,
  isActive: boolean,
  path: string
) {
  if (!userId) return { message: 'Missing data is required' }

  try {
    // use transaction. If book creation fails we don't want to create category links
    await db.$transaction(async transaction => {
      await transaction.user.update({
        where: {
          userId: userId
        },
        data: {
          name: name,
          email: email,
          role: role,
          libraryCardNo: libraryCardNo,
          isActive: isActive
        }
      })
    })

    if (path) revalidatePath(path)

    return { message: 'user updated' }
  } catch (error) {
    //return { message: 'Database Error: Failed to Update User.' };
    throw error
  }
}

export async function deleteUser(id: number, path: string) {
  try {
    const result = await db.$transaction(async transaction => {
      await transaction.user.delete({
        where: {
          userId: id
        }
      })
    })

    revalidatePath(path)

    return result
  } catch (error) {
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////
//              Fines
////////////////////////////////////////////////////////////////////////////////
export async function markAsPaid(id: number, path: string) {
  try {
    await db.$transaction(async transaction => {
      await transaction.fine.update({
        where: {
          fineId: id
        },
        data: {
          paidDate: new Date()
        }
      })
    })

    revalidatePath(path)

    return { message: 'Fine paid' }
  } catch (error) {
    throw error
  }
}

export async function deleteFine(id: number, path: string) {
  try {
    await db.$transaction(async transaction => {
      await transaction.fine.delete({
        where: {
          fineId: id
        }
      })
    })

    revalidatePath(path)

    return { message: 'Fine deleted' }
  } catch (error) {
    throw error
  }
}

////////////////////////////////////////////////////////////////////////////////
//              Rating
////////////////////////////////////////////////////////////////////////////////
export async function addRating(
  bookId: number,
  prevState: State,
  formData: FormData
) {
  const session = await auth()

  if (!session) {
    return { message: 'You must be logged in' }
  }

  await db.$transaction([
    db.rating.create({
      data: {
        bookId: bookId,
        userId: session?.user.userId,
        rating: +formData.get('rating')!,
        review: formData.get('comment')?.toString()
      }
    })
  ])

  return {
    message: 'Thank you for your review'
  }
}

export type State = {
  message?: string | null
}
