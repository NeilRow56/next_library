import { createRowActions } from '@/components/shared/DataTableActions'
import DataTableColumnHeader from '@/components/shared/DataTableColumnHeader'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

export type Activity = {
  activityId: number
  title: string
  description?: string | null
  activityDate: Date
  startTime: string
  endTime: string
  ageGroup?: string | null
  capacity?: number | null
  activityPhotos?: { photoId: number; url: string }[]
}

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    )
  },
  {
    accessorKey: 'activityDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => format(row.getValue('activityDate'), 'dd MMM, yyyy')
  },
  {
    accessorKey: 'startTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Starts' />
    )
  },
  {
    accessorKey: 'endTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='End' />
    )
  },
  createRowActions<Activity>()
]
