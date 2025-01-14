'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { PlusIcon } from 'lucide-react'
import AddBookDialog from './AddBookDialog'

function AddBookButton() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Button className='self-end' onClick={() => setOpen(true)}>
        <PlusIcon />
        Add book
      </Button>
      <AddBookDialog open={open} setOpen={setOpen} />
    </div>
  )
}

export default AddBookButton
