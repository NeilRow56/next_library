import React from 'react'
import { Button } from '../ui/button'

import { cn } from '@/lib/utils'
import { signIn } from '@/app/utils/auth'

function SignInButton({ styles }: { styles?: string }) {
  return (
    <form
      action={async () => {
        'use server'
        await signIn()
      }}
    >
      <Button type='submit' variant='ghost' className={cn(styles)}>
        Sign in
      </Button>
    </form>
  )
}

export default SignInButton
