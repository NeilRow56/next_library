'use client'

import React from 'react'
import { Button } from '../ui/button'
import { addToStaffPicks } from '@/actions/actions'
import { usePathname } from 'next/navigation'

function AddToStaffPickButton({ bookId }: { bookId: number }) {
  const path = usePathname()

  const handleAdd = async () => {
    await addToStaffPicks(bookId, path)
  }
  return <Button onClick={handleAdd}>Add to staff pick</Button>
}

export default AddToStaffPickButton
