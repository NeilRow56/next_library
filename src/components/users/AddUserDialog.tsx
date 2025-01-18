import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { User } from '@/app/(admin)/admin/users/columns'
import { useToast } from '@/hooks/use-toast'
import { usePathname } from 'next/navigation'
import { userSchema } from '@/app/schemas/user'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'
import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'
import { Button } from '../ui/button'
import { addUser, updateUser } from '@/actions/actions'

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  user?: User
}

function AddUserDialog({ setOpen, open, user }: Props) {
  const { toast } = useToast()
  const [processing, setProcessing] = useState(false)
  const path = usePathname()

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      libraryCardNo: '',
      role: 'member',
      isActive: true
    }
  })

  useEffect(() => {
    if (user) {
      form.setValue('userId', user.userId)
      form.setValue('email', user.email)
      form.setValue('libraryCardNo', user.libraryCardNo)
      form.setValue('role', user.role)
      form.setValue('isActive', user.isActive as boolean)
    }
  }, [user, form])

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    let message = 'User added'
    setProcessing(true)
    if (user) {
      // update
      await updateUser(
        values.userId,
        values.name,
        values.email,
        values.libraryCardNo,
        values.role,
        values.isActive,
        path
      )
      message = 'User updated'
    } else {
      await addUser(
        values.name,
        values.email,
        values.libraryCardNo,
        values.role,
        values.isActive,
        path
      )
    }

    toast({
      description: message
    })
    setProcessing(false)
    form.reset()
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Users list</DialogTitle>
          <DialogDescription></DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-bold text-primary'>
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='first last' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-bold text-primary'>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='email@domain.com' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='libraryCardNo'
                render={({ field }) => (
                  <FormItem className='grid'>
                    <FormLabel className='font-bold text-primary'>
                      Library card no
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='e.g. 4545...' {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the 10 digit library card no.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='grid'>
                    <FormLabel className='font-bold text-primary'>
                      Role
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='member'>Member</SelectItem>
                        <SelectItem value='staff'>Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isActive'
                render={({ field }) => (
                  <FormItem className='flex items-center space-x-3 space-y-0'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel
                      className={cn(
                        `${field.value ? 'text-green-500' : 'text-red-500'}`,
                        'text-md font-semibold'
                      )}
                    >
                      {field.value ? 'Active' : 'Inactive'}
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className='flex w-full flex-col space-y-2'>
                {processing ? (
                  <div className='flex'>
                    <Loader className='mr-2 animate-spin' />
                    Saving...
                  </div>
                ) : (
                  <Button type='submit'>Save</Button>
                )}
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AddUserDialog
