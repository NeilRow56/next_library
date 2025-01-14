import { Book } from '@/app/(admin)/admin/(catalogue)/columns'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Input } from '../ui/input'
import { useForm } from 'react-hook-form'

type CatalogueProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  // We get Book from the exported type in (catalogue )/columns. This has been extended from the Book in prisma/client
  book?: Book
}

function AddBookDialog({ open, setOpen, book }: CatalogueProps) {
  const form = useForm()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add book</DialogTitle>
          <DialogDescription></DialogDescription>
          <Form {...form}>
            <form onSubmit={() => {}} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book name</FormLabel>
                    <FormControl>
                      <Input placeholder='book name' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AddBookDialog
