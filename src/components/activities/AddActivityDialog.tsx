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
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Activity } from '@/app/(admin)/admin/activities/columns'
import { Textarea } from '../ui/textarea'

import { addActivity, updateActivity } from '@/actions/actions'
import { Loader } from 'lucide-react'
import DateSelect from '../shared/DateSelect'
import TimeSelect from '../shared/TimeSelect'
import ImageDropzone from '../shared/ImageDropzone'
import { activitiesSchema } from '@/app/schemas/activities'

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  activity?: Activity
}

function AddActivityDialog({ setOpen, open, activity }: Props) {
  const { toast } = useToast()
  const [processing, setProcessing] = useState(false)
  const path = usePathname()

  const form = useForm<z.infer<typeof activitiesSchema>>({
    resolver: zodResolver(activitiesSchema),
    defaultValues: {
      title: '',
      description: '',
      ageGroup: '',
      capacity: 0,
      photos: []
    }
  })

  useEffect(() => {
    if (activity) {
      form.setValue('activityId', activity.activityId)
      form.setValue('title', activity.title)
      form.setValue('description', activity.description!)
      form.setValue('activityDate', activity.activityDate)
      form.setValue('startTime', activity.startTime)
      form.setValue('endTime', activity.endTime)
      form.setValue('ageGroup', activity.ageGroup!)
      form.setValue('capacity', activity.capacity!)
      form.setValue('photos', activity.activityPhotos?.map(p => p.url) || [])
    }
  }, [activity, form])

  const onSubmit = async (values: z.infer<typeof activitiesSchema>) => {
    try {
      let message = 'Activity has been saved'
      setProcessing(true)
      if (activity) {
        await updateActivity({ ...values, path })
        message = 'Activity updated'
        setOpen(false)
      } else {
        await addActivity({ ...values, path })
      }

      toast({
        description: message
      })
      form.reset()
      setProcessing(false)
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
          <DialogTitle>List activity</DialogTitle>
          <DialogDescription></DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-1'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-bold text-primary'>
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Activity title' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-bold text-primary'>
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        maxLength={200}
                        placeholder='Provide a description of the activity'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='activityDate'
                render={({ field }) => (
                  <FormItem className='grid'>
                    <FormLabel>Activity date</FormLabel>
                    <FormControl>
                      <DateSelect field={field} disableDates={true} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 gap-3 py-2 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='startTime'
                  render={({ field }) => (
                    <FormItem className='grid'>
                      <FormLabel className='font-bold text-primary'>
                        Start time
                      </FormLabel>
                      <FormControl>
                        <TimeSelect
                          onChange={field.onChange}
                          defaultValue={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='endTime'
                  render={({ field }) => (
                    <FormItem className='grid'>
                      <FormLabel className='font-bold text-primary'>
                        End time
                      </FormLabel>
                      <FormControl>
                        <TimeSelect
                          disableTime={form.getValues('startTime')}
                          onChange={field.onChange}
                          defaultValue={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-1 gap-3 py-2 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='ageGroup'
                  render={({ field }) => (
                    <FormItem className='grid'>
                      <FormLabel className='font-bold text-primary'>
                        Age group
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Over 65' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='capacity'
                  render={({ field }) => (
                    <FormItem className='grid'>
                      <FormLabel className='font-bold text-primary'>
                        Capacity
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. 10' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='photos'
                render={({ field }) => <ImageDropzone photos={field.value} />}
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

export default AddActivityDialog
