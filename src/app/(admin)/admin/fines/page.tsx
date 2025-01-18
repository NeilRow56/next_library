import db from '@/lib/db'
import React from 'react'
import FinesTable from './fines-table'

async function FinesPage({
  searchParams
}: {
  searchParams: { page: string; limit: string }
}) {
  const params = await searchParams
  const offset = parseInt(params.page || '1')
  const take = parseInt(params.limit || '10')

  const [fines, total] = await db.$transaction([
    db.fine.findMany({
      skip: offset,
      take: take,
      select: {
        fineId: true,
        fineAmount: true,
        fineDate: true,
        paidDate: true,
        users: {
          select: {
            name: true
          }
        }
      }
    }),
    db.fine.count()
  ])

  return (
    <div className='flex flex-col space-y-4 p-2'>
      <FinesTable
        data={{ data: JSON.parse(JSON.stringify(fines)), total: total }}
      />
    </div>
  )
}
export default FinesPage
