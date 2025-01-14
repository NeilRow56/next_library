import React from 'react'

import db from '@/lib/db'
import AddBookButton from '@/components/catalogue/AddBookButton'
import CatalogTable from './(catalogue)/catalog-table'

async function AdminPage({
  searchParams
}: {
  searchParams: { page: string; limit: string }
}) {
  const params = await searchParams
  const offset = parseInt(params.page || '1')
  const take = parseInt(params.limit || '10')

  const [books, total] = await db.$transaction([
    db.book.findMany({
      skip: offset,
      take: take,
      select: {
        bookId: true,
        name: true,
        noOfCopies: true,
        isbn: true,
        isActive: true,
        publishYear: true,
        author: true,
        bookPhotos: {
          select: {
            photoId: true,
            url: true
          }
        },
        bookCategoryLinks: {
          select: {
            categoryId: true
          }
        }
      }
    }),
    db.book.count()
  ])

  return (
    <div className='flex flex-col space-y-4 p-2'>
      <div className='flex w-full justify-end'>
        <AddBookButton />
      </div>
      <CatalogTable data={{ data: books, total: total }} />
    </div>
  )
}

export default AdminPage
