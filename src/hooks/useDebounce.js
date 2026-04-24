import { useState, useEffect } from 'react'

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms
 * of inactivity. Ideal for deferring search API calls.
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
