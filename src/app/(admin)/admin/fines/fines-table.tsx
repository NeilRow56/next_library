'use client'

import React, { startTransition, useState } from 'react'

import { usePathname } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

import { DataTable } from '@/components/shared/DataTable'
import ConfirmationDialog from '@/components/shared/ConfirmationDialog'

import { Fine, columns } from './columns'

type props = {
  data: Fine[]
  total: number
}
function FinesTable({ data }: { data: props }) {
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false)
  const [itemToAction, setItemToAction] = useState<Fine>()
  const [dialogReason, setDialogReason] = useState('')
  const [dialogMessage, setDialogMessage] = useState('')
  const pathname = usePathname()
  const { toast } = useToast()

  const handleRowDelete = (item: Fine) => {
    setDialogReason('delete')
    setDialogMessage(
      'By continuing you are going to delete the fine, continue?'
    )
    setOpenConfirmationDialog(true)
    setItemToAction(item)
  }

  const handleMarkAsPaid = (item: Fine) => {
    setDialogReason('paid')
    setDialogMessage('Mark the fine as paid, continue?')
    setOpenConfirmationDialog(true)
    setItemToAction(item)
  }

  const handleConfirm = async () => {
    setOpenConfirmationDialog(false)

    if (itemToAction) {
      if (dialogReason === 'delete') {
        // await deleteFine(itemToAction.fineId, pathname)
        toast({ description: `fine deleted` })
      } else if (dialogReason === 'paid') {
        // markAsPaid(itemToAction.fineId, pathname)
        toast({ description: `fine deleted` })
      }
    }
  }

  return (
    <>
      <DataTable
        data={data.data}
        columns={columns}
        total={data.total}
        filter_column='name'
        onRowDelete={handleRowDelete}
        onRowEdit={handleMarkAsPaid}
      />

      <ConfirmationDialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        onConfirm={handleConfirm}
        message={dialogMessage}
      />
    </>
  )
}

export default FinesTable
