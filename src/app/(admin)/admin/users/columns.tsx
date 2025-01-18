import { createRowActions } from '@/components/shared/DataTableActions'
import DataTableColumnHeader from '@/components/shared/DataTableColumnHeader'
import { ColumnDef } from '@tanstack/react-table'
import { Check, CircleOff } from 'lucide-react'

export type User = {
  userId: number
  name: string
  email: string
  role: string
  libraryCardNo: string
  isActive: boolean | number
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    )
  },
  {
    accessorKey: 'role',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    )
  },
  {
    accessorKey: 'libraryCardNo',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Card no.' />
    )
  },
  {
    accessorKey: 'isActive',
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
  createRowActions<User>()
]
