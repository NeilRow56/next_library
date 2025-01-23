import { getAvatarLetter } from '@/lib/utils'
import { format } from 'date-fns'
import React from 'react'
import Rating from '@/components/home/Rating'
import { Separator } from '../ui/separator'
import db from '@/lib/db'

async function CommentCard({ bookId }: { bookId: number }) {
  const ratings = await db.rating.findMany({
    where: {
      bookId: bookId
    },
    include: {
      users: {
        select: { name: true }
      }
    }
  })

  return (
    <>
      {ratings.map(rating => (
        <div key={rating.ratingId} className='flex flex-col p-2'>
          <div className='flex max-w-md items-start space-x-4 p-4 sm:max-w-4xl'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white'>
              {getAvatarLetter(rating.users.name)}
            </div>

            <div className='flex-1'>
              <h4 className='text-lg font-semibold capitalize'>
                {rating.users.name}
              </h4>

              <div className='flex items-center space-x-2'>
                <p className='text-sm text-gray-500'>
                  {format(rating.createdAt, 'dd MMM, yyyy')}
                </p>
                <Rating rating={rating.rating} />
              </div>

              <p className='mt-2 text-gray-700'>{rating.review}</p>
            </div>
          </div>
          <Separator className='max-w-lg' />
        </div>
      ))}
    </>
  )
}

export default CommentCard
