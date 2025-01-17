'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { PlusIcon } from 'lucide-react'
import AddActivityDialog from './AddActivityDialog'

function AddActivityButton() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Button className='self-end' onClick={() => setOpen(true)}>
        <PlusIcon />
        List activity
      </Button>
      <AddActivityDialog open={open} setOpen={setOpen} />
    </div>
  )
}

export default AddActivityButton
