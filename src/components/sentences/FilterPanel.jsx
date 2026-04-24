import { useState } from 'react'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { MultiSelect } from 'primereact/multiselect'
import { Tag } from 'primereact/tag'
import { CATEGORIES, LANGUAGES } from '@/constants'

const LANGUAGE_OPTIONS = [
  { label: 'All Languages', value: '' },
  { label: 'English', value: 'en' },
  { label: 'Bangla', value: 'bn' },
]

const CATEGORY_OPTIONS = [{ label: 'All Categories', value: '' }, ...CATEGORIES.map((c) => ({ label: c, value: c }))]

const DEMO_TAGS = [
  'formal', 'common', 'casual', 'introduction', 'polite', 'request',
  'morning', 'restaurant', 'ordering', 'travel', 'emergency', 'health',
  'business', 'meeting', 'shopping', 'price', 'family', 'emotion',
  'technology', 'modern', 'learning', 'communication', 'weather', 'education',
]

const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  const [open, setOpen] = useState(false)

  const activeCount = [filters.category, filters.lang, ...(filters.tags || [])].filter(Boolean).length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <Button
            label="Filters"
            icon="pi pi-filter"
            size="small"
            outlined={!open}
            onClick={() => setOpen((v) => !v)}
          />
          {activeCount > 0 && (
            <span style={{ position: 'absolute', top: -6, right: -6, background: 'var(--primary-color)', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <Button label="Clear All" icon="pi pi-times" size="small" text severity="danger" onClick={onReset} />
        )}
      </div>

      {open && (
        <div style={{ marginTop: '0.75rem', padding: '1rem', background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-color-secondary)' }}>Language</label>
            <Dropdown
              value={filters.lang || ''}
              options={LANGUAGE_OPTIONS}
              onChange={(e) => onFilterChange({ lang: e.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-color-secondary)' }}>Category</label>
            <Dropdown
              value={filters.category || ''}
              options={CATEGORY_OPTIONS}
              onChange={(e) => onFilterChange({ category: e.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-color-secondary)' }}>Tags</label>
            <MultiSelect
              value={filters.tags || []}
              options={DEMO_TAGS.map((t) => ({ label: t, value: t }))}
              onChange={(e) => onFilterChange({ tags: e.value })}
              placeholder="Filter by tags…"
              style={{ width: '100%' }}
              display="chip"
            />
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
          {filters.lang && (
            <Tag value={`Lang: ${LANGUAGES[filters.lang] || filters.lang}`} severity="info" style={{ cursor: 'pointer' }} onClick={() => onFilterChange({ lang: '' })} />
          )}
          {filters.category && (
            <Tag value={`Category: ${filters.category}`} severity="warning" style={{ cursor: 'pointer' }} onClick={() => onFilterChange({ category: '' })} />
          )}
          {(filters.tags || []).map((tag) => (
            <Tag key={tag} value={`#${tag}`} style={{ cursor: 'pointer' }} onClick={() => onFilterChange({ tags: filters.tags.filter((t) => t !== tag) })} />
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterPanel
