import React from 'react'

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='space-y-2 p-2'>
      <div className='container'>{children}</div>
    </div>
  )
}

export default AdminLayout
