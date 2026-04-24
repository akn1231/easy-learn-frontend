import { Button } from 'primereact/button'

const ErrorState = ({ title = 'Something went wrong', description, onRetry }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 1rem', gap: '1rem', textAlign: 'center' }}>
    <i className="pi pi-times-circle" style={{ fontSize: '4rem', color: 'var(--red-500)' }} />
    <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-color-secondary)' }}>{title}</p>
    {description && <p style={{ fontSize: '0.875rem', color: 'var(--text-color-secondary)', maxWidth: 400, opacity: 0.7 }}>{description}</p>}
    {onRetry && <Button label="Try Again" icon="pi pi-refresh" severity="danger" outlined onClick={onRetry} style={{ marginTop: '0.5rem' }} />}
  </div>
)

export default ErrorState
