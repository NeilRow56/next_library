'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { PlusIcon } from 'lucide-react'
import AddCategoryDialog from './AddCategoryDialog'

function AddCategoryButton() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Button className='self-end' onClick={() => setOpen(true)}>
        <PlusIcon />
        Add category
      </Button>
      <AddCategoryDialog open={open} setOpen={setOpen} />
    </div>
  )
}

export default AddCategoryButton
