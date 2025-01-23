'use client'

import React, { useActionState, useState } from 'react'

import { Textarea } from '../ui/textarea'
import { addRating, State } from '@/actions/actions'
import { Button } from '../ui/button'
import Rating from './Rating'

function CommentBox({ bookId }: { bookId: number }) {
  const intialState: State = { message: null }
  const [rating, setRating] = useState(0)
  const addRatingWithBookId = addRating.bind(null, bookId)
  const [state, formAction, isPending] = useActionState(
    addRatingWithBookId,
    intialState
  )

  return (
    <div className='flex max-w-4xl flex-col p-2'>
      <div className='flex flex-col rounded-sm border bg-gray-50 p-4'>
        <p className='text-lg font-semibold'>Give your feedback</p>
        <form action={formAction}>
          <input type='hidden' name='rating' value={rating} />
          <Rating rating={rating} ratingClick={index => setRating(index)} />
          <Textarea
            maxLength={200}
            className='bg-white'
            name='comment'
            placeholder='Leave your comments'
          />
          <Button type='submit' className='mt-2' disabled={isPending}>
            Submit
          </Button>
          <div>
            {state?.message ? (
              <p className='my-2 text-sm'>{state.message}</p>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  )
}

export default CommentBox
