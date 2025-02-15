import { buttonVariants } from '@/components/ui/button'
import { Ban, PlusCircle } from 'lucide-react'
import Link from 'next/link'

interface iAppProps {
  title: string
  description: string
}

export function EmptyState({
  description,

  title
}: iAppProps) {
  return (
    <div className='h-ful flex flex-1 flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center animate-in fade-in-50'>
      <div className='flex size-20 items-center justify-center rounded-full bg-primary/10'>
        <Ban className='size-10 text-red-300' />
      </div>
      <h2 className='mt-6 text-xl font-semibold'>{title}</h2>
      <p className='max-w-xm mx-auto mb-8 mt-2 text-center text-sm text-muted-foreground'>
        {description}
      </p>
    </div>
  )
}
