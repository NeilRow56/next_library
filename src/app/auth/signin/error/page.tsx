'use client'

import BackButton from '@/components/shared/BackButton'
import { useSearchParams } from 'next/navigation'
import React from 'react'

function SigninErrorPage() {
  const searchParams = useSearchParams()

  const error = searchParams.get('error')

  return (
    <>
      <h1 className='text-2xl text-red-500'>Error</h1>
      <p className=''>An error occurred while signing in</p>
      <p className='text-red-500'>{error}</p>
      <BackButton />
    </>
  )
}

export default SigninErrorPage
