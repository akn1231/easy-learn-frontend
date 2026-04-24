import { ProgressSpinner } from 'primereact/progressspinner'

const LoadingSpinner = ({ message = 'Loading…', fullPage = false }) => {
  if (fullPage) {
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: 'var(--surface-ground)', zIndex: 9999 }}>
        <ProgressSpinner style={{ width: 48, height: 48 }} strokeWidth="4" />
        <span style={{ color: 'var(--text-color-secondary)', fontSize: '0.9rem' }}>{message}</span>
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '2rem 0' }}>
      <ProgressSpinner style={{ width: 24, height: 24 }} strokeWidth="4" />
      <span style={{ color: 'var(--text-color-secondary)', fontSize: '0.9rem' }}>{message}</span>
    </div>
  )
}

export default LoadingSpinner
