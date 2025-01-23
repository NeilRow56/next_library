'use client'

import React from 'react'
import { Button } from '../ui/button'
import { placeHold } from '@/actions/actions'
import { usePathname } from 'next/navigation'

function PlaceHoldButton({ bookId }: { bookId: number }) {
  const path = usePathname()

  const handlePlaceHold = async () => {
    await placeHold(bookId, path)
  }
  return (
    <Button
      variant='ghost'
      className='rounded-md bg-green-500 px-4 py-2 text-center text-white hover:bg-green-700'
      onClick={handlePlaceHold}
    >
      Place hold
    </Button>
  )
}

export default PlaceHoldButton
