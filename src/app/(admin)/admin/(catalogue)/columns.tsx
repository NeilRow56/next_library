import { createRowActions } from '@/components/shared/DataTableActions'
import DataTableColumnHeader from '@/components/shared/DataTableColumnHeader'
import { formatISBN } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { Check, CircleOff } from 'lucide-react'
import Image from 'next/image'

type Photo = {
  photoId: number
  url: string
}

export type Book = {
  bookId: number
  name: string
  noOfCopies: number
  isbn: string
  isActive: boolean | number
  bookCategoryLinks?: { categoryId: number }[]
  bookPhotos?: Photo[]
  publishYear: number
  author: string
}

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: 'bookPhotos',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Image' />
    ),
    cell: ({ row }) =>
      (row.getValue('bookPhotos') as unknown as Photo[]).length > 0 && (
        <Image
          width={40}
          height={0}
          alt=''
          src={
            (row.getValue('bookPhotos') as unknown as Photo[])
              .map(p => p.url)
              .pop()!
          }
        />
      )
  },
  {
    accessorKey: 'name',
    // enableSorting: is true by default
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => <p className='capitalize'>{row.getValue('name')}</p>
  },
  {
    accessorKey: 'isbn',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ISBN' />
    ),
    cell: ({ row }) => formatISBN(row.getValue('isbn'))
  },
  {
    accessorKey: 'publishYear',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Publish year' />
    )
  },
  {
    accessorKey: 'noOfCopies',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No of copies' />
    )
  },
  {
    accessorKey: 'isActive',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Active' />
    ),
    cell: ({ row }) =>
      row.getValue('isActive') ? (
        <Check size={16} className='text-green-500' />
      ) : (
        <CircleOff size={16} className='text-red-500' />
      )
  },
  createRowActions<Book>()
]
