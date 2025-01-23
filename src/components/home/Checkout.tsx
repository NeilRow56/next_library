import { auth } from '@/app/utils/auth'
import db from '@/lib/db'
import { formatISBN, getDateWithOffset } from '@/lib/utils'
import { differenceInCalendarDays, format } from 'date-fns'
import Image from 'next/image'
import React from 'react'

async function Checkout() {
  const session = await auth()

  const results = await db.borrowing.findMany({
    where: {
      userId: session?.user.userId,
      returnDate: null
    },
    include: {
      books: {
        select: {
          name: true,
          author: true,
          isbn: true,
          bookPhotos: {
            select: { url: true }
          }
        }
      }
    }
  })

  const daysBookDue = (refDate: Date) => {
    return differenceInCalendarDays(refDate, new Date())
  }

  return (
    <div>
      {results.length > 0 ? (
        results.map(result => (
          <div
            key={result.borrowingId}
            className='flex flex-col justify-between rounded-sm border p-4 sm:space-x-2 md:flex-row'
          >
            <div className='mb-1 flex max-w-md space-x-4 space-y-1'>
              <Image
                width={100}
                height={0}
                src={result.books.bookPhotos[0].url!}
                alt='Book Cover'
                className='hidden rounded-l-md object-fill md:block'
              />
              <div>
                <h1 className='text-xl font-bold capitalize text-gray-800 sm:text-2xl'>
                  {result.books?.name}
                </h1>
                <p className='font-medium capitalize'>
                  By: {result.books.author}
                </p>
                <p className='text-slate-400'>
                  {formatISBN(result.books.isbn)}
                </p>
              </div>
            </div>

            <div className='flex flex-col space-y-1 rounded-sm border bg-slate-50 p-4'>
              {daysBookDue(result.dueDate) < 0 ? (
                <div>
                  <div className='border-l4 border-red-500 bg-red-50 p-2 text-red-500'>
                    <p className='font-bold'>
                      {Math.abs(daysBookDue(result.dueDate))} days overdue.
                    </p>
                  </div>
                </div>
              ) : (
                <div className='border-l-4 border-green-500 bg-green-50 p-2 text-green-600'>
                  <p className='font-bold'>
                    Due in {daysBookDue(result.dueDate)} days.
                  </p>
                </div>
              )}
              <p>
                Checkout date:{' '}
                {format(getDateWithOffset(result.borrowDate), 'MMM dd, yyyy')}
              </p>
              <p>
                Due date:{' '}
                {format(getDateWithOffset(result.dueDate), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        ))
      ) : (
        <h1 className='p-8 text-center text-2xl text-slate-400'>
          No items checked out.
        </h1>
      )}
    </div>
  )
}

export default Checkout
