import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const pageSize = 10

export function formatISBN(isbn: string) {
  const cleanisbn = isbn.replace(/\D/g, '')

  if (cleanisbn.length !== 10 && cleanisbn.length !== 13) {
    return null
  }

  if (cleanisbn.length === 10) {
    return cleanisbn.replace(
      /(\d{1})(\d{3})(\d{1})(\d{3})(\d{1})(\d{1})/,
      '$1-$2-$3-$4-$5-$6'
    )
  }

  // Format ISBN-13 with hyphens
  if (cleanisbn.length === 13) {
    return cleanisbn.replace(
      /(\d{3})(\d{1})(\d{1})(\d{1})(\d{5})(\d{1})(\d{1})/,
      '$1-$2-$3-$4-$5-$6-$7'
    )
  }

  return 'INVALID' // Invalid ISBN
}
