import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar'

import React from 'react'

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb className='hidden text-xl text-primary md:block'>
            Your local library online!
          </Breadcrumb>
        </header>

        <div className='container' />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AdminLayout
