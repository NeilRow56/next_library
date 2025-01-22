import React from 'react'
import Logo from '../shared/Logo'
import SearchBar from '../shared/SearchBar'
import { SidebarTrigger } from '../ui/sidebar'

function Header() {
  return (
    <>
      <header className='container mx-auto bg-gray-50 py-2 lg:py-4'>
        {/* mobile */}
        <div className='flex flex-col justify-between p-2 sm:hidden'>
          <div className='flex items-center'>
            {/* logo */}
            <Logo />
            {/* sidebar trigger */}
            <SidebarTrigger className='ml-2 flex md:hidden' />
          </div>
          <SearchBar />
        </div>

        {/* desktop */}
        <div className='hidden items-center justify-between sm:flex'>
          {/* logo */}
          <Logo />
          <SearchBar />
        </div>
      </header>
    </>
  )
}

export default Header
