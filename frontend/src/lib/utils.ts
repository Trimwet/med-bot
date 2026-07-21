import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a phone number input — strip non-digits, max 11 chars.
 */
export function formatPhoneInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11)
}

/**
 * Strip formatting from a phone number, returning only digits.
 */
export function stripPhoneFormat(value: string): string {
  return value.replace(/\D/g, '')
}
