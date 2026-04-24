import { useState, useCallback } from 'react'
import { Chips } from 'primereact/chips'

const TagInput = ({ value = [], onChange, label = 'Tags', placeholder = 'Type and press Enter…', maxTags = 10 }) => {
  const handleChange = useCallback(
    (e) => {
      const tags = (e.value || [])
        .map((t) => t.trim().toLowerCase())
        .filter((t, i, arr) => t && arr.indexOf(t) === i)
        .slice(0, maxTags)
      onChange(tags)
    },
    [onChange, maxTags]
  )

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', color: 'var(--text-color-secondary)', fontWeight: 500 }}>{label}</label>
      <Chips
        value={value}
        onChange={handleChange}
        placeholder={value.length < maxTags ? placeholder : ''}
        style={{ width: '100%' }}
        pt={{ container: { style: { width: '100%', borderRadius: '8px' } } }}
      />
      <small style={{ color: 'var(--text-color-secondary)' }}>{value.length}/{maxTags} tags</small>
    </div>
  )
}

export default TagInput
