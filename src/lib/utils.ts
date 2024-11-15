import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import bcryptjs from 'bcryptjs'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function matchPassword({ password, hash }: { password: string; hash: string }) {
  return await bcryptjs.compare(password, hash)
}

export const areValuesIdentical = (
  original: Record<string, unknown>,
  updated: Record<string, unknown>,
) => Object.keys(updated).every(key => updated[key] === original[key])
