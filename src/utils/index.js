import { format, parseISO } from 'date-fns'

/**
 * Format an ISO timestamp to a readable date string
 */
export const formatDate = (isoString) => {
  if (!isoString) return '—'
  try {
    return format(parseISO(isoString), 'dd MMM yyyy, hh:mm a')
  } catch {
    return isoString
  }
}

/**
 * Format date short
 */
export const formatDateShort = (isoString) => {
  if (!isoString) return '—'
  try {
    return format(parseISO(isoString), 'dd MMM yyyy')
  } catch {
    return isoString
  }
}

/**
 * Truncate text to a given max length
 */
export const truncate = (text, maxLength = 60) => {
  if (!text) return ''
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text
}

/**
 * Build query string from a plain object, filtering out empty values
 */
export const buildQueryString = (params) => {
  const filtered = Object.entries(params).filter(
    ([, v]) => v !== '' && v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0)
  )
  if (!filtered.length) return ''
  const qs = new URLSearchParams()
  filtered.forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => qs.append(key, v))
    } else {
      qs.set(key, value)
    }
  })
  return `?${qs.toString()}`
}

/**
 * Safely parse JSON, returning defaultValue on failure
 */
export const safeJsonParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str)
  } catch {
    return defaultValue
  }
}

/**
 * Get initials from a name/email string
 */
export const getInitials = (str = '') => {
  const parts = str.trim().split(/[\s@._-]+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}
