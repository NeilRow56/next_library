import React from 'react'
// import { getReservationRankForBook } from '@prisma/client/sql'
import Image from 'next/image'
import { formatISBN } from '@/lib/utils'

import { auth } from '@/app/utils/auth'
import db from '@/lib/db'
import HoldButton from './HoldButton'

async function OnHold() {
  const session = await auth()

  const results = await db.reservation.findMany({
    where: {
      userId: session?.user.userId
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

  //   const getRankForUser = async (book_id: number) => {
  //     const rank = await db.$queryRawTyped(getReservationRankForBook(bookId, session?.user.userId as number))

  //     return rank.length > 0 ? rank[0].queue_number : 0
  //   }

  return (
    <div className='space-y-2'>
      {results.map(result => (
        <div
          key={result.bookId}
          className='flex flex-col justify-between rounded-sm border p-4 sm:flex-row sm:space-x-4'
        >
          <div className='flex max-w-md flex-col sm:space-x-2 md:flex-row'>
            <Image
              width={100}
              height={0}
              src={result.books.bookPhotos[0].url!}
              alt='Book Cover'
              className='hidden rounded-l-md object-fill sm:block'
            />
            <div>
              <h1 className='text-xl font-bold capitalize text-gray-800 sm:text-2xl'>
                {result.books?.name}
              </h1>
              <p className='font-medium capitalize'>
                By: {result.books.author}
              </p>
              <p className='text-slate-400'>{formatISBN(result.books.isbn)}</p>
            </div>
          </div>

          <div className='flex max-w-2xl flex-col space-y-1'>
            {/* <div className=" text-green-600 bg-green-50 p-2 border-l-4 border-green-500 ">
                <p className='font-bold'>You are # {getRankForUser(result.bookId)} in the waitlist.</p>
              </div> */}

            <HoldButton bookId={result.bookId} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default OnHold
