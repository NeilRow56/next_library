import db from '@/lib/db'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type ResultType = {
  bookId: number
  author: string
  name: string
  bookCategoryLinks: {
    categoryId: number
    bookCategories: {
      category_name: string
    }
  }[]
  bookPhotos: { url: string }[]
}

async function SearchPage({
  searchParams
}: {
  searchParams: { query: string; search_by: string }
}) {
  const params = await searchParams

  const { query, search_by } = params
  let results: ResultType[] = []

  if (search_by === 'title') {
    results = await db.book.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { name: { startsWith: query } },
          { name: { endsWith: query } }
        ]
      },
      include: {
        bookPhotos: {
          select: { url: true }
        },
        bookCategoryLinks: {
          include: {
            bookCategories: {
              select: { category_name: true }
            }
          }
        }
      }
    })
  }
  if (search_by === 'category') {
    results = await db.book.findMany({
      where: {
        bookCategoryLinks: {
          some: {
            bookCategories: {
              category_name: { contains: query }
            }
          }
        }
      },
      include: {
        bookPhotos: {
          select: { url: true }
        },
        bookCategoryLinks: {
          include: {
            bookCategories: {
              select: { category_name: true }
            }
          }
        }
      }
    })
  }

  return (
    <>
      <div className='mx-auto max-w-7xl flex-col space-y-8 p-4 pt-16 sm:space-x-4'>
        <h1 className='text-2xl sm:text-4xl'>Search results</h1>
        {results &&
          results.length > 0 &&
          results.map(result => (
            <div
              key={result.bookId}
              className='flex flex-col sm:space-x-4 lg:flex-row'
            >
              {result.bookPhotos && (
                <Link
                  href={`/book/${result.bookId}`}
                  className='cursor-pointer'
                >
                  <Image
                    width={100}
                    height={0}
                    src={result.bookPhotos[0].url}
                    alt='book cover'
                    className='h-auto rounded-l-md object-cover'
                  />
                </Link>
              )}

              <div className='flex flex-col'>
                <h1 className='mb-1 text-2xl font-bold capitalize text-gray-800'>
                  {result.name}
                </h1>
                <p className='capitalize text-blue-500'>{result.author}</p>
                <div className='flex space-x-2'>
                  {result.bookCategoryLinks &&
                    result.bookCategoryLinks.map(bcl => (
                      <div
                        key={bcl.categoryId}
                        className='rounded-md border border-gray-300 px-4 py-2 capitalize text-gray-500'
                      >
                        {bcl.bookCategories.category_name}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        {results && results.length === 0 && (
          <h2 className='text-2xl'>No results found</h2>
        )}
      </div>
    </>
  )
}

export default SearchPage
