import React from 'react'

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='container mx-auto mt-32 flex max-w-md flex-col space-y-2 rounded-md border border-slate-300 p-8 shadow-md'>
      {children}
    </div>
  )
}

export default AuthLayout
