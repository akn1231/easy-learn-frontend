import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { ProgressSpinner } from 'primereact/progressspinner'
import { CSVLink } from 'react-csv'

import SearchBar from '@/components/sentences/SearchBar'
import FilterPanel from '@/components/sentences/FilterPanel'
import DisplayModeToggle from '@/components/sentences/DisplayModeToggle'
import SentenceListItem from '@/components/sentences/SentenceListItem'
import SentenceForm from '@/components/sentences/SentenceForm'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'

import { useFilters } from '@/hooks/useFilters'
import {
  useInfiniteSentences,
  useCreateSentence,
  useUpdateSentence,
  useDeleteSentence,
  useApproveSentence,
} from '@/hooks/useSentences'
import useAuthStore from '@/store/authStore'
import { DISPLAY_MODES } from '@/constants'
import { sentencesToCsvRows, CSV_HEADERS } from '@/utils/csvExport'

const ListSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 10, padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', opacity: 1 - i * 0.12 }}>
        <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--surface-border)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 16, width: `${75 - i * 5}%`, background: 'var(--surface-border)', borderRadius: 4, marginBottom: 8 }} />
          <div style={{ height: 14, width: `${58 - i * 4}%`, background: 'var(--surface-border)', borderRadius: 4 }} />
        </div>
      </div>
    ))}
  </div>
)

const SentencesPage = () => {
  const { isAuthenticated, user } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  const { filters, setFilter, resetFilters } = useFilters()
  const [displayMode, setDisplayMode] = useState(DISPLAY_MODES.BOTH)
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())

  useEffect(() => { setSelectedIds(new Set()) }, [filters.search, filters.category, filters.lang, filters.tags.join(',')])

  const handleToggleSelect = useCallback((id) => {
    setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }, [])

  const { data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteSentences({
    search: filters.search, category: filters.category, tags: filters.tags, lang: filters.lang,
  })

  const sentences = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data])
  const allSelected = sentences.length > 0 && selectedIds.size === sentences.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < sentences.length
  const selectedSentences = useMemo(() => sentences.filter((s) => selectedIds.has(s._id)), [sentences, selectedIds])
  const csvData = useMemo(() => sentencesToCsvRows(selectedSentences), [selectedSentences])

  const sentinelRef = useRef(null)
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage() }, { rootMargin: '200px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const createMutation = useCreateSentence()
  const updateMutation = useUpdateSentence()
  const deleteMutation = useDeleteSentence()
  const approveMutation = useApproveSentence()

  const handleOpenAdd = useCallback(() => { setEditTarget(null); setFormOpen(true) }, [])
  const handleEdit = useCallback((s) => { setEditTarget(s); setFormOpen(true) }, [])
  const handleDelete = useCallback((s) => setDeleteTarget(s), [])
  const handleApprove = useCallback((s) => approveMutation.mutate(s._id), [])

  const handleFormSubmit = useCallback(async (payload) => {
    if (editTarget) await updateMutation.mutateAsync({ id: editTarget._id, data: payload })
    else await createMutation.mutateAsync(payload)
    setFormOpen(false)
    setEditTarget(null)
  }, [editTarget, createMutation, updateMutation])

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    await deleteMutation.mutateAsync(deleteTarget._id)
    setDeleteTarget(null)
  }, [deleteTarget, deleteMutation])

  const showList = !isError && !isLoading && sentences.length > 0

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <h5 style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-color)' }}>Sentences</h5>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Button icon="pi pi-refresh" text rounded onClick={() => refetch()} tooltip="Refresh" tooltipOptions={{ position: 'bottom' }} />
          {isAuthenticated && (
            <Button label="Add Sentence" icon="pi pi-plus" onClick={handleOpenAdd} />
          )}
        </div>
      </div>

      {/* ── Search + Display mode ── */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <SearchBar value={filters.search} onChange={(v) => setFilter({ search: v })} />
        <DisplayModeToggle value={displayMode} onChange={setDisplayMode} />
      </div>

      {/* ── Filters ── */}
      <div style={{ marginBottom: '0.75rem' }}>
        <FilterPanel filters={filters} onFilterChange={setFilter} onReset={resetFilters} />
      </div>

      {/* ── Selection + Export bar ── */}
      {showList && isAuthenticated && (
        <div className={`selection-bar${selectedIds.size > 0 ? ' has-selection' : ''}`}>
          <Checkbox
            checked={allSelected}
            onChange={() => allSelected ? setSelectedIds(new Set()) : setSelectedIds(new Set(sentences.map((s) => s._id)))}
            indeterminate={someSelected}
          />
          <span style={{ fontSize: '0.875rem', color: selectedIds.size > 0 ? 'var(--primary-color)' : 'var(--text-color-secondary)', fontWeight: selectedIds.size > 0 ? 600 : 400 }}>
            {selectedIds.size > 0 ? `${selectedIds.size} selected` : 'Select to export'}
          </span>
          <div style={{ flex: 1 }} />
          {selectedIds.size > 0 ? (
            <CSVLink data={csvData} headers={CSV_HEADERS} filename={`easylearn-export-${Date.now()}.csv`} style={{ textDecoration: 'none' }}>
              <Button label={`Export ${selectedIds.size} ${selectedIds.size === 1 ? 'record' : 'records'}`} icon="pi pi-download" size="small" />
            </CSVLink>
          ) : (
            <Button label="Export CSV" icon="pi pi-download" size="small" outlined disabled />
          )}
        </div>
      )}

      {/* ── Content ── */}
      {isError ? (
        <ErrorState description={error?.message} onRetry={refetch} />
      ) : isLoading ? (
        <ListSkeleton />
      ) : sentences.length === 0 ? (
        <EmptyState
          title="No sentences found"
          description={isAuthenticated ? 'Try adjusting your search or filters, or add your first sentence.' : 'Try adjusting your search or filters.'}
          action={isAuthenticated ? handleOpenAdd : undefined}
          actionLabel="Add Sentence"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sentences.map((s) => (
            <SentenceListItem
              key={s._id}
              sentence={s}
              displayMode={displayMode}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onApprove={isAdmin ? handleApprove : undefined}
              selected={isAuthenticated ? selectedIds.has(s._id) : false}
              onSelect={isAuthenticated ? handleToggleSelect : undefined}
            />
          ))}

          <div ref={sentinelRef} style={{ paddingTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
            {isFetchingNextPage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 0' }}>
                <ProgressSpinner style={{ width: 20, height: 20 }} strokeWidth="4" />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-color-secondary)' }}>Loading more…</span>
              </div>
            )}
            {!hasNextPage && sentences.length > 0 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-color-secondary)', padding: '1rem 0', opacity: 0.6 }}>All sentences loaded</span>
            )}
          </div>
        </div>
      )}

      <SentenceForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null) }}
        onSubmit={handleFormSubmit}
        initialData={editTarget}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Sentence"
        description={`Are you sure you want to delete "${deleteTarget?.sentences?.en}"? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

export default SentencesPage
