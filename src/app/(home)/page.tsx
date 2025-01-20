import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import db from '@/lib/db'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const arrivals = await db.book.findMany({
    skip: 0,
    take: 10,
    include: {
      bookPhotos: {
        select: { url: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return (
    <>
      <div className='container mx-auto flex flex-col justify-center space-y-16 p-16 sm:p-32'>
        {/* New Arrivals */}
        <div>
          <h2 className='pb-4 pl-4 text-2xl font-bold'>New arrivals</h2>
          <Carousel
            opts={{
              slidesToScroll: 'auto',
              align: 'start'
            }}
            className='min-w-xl flex w-full'
          >
            <CarouselContent>
              {arrivals.map(arrival => (
                <CarouselItem key={arrival.bookId} className='basis-auto'>
                  <Link href={`/book/${arrival.bookId}`}>
                    <Image
                      className='h-[200px] w-[150px] sm:h-[290px] sm:w-[200px]'
                      src={arrival.bookPhotos[0].url}
                      width={190}
                      height={0}
                      alt={arrival.name}
                    />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <h2>Recently reviewed</h2>
        {/* Add recently reviewed */}
        <h2>Staff picks</h2>
        {/* Add staff picks */}
      </div>
    </>
  )
}
