import { memo, useState } from 'react'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { Checkbox } from 'primereact/checkbox'
import { Divider } from 'primereact/divider'
import { Dialog } from 'primereact/dialog'
import { DISPLAY_MODES, LANGUAGES } from '@/constants'
import { formatDate } from '@/utils'
import useAuthStore from '@/store/authStore'

const SentenceListItem = ({ sentence, displayMode, onEdit, onDelete, onApprove, selected, onSelect }) => {
  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const { user } = useAuthStore()

  const createdById = (sentence.createdBy?._id || sentence.createdBy)?.toString()
  const canEdit = !!user && (user.role === 'admin' || user.id?.toString() === createdById)
  const isAdmin = user?.role === 'admin'
  const showCheckbox = !!onSelect
  const showEn = displayMode !== DISPLAY_MODES.BANGLA
  const showBn = displayMode !== DISPLAY_MODES.ENGLISH

  return (
    <>
      <div className={`sentence-item${selected ? ' selected' : ''}`}>
        {/* ── Row ── */}
        <div className="item-row" onClick={() => setOpen((v) => !v)}>
          {showCheckbox && (
            <Checkbox
              checked={selected}
              onChange={(e) => { e.originalEvent.stopPropagation(); onSelect(sentence._id) }}
              onClick={(e) => e.stopPropagation()}
            />
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            {showEn && (
              <div style={{ fontWeight: 600, lineHeight: 1.55, color: 'var(--text-color)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {sentence.sentences?.en}
              </div>
            )}
            {showBn && (
              <div style={{ marginTop: showEn ? '0.25rem' : 0, fontFamily: '"Noto Sans Bengali", sans-serif', fontSize: '0.97rem', lineHeight: 1.75, color: showEn ? 'var(--text-color-secondary)' : 'var(--text-color)', fontWeight: showEn ? 400 : 600, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {sentence.sentences?.bn}
              </div>
            )}
          </div>

          {!sentence.isApproved && canEdit && (
            <Tag value="Pending" severity="warning" style={{ flexShrink: 0, borderRadius: 6 }} />
          )}

          {!canEdit && (
            <Button
              icon="pi pi-eye"
              label="View"
              size="small"
              text
              onClick={(e) => { e.stopPropagation(); setViewOpen(true) }}
            />
          )}

          <i className="pi pi-chevron-down" style={{ flexShrink: 0, color: open ? 'var(--primary-color)' : 'var(--text-color-secondary)', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', fontSize: '0.85rem' }} />
        </div>

        {/* ── Detail panel ── */}
        <div className="detail-panel" style={{ maxHeight: open ? '600px' : 0 }}>
          <div style={{ padding: '1rem 1.25rem', background: 'var(--surface-ground)' }}>
            <DetailFields sentence={sentence} isAdmin={isAdmin} />

            {(canEdit || isAdmin) && (
              <>
                <Divider style={{ margin: '1rem 0 0.75rem' }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {isAdmin && onApprove && (
                    <Button
                      label={sentence.isApproved ? 'Unapprove' : 'Approve'}
                      icon={sentence.isApproved ? 'pi pi-ban' : 'pi pi-check-circle'}
                      size="small"
                      severity={sentence.isApproved ? 'warning' : 'success'}
                      outlined
                      onClick={(e) => { e.stopPropagation(); onApprove(sentence) }}
                    />
                  )}
                  {canEdit && (
                    <Button
                      label="Edit"
                      icon="pi pi-pencil"
                      size="small"
                      outlined
                      onClick={(e) => { e.stopPropagation(); onEdit(sentence) }}
                    />
                  )}
                  {canEdit && (
                    <Button
                      label="Delete"
                      icon="pi pi-trash"
                      size="small"
                      severity="danger"
                      outlined
                      onClick={(e) => { e.stopPropagation(); onDelete(sentence) }}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── View dialog (non-editors) ── */}
      <Dialog
        visible={viewOpen}
        onHide={() => setViewOpen(false)}
        header="Sentence Details"
        maximizable
        style={{ width: 'min(680px, 95vw)' }}
        contentStyle={{ paddingTop: '1.25rem' }}
      >
        {/* English + Bangla — side by side on large screens */}
        <div className="grid" style={{ margin: 0, marginBottom: '1rem' }}>
          <div className="col-12 md:col-6" style={{ padding: '0 0.75rem 0 0' }}>
            <div style={sectionLabel}><i className="pi pi-flag" style={labelIcon} /> English</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.6, color: 'var(--text-color)' }}>
              {sentence.sentences?.en}
            </div>
          </div>
          <div className="col-12 md:col-6" style={{ padding: '0 0 0 0.75rem', borderLeft: '1px solid var(--surface-border)' }}>
            <div style={sectionLabel}><i className="pi pi-flag" style={labelIcon} /> বাংলা</div>
            <div style={{ fontSize: '1.05rem', fontFamily: '"Noto Sans Bengali", sans-serif', lineHeight: 1.8, color: 'var(--text-color)' }}>
              {sentence.sentences?.bn}
            </div>
          </div>
        </div>

        {/* Other languages */}
        {sentence.sentences?.others?.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={sectionLabel}><i className="pi pi-globe" style={labelIcon} /> Other Languages</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {sentence.sentences.others.map((o) => (
                <div key={o.lang} style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--primary-color)', marginRight: '0.4rem' }}>{LANGUAGES[o.lang] || o.lang}:</span>
                  {o.text}
                </div>
              ))}
            </div>
          </div>
        )}

        <Divider style={{ margin: '0.75rem 0' }} />

        {/* Meta */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          <DetailField icon="pi pi-list" label="Category">
            {sentence.category ? <Tag value={sentence.category} severity="info" /> : <Nil />}
          </DetailField>

          <DetailField icon="pi pi-tag" label="Tags">
            {sentence.tags?.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {sentence.tags.map((tag) => <Tag key={tag} value={`#${tag}`} />)}
              </div>
            ) : <Nil />}
          </DetailField>

          <DetailField icon="pi pi-calendar" label="Added">
            <span style={{ fontSize: '0.875rem', color: 'var(--text-color-secondary)' }}>{formatDate(sentence.createdAt)}</span>
          </DetailField>

          {sentence.additionalInfo && (
            <DetailField icon="pi pi-info-circle" label="Additional Info" fullWidth>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-color-secondary)', fontStyle: 'italic', lineHeight: 1.6 }}>{sentence.additionalInfo}</span>
            </DetailField>
          )}
        </div>
      </Dialog>
    </>
  )
}

const DetailFields = ({ sentence, isAdmin }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
    <DetailField icon="pi pi-list" label="Category">
      {sentence.category ? <Tag value={sentence.category} severity="info" /> : <Nil />}
    </DetailField>

    <DetailField icon="pi pi-tag" label="Tags">
      {sentence.tags?.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
          {sentence.tags.map((tag) => <Tag key={tag} value={`#${tag}`} />)}
        </div>
      ) : <Nil />}
    </DetailField>

    <DetailField icon="pi pi-calendar" label="Added">
      <span style={{ fontSize: '0.875rem', color: 'var(--text-color-secondary)' }}>{formatDate(sentence.createdAt)}</span>
    </DetailField>

    {isAdmin && (
      <DetailField icon="pi pi-user" label="Added By">
        <span style={{ fontSize: '0.875rem', color: 'var(--text-color-secondary)' }}>
          {sentence.createdBy?.name || sentence.createdBy?.email || '—'}
        </span>
      </DetailField>
    )}

    {sentence.additionalInfo && (
      <DetailField icon="pi pi-info-circle" label="Additional Info" fullWidth>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-color-secondary)', fontStyle: 'italic', lineHeight: 1.6 }}>{sentence.additionalInfo}</span>
      </DetailField>
    )}

    {sentence.sentences?.others?.length > 0 && (
      <DetailField icon="pi pi-globe" label="Other Languages" fullWidth>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {sentence.sentences.others.map((o) => (
            <span key={o.lang} style={{ fontSize: '0.875rem', color: 'var(--text-color-secondary)' }}>
              <strong>{LANGUAGES[o.lang] || o.lang}:</strong> {o.text}
            </span>
          ))}
        </div>
      </DetailField>
    )}
  </div>
)

const DetailField = ({ icon, label, children, fullWidth = false }) => (
  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', ...(fullWidth && { gridColumn: '1 / -1' }) }}>
    <i className={icon} style={{ marginTop: '0.15rem', flexShrink: 0, color: 'var(--text-color-secondary)', fontSize: '0.8rem' }} />
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-color-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '0.25rem' }}>{label}</div>
      {children}
    </div>
  </div>
)

const Nil = () => <span style={{ fontSize: '0.875rem', color: 'var(--text-color-secondary)', opacity: 0.5 }}>—</span>

const sectionLabel = { fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-color-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }
const labelIcon = { fontSize: '0.7rem' }

export default memo(SentenceListItem)
