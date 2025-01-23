'use client'

import React from 'react'
import { Button } from '../ui/button'

import { usePathname } from 'next/navigation'
import { cancelHold } from '@/actions/actions'

function CancelHoldButton({ reservationId }: { reservationId: number }) {
  const path = usePathname()

  const handleCancelHold = async () => {
    await cancelHold(reservationId, path)
  }
  return <Button onClick={handleCancelHold}>Cancel hold</Button>
}

export default CancelHoldButton
