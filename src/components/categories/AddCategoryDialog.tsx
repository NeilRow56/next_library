import React, { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { addCategory, updateCategory } from '@/actions/actions'
import { usePathname } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Category } from '@/app/(admin)/admin/categories/columns'
import { categorySchema } from '@/app/schemas/category'
import { SubmitButton } from '../shared/SubmitButton'
type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  category?: Category
}

function AddCategoryDialog({ setOpen, open, category }: Props) {
  const { toast } = useToast()
  const path = usePathname()

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' }
  })

  useEffect(() => {
    if (category) {
      form.setValue('id', category.category_id)
      form.setValue('name', category.category_name)
    }
  }, [category, form])

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    try {
      let message = 'Category has been created'
      if (category) {
        await updateCategory(category.category_id, values.name, path)
        message = 'category updated'
      } else {
        await addCategory(values.name, path)
      }

      toast({
        description: message
      })
      form.reset()
    } catch (error) {
      console.log(error)
      toast({
        description: 'Failed to perform action'
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add category</DialogTitle>
          <DialogDescription></DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-1'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder='category name' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className='w-[120px] py-2'>
                <SubmitButton text='Save' />
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AddCategoryDialog
