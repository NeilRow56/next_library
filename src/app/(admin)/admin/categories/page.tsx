import React from 'react'
import CategoriesTable from './categories-table'
import db from '@/lib/db'
import AddCategoryButton from '@/components/categories/AddCategoryButton'

async function CategoriesPage({
  searchParams
}: {
  searchParams: { page: string; limit: string }
}) {
  const params = await searchParams
  const offset = parseInt(params.page || '0')
  const take = parseInt(params.limit || '10')

  const [categories, total] = await db.$transaction([
    db.bookCategory.findMany({ skip: offset, take: take }),
    db.bookCategory.count()
  ])

  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex w-full justify-end p-2'>
        <AddCategoryButton />
      </div>

      <CategoriesTable data={{ data: categories, total: total }} />
    </div>
  )
}

export default CategoriesPage
