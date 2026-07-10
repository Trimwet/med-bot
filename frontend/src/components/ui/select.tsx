import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  options: SelectOption[]
  className?: string
}

export const Select = ({ value, onValueChange, placeholder = 'Select...', options, className = '' }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 rounded-lg border border-line bg-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-teal/20 focus:ring-offset-0 focus:border-teal/40 transition-all flex items-center justify-between ${selected ? 'text-ink' : 'text-muted/50'}`}
      >
        <span>{selected?.label || placeholder}</span>
        <ChevronDown className={`size-4 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-line bg-white shadow-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onValueChange(option.value)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${
                value === option.value
                  ? 'bg-teal/10 text-teal font-medium'
                  : 'text-ink hover:bg-paper-soft'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
