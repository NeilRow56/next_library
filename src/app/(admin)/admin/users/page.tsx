import AddUserButton from '@/components/users/AddUserButton'
import db from '@/lib/db'
import React from 'react'
import UsersTable from './users-table'

async function UsersPage({
  searchParams
}: {
  searchParams: { page: string; limit: string }
}) {
  const params = await searchParams
  const offset = parseInt(params.page || '1')
  const take = parseInt(params.limit || '10')

  const [users, total] = await db.$transaction([
    db.user.findMany({ skip: offset, take: take }),
    db.user.count()
  ])

  return (
    <div className='flex flex-col space-y-4 p-2'>
      <div className='flex w-full justify-end'>
        <AddUserButton />
      </div>
      <UsersTable data={{ data: users, total: total }} />
    </div>
  )
}
export default UsersPage
