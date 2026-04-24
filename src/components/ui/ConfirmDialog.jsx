import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  severity = 'danger',
}) => (
  <Dialog
    visible={open}
    onHide={onClose}
    header={
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <i className="pi pi-exclamation-triangle" style={{ color: severity === 'danger' ? 'var(--red-500)' : 'var(--orange-500)', fontSize: '1.25rem' }} />
        <span>{title}</span>
      </div>
    }
    style={{ width: '22rem' }}
    footer={
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <Button label={cancelLabel} outlined severity="secondary" onClick={onClose} disabled={isLoading} />
        <Button
          label={confirmLabel}
          severity={severity}
          onClick={onConfirm}
          disabled={isLoading}
          icon={isLoading ? 'pi pi-spin pi-spinner' : undefined}
        />
      </div>
    }
  >
    <p style={{ color: 'var(--text-color-secondary)', lineHeight: 1.6 }}>{description}</p>
  </Dialog>
)

export default ConfirmDialog
