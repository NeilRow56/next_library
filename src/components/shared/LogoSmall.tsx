import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function LogoSmall() {
  return (
    <div className='flex w-full items-center space-x-4'>
      <div>
        <Link href='/'>
          <Image
            className='flex'
            src='/logo.png'
            width={45}
            height={30}
            alt='library logo'
          />
        </Link>
      </div>

      <div>
        <Link href='/'>
          <h3 className='text-xl font-bold text-primary'>Library</h3>
        </Link>
      </div>
    </div>
  )
}

export default LogoSmall
