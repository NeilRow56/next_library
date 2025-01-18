'use client'

import React, { startTransition, useState } from 'react'

import { usePathname } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

import { DataTable } from '@/components/shared/DataTable'
import ConfirmationDialog from '@/components/shared/ConfirmationDialog'

import { User, columns } from './columns'
import AddActivityDialog from '@/components/activities/AddActivityDialog'
import AddUserDialog from '@/components/users/AddUserDialog'

type props = {
  data: User[]
  total: number
}
function UsersTable({ data }: { data: props }) {
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false)
  const [itemToAction, setItemToAction] = useState<User>()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { toast } = useToast()

  const handleRowDelete = (item: User) => {
    setOpenConfirmationDialog(true)
    setItemToAction(item)
  }

  const handleRowEdit = (item: User) => {
    setItemToAction(item)
    setOpen(true)
  }

  const handleConfirm = async () => {
    setOpenConfirmationDialog(false)
  }

  return (
    <>
      <DataTable
        data={data.data}
        columns={columns}
        total={data.total}
        filter_column='name'
        onRowDelete={handleRowDelete}
        onRowEdit={handleRowEdit}
      />
      <AddUserDialog open={open} setOpen={setOpen} user={itemToAction} />
      <ConfirmationDialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        onConfirm={handleConfirm}
        message='By continuing you are going to delete the user, continue?'
      />
    </>
  )
}

export default UsersTable
