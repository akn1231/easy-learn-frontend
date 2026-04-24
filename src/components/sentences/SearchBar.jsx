import { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { useDebounce } from '@/hooks/useDebounce'

const SearchBar = ({ value, onChange, placeholder = 'Search sentences…' }) => {
  const [localValue, setLocalValue] = useState(value)
  const debounced = useDebounce(localValue, 400)

  useEffect(() => {
    if (debounced !== value) onChange(debounced)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  useEffect(() => {
    if (value === '' && localValue !== '') setLocalValue('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
      <i className="pi pi-search" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-color-secondary)', zIndex: 1 }} />
      <InputText
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', paddingLeft: '2.25rem', paddingRight: localValue ? '2.25rem' : '0.75rem' }}
      />
      {localValue && (
        <i
          className="pi pi-times"
          onClick={() => { setLocalValue(''); onChange('') }}
          style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-color-secondary)', cursor: 'pointer', zIndex: 1 }}
        />
      )}
    </div>
  )
}

export default SearchBar
