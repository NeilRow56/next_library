import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Logo() {
  return (
    <div className='flex w-full items-center space-x-4'>
      <div>
        <Link href='/'>
          <Image
            className='hidden lg:flex'
            src='/logo.png'
            width={120}
            height={80}
            alt='library logo'
          />
          <Image
            className='flex lg:hidden'
            src='/logo.png'
            width={90}
            height={60}
            alt='library logo'
          />
        </Link>
      </div>

      <div>
        <Link href='/'>
          <h3 className='text-4xl font-bold text-primary'>Library</h3>
        </Link>
      </div>
    </div>
  )
}

export default Logo
