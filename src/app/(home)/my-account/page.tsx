import { auth, signIn } from '@/app/utils/auth'
import BorrowingHistory from '@/components/home/BorrowingHistory'
import Checkout from '@/components/home/Checkout'
import Fines from '@/components/home/Fines'
import OnHold from '@/components/home/OnHold'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

async function AccountPage() {
  const session = await auth()

  if (!session) signIn()

  return (
    <div className='container mx-auto p-8 sm:max-w-6xl'>
      <Tabs defaultValue='checked-out' className='flex w-full flex-col'>
        <TabsList>
          <TabsTrigger value='checked-out'>Checked out</TabsTrigger>
          <TabsTrigger value='on-hold'>On hold</TabsTrigger>
          <TabsTrigger value='fines'>Fines</TabsTrigger>
          <TabsTrigger value='borrowing-history'>Borrowing history</TabsTrigger>
        </TabsList>
        <TabsContent value='checked-out'>
          <Checkout />
        </TabsContent>
        <TabsContent value='on-hold'>
          <OnHold />
        </TabsContent>
        <TabsContent value='fines'>
          <Fines />
        </TabsContent>
        <TabsContent value='borrowing-history'>
          <BorrowingHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AccountPage
