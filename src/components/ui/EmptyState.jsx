import { Button } from 'primereact/button'

const EmptyState = ({
  title = 'No results found',
  description = 'Try adjusting your search or filters.',
  action,
  actionLabel = 'Add Sentence',
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 1rem', gap: '1rem', textAlign: 'center' }}>
    <i className="pi pi-search" style={{ fontSize: '4rem', color: 'var(--text-color-secondary)', opacity: 0.4 }} />
    <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-color-secondary)' }}>{title}</p>
    <p style={{ fontSize: '0.875rem', color: 'var(--text-color-secondary)', maxWidth: 360, opacity: 0.7 }}>{description}</p>
    {action && (
      <Button label={actionLabel} icon="pi pi-plus" onClick={action} style={{ marginTop: '0.5rem' }} />
    )}
  </div>
)

export default EmptyState
