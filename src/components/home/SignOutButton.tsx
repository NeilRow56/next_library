import React from 'react'
import { Button } from '../ui/button'

import { cn } from '@/lib/utils'
import { signOut } from '@/app/utils/auth'

function SignOutButton({ styles }: { styles?: string }) {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
    >
      <Button type='submit' variant='ghost' className={cn(styles)}>
        Sign out
      </Button>
    </form>
  )
}

export default SignOutButton
