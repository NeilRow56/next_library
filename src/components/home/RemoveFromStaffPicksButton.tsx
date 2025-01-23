'use client'

import React from 'react'
import { Button } from '../ui/button'
import { removeFromStaffPicks } from '@/actions/actions'
import { usePathname } from 'next/navigation'

function RemoveFromStaffPicksButton({ pickId }: { pickId: number }) {
  const path = usePathname()

  const handleRemove = async () => {
    await removeFromStaffPicks(pickId, path)
  }
  return <Button onClick={handleRemove}>Remove from staff pick</Button>
}

export default RemoveFromStaffPicksButton
