import { auth } from '@/app/utils/auth'
import db from '@/lib/db'
import { formatISBN, getDateWithOffset } from '@/lib/utils'
import { format } from 'date-fns'
import Image from 'next/image'
import React from 'react'

async function BorrowingHistory() {
  const session = await auth()

  const results = await db.borrowing.findMany({
    where: {
      userId: session?.user.userId,
      returnDate: { not: null }
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

  return (
    <div>
      {results.length > 0 ? (
        results.map(result => (
          <div
            key={result.borrowingId}
            className='flex flex-col justify-evenly rounded-sm border p-4 sm:space-x-4 lg:flex-row'
          >
            <Image
              width={100}
              height={0}
              src={result.books.bookPhotos[0].url!}
              alt='Book Cover'
              className='hidden rounded-l-md object-fill sm:block'
            />

            <div className='mb-1 max-w-md flex-grow space-y-1'>
              <h1 className='text-xl font-bold capitalize text-gray-800 sm:text-2xl'>
                {result.books?.name}
              </h1>
              <p className='font-medium capitalize'>
                By: {result.books.author}
              </p>
              <p className='text-slate-400'>{formatISBN(result.books.isbn)}</p>
            </div>

            <div className='flex flex-col space-y-1 rounded-sm border bg-slate-50 p-4'>
              <p>
                Checkout date:{' '}
                {format(getDateWithOffset(result.borrowDate), 'dd MMM, yyyy')}
              </p>
              <p>
                Due date:{' '}
                {format(getDateWithOffset(result.dueDate), 'dd MMM, yyyy')}
              </p>
            </div>
          </div>
        ))
      ) : (
        <h1 className='p-8 text-center text-2xl text-slate-400'>
          No bororwing history.
        </h1>
      )}
    </div>
  )
}

export default BorrowingHistory
