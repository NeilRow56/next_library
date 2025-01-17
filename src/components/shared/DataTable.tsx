'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowData,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { pageSize } from '@/lib/utils'
import DataTableFilterInput from './DataTableInputFilter'
import { DataTableViewOptions } from './DataTableViewOptions'
import { DataTablePagination } from './DataTablePagination'
import { EmptyState } from './EmptyState'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    onDelete: (item: TData) => void
    onEdit: (item: TData) => void
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  total: number
  filter_column: string
  onRowDelete: (item: TData) => void
  onRowEdit: (item: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  total,
  filter_column,
  onRowDelete,
  onRowEdit
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    rowCount: total,
    meta: {
      onDelete: item => onRowDelete(item),
      onEdit: item => onRowEdit(item)
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination
    }
  })

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const page = pagination.pageIndex * pageSize
    const take = pagination.pageIndex * pageSize + pageSize

    router.push(`${pathname}?page=${page}&limit=${take}`)
  }, [pagination, pathname, router])
  return (
    <div className='container mx-auto max-w-4xl space-y-2'>
      <DataTableFilterInput table={table} column={filter_column} />
      <DataTableViewOptions table={table} />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  {/* <h2 className='text-2xl font-bold text-primary'>
                    No Results
                  </h2> */}
                  <EmptyState
                    description='Please add data'
                    title='No details provided '
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
