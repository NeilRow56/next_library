'use client'

import { checkinBook, checkoutBook, State } from '@/actions/actions'
import BackButton from '@/components/shared/BackButton'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import React, { useActionState } from 'react'

function KioskPage() {
  const initialState: State = { message: null }
  const [stateCheckout, formActionCheckout] = useActionState(
    checkoutBook,
    initialState
  )
  const [stateCheckin, formActionCheckin] = useActionState(
    checkinBook,
    initialState
  )

  return (
    <div className='shadow-md" container mx-auto mt-32 max-w-md rounded-md border border-slate-300'>
      {stateCheckout.message && (
        <p className='rounded-md border border-blue-300 bg-blue-100 p-2'>
          {stateCheckout.message}
        </p>
      )}
      <form action={formActionCheckout}>
        <div className='space-y-2 p-8'>
          <BackButton />
          <h1 className='mb-4 text-center text-2xl font-bold'>
            Kiosk simulator
          </h1>

          <div>
            <Label htmlFor='library_card_no'>Library card no</Label>
            <Input name='library_card_no' id='library_card_no' type='text' />
          </div>

          <div>
            <Label htmlFor='isbn'>ISBN #</Label>
            <Input name='isbn' id='isbn' type='text' />
          </div>

          <Button type='submit' className='w-full'>
            Checkout
          </Button>
        </div>
      </form>

      <Separator />

      <form action={formActionCheckin}>
        {stateCheckin.message && (
          <p className='rounded-md border border-blue-300 bg-blue-100 p-2'>
            {stateCheckin.message}
          </p>
        )}
        <div className='space-y-2 p-8'>
          <div>
            <Label htmlFor='isbn'>ISBN #</Label>
            <Input name='isbn' id='isbn' type='text' />
          </div>

          <Button type='submit' className='w-full'>
            Checkin
          </Button>
        </div>
      </form>
    </div>
  )
}

export default KioskPage
