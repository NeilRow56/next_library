import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import React from 'react'

import { auth, signIn } from '../utils/auth'
import BackButton from '@/components/shared/BackButton'
import db from '@/lib/db'
import ProfileForm from './ProfileForm'
import SignOutButton from '@/components/home/SignOutButton'

async function ProfilePage() {
  const session = await auth()

  if (!session) {
    await signIn()
  }

  const user_details = await db.user.findUnique({
    where: {
      email: session?.user.email as string
    }
  })

  return (
    <div className='container mx-auto mt-32 max-w-md space-y-2 rounded-md border border-slate-300 p-8 shadow-md'>
      <BackButton />
      <h1 className='mb-4 text-2xl font-bold'>Profile</h1>
      <p>
        Hello,{' '}
        <span className='font-bold capitalize'>{session?.user.name}</span>
      </p>
      {session?.user.role === 'staff' && (
        <div>
          {session?.user.profileStatus === 'pending' && (
            <p className='rounded-md border border-red-300 bg-red-100 p-2'>
              You must update your password and re-login
            </p>
          )}
          {!user_details?.isActive && (
            <p className='rounded-md border border-red-300 bg-red-100 p-2'>
              Your account has been deactivated
            </p>
          )}
        </div>
      )}

      <div>
        <Label>Name</Label>
        <Input
          readOnly
          type='text'
          defaultValue={session?.user.name as string}
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          readOnly
          type='text'
          defaultValue={session?.user.email as string}
        />
      </div>

      {session?.user.role === 'member' && (
        <div>
          <Label>Library card no</Label>
          <Input
            readOnly
            type='text'
            defaultValue={user_details?.libraryCardNo as string}
          />
        </div>
      )}

      {session?.user.role === 'staff' && <ProfileForm />}
      <div className='pt-2'>
        <SignOutButton styles='w-full border bg-primary text-white' />
      </div>
    </div>
  )
}

export default ProfilePage
