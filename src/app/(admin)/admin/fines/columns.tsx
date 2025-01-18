import { createRowActions } from '@/components/shared/DataTableActions'
import DataTableColumnHeader from '@/components/shared/DataTableColumnHeader'
import { formatAmountForDisplay, getDateWithOffset } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

export type Fine = {
  fineId: number
  fineAmount: number
  fineDate: Date
  paidDate: Date | null
  users: {
    name: string
  }
}

export const columns: ColumnDef<Fine>[] = [
  {
    accessorKey: 'users.name',
    id: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    )
  },
  {
    accessorKey: 'fineDate',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fine date' />
    ),
    cell: ({ row }) =>
      format(getDateWithOffset(row.getValue('fineDate')), 'dd, MMM yyyy')
  },
  {
    accessorKey: 'fineAmount',
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => formatAmountForDisplay(row.getValue('fineAmount'), 'CAD')
  },
  {
    accessorKey: 'paidDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date paid' />
    ),
    cell: ({ row }) =>
      row.getValue('paidDate') ? (
        format(getDateWithOffset(row.getValue('paidDate')), 'dd, MMM yyyy')
      ) : (
        <p className='font-bold text-red-500'>Not paid</p>
      )
  },
  createRowActions<Fine>({ edit_label: 'Mark as paid' })
]
