import AddActivityButton from '@/components/activities/AddActivityButton'
import db from '@/lib/db'
import React from 'react'
import ActivitiesTable from './activities-table'

async function ActivitiesPage({
  searchParams
}: {
  searchParams: { page: string; limit: string }
}) {
  const params = await searchParams
  const offset = parseInt(params.page || '1')
  const take = parseInt(params.limit || '10')

  const [activities, total] = await db.$transaction([
    db.activity.findMany({ skip: offset, take: take }),
    db.activity.count()
  ])
  return (
    <div className='flex flex-col space-y-4 p-2'>
      <div className='flex w-full justify-end'>
        <AddActivityButton />
      </div>
      <ActivitiesTable data={{ data: activities, total: total }} />
    </div>
  )
}
export default ActivitiesPage
