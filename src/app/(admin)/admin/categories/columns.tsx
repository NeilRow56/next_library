import { createRowActions } from '@/components/shared/DataTableActions'
import DataTableColumnHeader from '@/components/shared/DataTableColumnHeader'
import { ColumnDef } from '@tanstack/react-table'

export type Category = {
  category_id: number
  category_name: string
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'category_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    )
  },
  createRowActions<Category>()
]
