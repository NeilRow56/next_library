import React from 'react'
import CancelHoldButton from './CancelHoldButton'
import PlaceHoldButton from './PlaceHoldButton'
import { auth } from '@/app/utils/auth'
import db from '@/lib/db'

async function HoldButton({ bookId }: { bookId: number }) {
  const session = await auth()

  if (!session) return null

  const reservation = await db.reservation.findFirst({
    where: {
      userId: session.user.userId,
      bookId: +bookId
    }
  })

  return (
    <>
      {reservation ? (
        <CancelHoldButton reservationId={reservation.reservationId} />
      ) : (
        <PlaceHoldButton bookId={bookId} />
      )}
    </>
  )
}

export default HoldButton
