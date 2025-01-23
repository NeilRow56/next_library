import { auth } from '@/app/utils/auth'
import AddToStaffPickButton from '@/components/home/AddToStaffPickButton'
import CancelHoldButton from '@/components/home/CancelHoldButton'

import CommentBox from '@/components/home/CommentBox'
import CommentCard from '@/components/home/CommentCard'
import PlaceHoldButton from '@/components/home/PlaceHoldButton'
import Rating from '@/components/home/Rating'
import RemoveFromStaffPicksButton from '@/components/home/RemoveFromStaffPicksButton'

import BackButton from '@/components/shared/BackButton'
import { Separator } from '@/components/ui/separator'
import db from '@/lib/db'

import { BookOpen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

async function BookDetailsPage({ params }: { params: { bookId: number } }) {
  const session = await auth()
  const p = await params
  const [bookDetails, stats, reservation_count, reservation] =
    await db.$transaction([
      db.book.findUnique({
        where: {
          bookId: +p.bookId
        },
        include: {
          ratings: {
            select: {
              rating: true
            }
          },
          bookPhotos: {
            select: { url: true }
          },
          staffPicks: {
            select: {
              userId: true,
              pickId: true
            }
          },
          bookCategoryLinks: {
            include: {
              bookCategories: {
                select: { category_name: true }
              }
            }
          }
        }
      }),
      db.rating.aggregate({
        _avg: { rating: true },
        _count: { rating: true },
        where: { bookId: +p.bookId }
      }),
      db.reservation.count({
        where: { bookId: +p.bookId }
      }),
      db.reservation.findFirst({
        where: {
          bookId: +p.bookId,
          userId: session?.user.userId
        }
      })
    ])

  const copies_available = () => {
    if (bookDetails?.noOfCopies) {
      const count = bookDetails?.noOfCopies
      return count < 0 ? 0 : count
    }

    return 0
  }

  return (
    <div className='mx-auto max-w-6xl'>
      <BackButton />
      <div className='flex flex-col space-y-8 p-4 pt-16 sm:space-x-4 lg:flex-row'>
        <Image
          width={200}
          height={0}
          src={bookDetails?.bookPhotos[0].url as string}
          alt='book'
          className='h-auto rounded-l-md object-cover'
        />

        <div className='max-w-3xl flex-grow'>
          <h1 className='mb-1 text-2xl font-bold capitalize text-gray-800'>
            {bookDetails?.name}
          </h1>
          <p className='mb-3 font-medium capitalize text-blue-500'>
            {bookDetails?.author}
          </p>

          <div className='mb-4 flex items-center gap-2'>
            <div className='flex space-x-1 rounded-md border border-green-500 p-2 text-green-700'>
              <BookOpen />
              <span>Book,</span>
              <span>{bookDetails?.publishYear}</span>
            </div>

            {bookDetails?.bookCategoryLinks &&
              bookDetails.bookCategoryLinks.map(bcl => (
                <div
                  key={bcl.categoryId}
                  className='rounded-md border border-gray-300 px-4 py-2 capitalize text-gray-500'
                >
                  {bcl.bookCategories.category_name}
                </div>
              ))}
          </div>
          <p className='mb-6 leading-6 text-gray-700'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu
          </p>
        </div>

        <div className='flex flex-grow flex-col space-y-2'>
          <div className='flex flex-row space-x-4 border-l-4 border-green-500 bg-green-50 p-2 text-gray-600 sm:flex-col sm:space-x-0 sm:space-y-1'>
            <p className='pb-2 font-medium text-green-700'>Availability</p>
            <p className='text-sm'>
              <span className='font-bold'>{bookDetails?.noOfCopies}</span>{' '}
              copies
            </p>
            <p className='text-sm'>
              <span className='font-bold'>{copies_available()}</span> available
            </p>
            <p className='text-sm'>
              <span className='font-bold'>{reservation_count}</span> on hold
            </p>
          </div>
          {bookDetails?.bookId &&
            (session?.user ? (
              reservation?.reservationId ? (
                <CancelHoldButton reservationId={reservation.reservationId} />
              ) : (
                <PlaceHoldButton bookId={bookDetails.bookId} />
              )
            ) : (
              <Link
                href={`/auth/signin?callbackUrl=/book/${bookDetails.bookId}`}
                className='rounded-sm border bg-gray-500 p-2 text-white'
              >
                Place hold
              </Link>
            ))}
          {bookDetails?.bookId &&
            session?.user &&
            session.user.role === 'staff' &&
            (bookDetails &&
            bookDetails.staffPicks &&
            bookDetails.staffPicks.length > 0 ? (
              <RemoveFromStaffPicksButton
                pickId={+bookDetails.staffPicks[0].pickId}
              />
            ) : (
              <AddToStaffPickButton bookId={bookDetails.bookId} />
            ))}
        </div>
      </div>
      <Separator className='mb-2 mt-2' />
    </div>
  )
}

export default BookDetailsPage
