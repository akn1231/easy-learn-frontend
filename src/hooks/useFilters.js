import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PAGINATION } from '@/constants'

/**
 * Manages all filter/pagination state via URL search params so
 * filters survive navigation and can be bookmarked / shared.
 */
export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const tags = searchParams.getAll('tags')
  const lang = searchParams.get('lang') || ''
  const page = Number(searchParams.get('page') || PAGINATION.DEFAULT_PAGE)
  const limit = Number(searchParams.get('limit') || PAGINATION.DEFAULT_PAGE_SIZE)
  const sortField = searchParams.get('sortField') || 'createdAt'
  const sortOrder = searchParams.get('sortOrder') || 'desc'

  const setFilter = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        Object.entries(updates).forEach(([key, value]) => {
          if (key === 'tags') {
            next.delete('tags')
            if (Array.isArray(value)) value.forEach((t) => next.append('tags', t))
          } else if (value === '' || value === null || value === undefined) {
            next.delete(key)
          } else {
            next.set(key, String(value))
          }
        })
        // Reset to page 1 whenever filters change (not pagination itself)
        if (!('page' in updates)) next.set('page', '1')
        return next
      })
    },
    [setSearchParams]
  )

  const resetFilters = useCallback(() => {
    setSearchParams({})
  }, [setSearchParams])

  const filters = { search, category, tags, lang, page, limit, sortField, sortOrder }

  return { filters, setFilter, resetFilters }
}
