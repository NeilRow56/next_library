import ActivityDateSelect from '@/components/activities/ActivityDateSelect'
import db from '@/lib/db'
import { addDays, format, parse } from 'date-fns'
import { Clock, Calendar } from 'lucide-react'
import React from 'react'

async function ActivitiesPage({
  searchParams
}: {
  searchParams: { from: string; to: string }
}) {
  const params = await searchParams

  const activities = await db.activity.findMany({
    where: {
      activityDate: {
        gte: parse(params.from, 'yyyy-MM-dd', new Date()),
        lte: addDays(parse(params.to, 'yyyy-MM-dd', new Date()), 1)
      }
    },
    orderBy: {
      activityDate: 'asc'
    }
  })

  return (
    <>
      <div className='mx-auto max-w-7xl flex-col space-y-8 p-4 pt-16 sm:space-x-4'>
        <ActivityDateSelect />
        {activities && activities.length > 0 ? (
          <>
            <p className='text-2xl sm:text-4xl'>Activites</p>
            <div className='flex w-full flex-col space-y-4 pt-16'>
              {activities.map(activity => (
                <div
                  key={activity.activityId}
                  className='w-full space-y-2 rounded-md border border-gray-500 p-4'
                >
                  <div className='flex-flex-col sm:flex-row sm:items-center sm:justify-between'>
                    <p className='text-xl font-bold capitalize'>
                      {activity.title}
                    </p>
                    <p className='text-sm text-gray-500'>{activity.ageGroup}</p>
                  </div>
                  <p>{activity.description}</p>
                  <div className='space-y-2 pb-4 pt-4'>
                    <p className='flex items-center text-sm text-blue-500'>
                      <Calendar size={16} className='mr-2' />
                      {format(activity.activityDate, 'dd MMM yyyy')}
                    </p>
                    <p className='flex items-center text-sm text-blue-500'>
                      <Clock size={16} className='mr-2' />
                      {activity.startTime} - {activity.endTime}
                    </p>
                  </div>
                  <p className='text-sm text-gray-500'>
                    Capacity {activity.capacity}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          activities.length === 0 && (
            <p className='pb-16 pt-16 text-center text-2xl font-bold uppercase tracking-wide text-slate-500 sm:text-4xl'>
              No activities
            </p>
          )
        )}
      </div>
    </>
  )
}

export default ActivitiesPage
