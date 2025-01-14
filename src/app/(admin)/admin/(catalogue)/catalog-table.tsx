'use client'

import React, { startTransition, useState } from 'react'
import { Book, columns } from './columns'

import { usePathname } from 'next/navigation'

import { useToast } from '@/hooks/use-toast'

import { DataTable } from '@/components/shared/DataTable'
import ConfirmationDialog from '@/components/shared/ConfirmationDialog'
import AddBookDialog from '@/components/catalogue/AddBookDialog'
import { deleteBook } from '@/actions/actions'

type props = {
  data: Book[]
  total: number
}

function CatalogTable({ data }: { data: props }) {
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false)
  const [itemToAction, setItemToAction] = useState<Book>()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { toast } = useToast()

  const handleRowDelete = async (item: Book) => {
    setOpenConfirmationDialog(true)
    setItemToAction(item)
  }

  const handleRowEdit = (item: Book) => {
    setOpen(true)
    setItemToAction(item)
  }

  const handleConfirm = async () => {
    setOpenConfirmationDialog(false)

    if (itemToAction) {
      startTransition(async () => {
        await deleteBook(itemToAction.bookId, pathname)
      })

      toast({
        description: `${itemToAction.name} deleted`
      })
    }
  }
  return (
    <>
      <DataTable
        columns={columns}
        data={data.data}
        total={data.total}
        filter_column='name'
        onRowDelete={handleRowDelete}
        onRowEdit={handleRowEdit}
      />
      <AddBookDialog open={open} setOpen={setOpen} />

      <ConfirmationDialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        onConfirm={handleConfirm}
        message='By continuing you are going to delete the book, continue?'
      />
    </>
  )
}

export default CatalogTable
