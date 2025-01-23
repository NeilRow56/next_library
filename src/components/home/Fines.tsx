import {
  formatAmountForDisplay,
  formatISBN,
  getDateWithOffset
} from '@/lib/utils'
import { format } from 'date-fns'
import React from 'react'

import { auth } from '@/app/utils/auth'
import db from '@/lib/db'

async function Fines() {
  const session = await auth()

  const results = await db.fine.findMany({
    where: {
      userId: session?.user.userId,
      paidDate: null
    },
    include: {
      borrowings: {
        select: {
          borrowDate: true,
          returnDate: true,
          books: {
            select: {
              name: true,
              author: true,
              isbn: true
            }
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
            key={result.fineId}
            className='flex flex-col justify-evenly rounded-sm border p-4 sm:space-x-4 lg:flex-row'
          >
            <div className='mb-1 max-w-md flex-grow space-y-1'>
              <h1 className='text-xl font-bold capitalize text-gray-800 sm:text-2xl'>
                {result.borrowings.books.name}
              </h1>
              <p className='font-medium capitalize'>
                By: {result.borrowings.books.author}
              </p>
              <p className='text-slate-400'>
                {formatISBN(result.borrowings.books.isbn)}
              </p>
              <div>
                <p>
                  Checkout date:{' '}
                  {format(
                    getDateWithOffset(result.borrowings.borrowDate),
                    'dd MMM, yyyy'
                  )}
                </p>
                <p>
                  Return date:{' '}
                  {format(
                    getDateWithOffset(result.borrowings.returnDate!),
                    'dd MMM, yyyy'
                  )}
                </p>
              </div>
            </div>

            <div className='flex flex-col justify-between space-y-2 rounded-sm border bg-slate-50 p-2'>
              <div className='border-l-4 border-red-500 bg-red-50 p-2 text-red-600'>
                <p className='font-bold'>
                  Fine:{' '}
                  {formatAmountForDisplay(
                    result.fineAmount as unknown as number,
                    'CAD'
                  )}
                </p>
              </div>
              <h3>Pay fine BUTTON</h3>
              {/* <PayFineButton fine_id={result.fine_id} /> */}
            </div>
          </div>
        ))
      ) : (
        <h1 className='p-8 text-center text-2xl text-slate-400'>No fines.</h1>
      )}
    </div>
  )
}

export default Fines
