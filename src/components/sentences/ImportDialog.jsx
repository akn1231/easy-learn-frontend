import { useState, useRef, useCallback } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { Checkbox } from 'primereact/checkbox'
import { useImportSentences } from '@/hooks/useSentences'
import { parseImportCSV, downloadSampleCSV } from '@/utils/csvImport'

const COLUMN_STYLE = { padding: '0.5rem 0.75rem', fontSize: '0.8125rem', borderBottom: '1px solid var(--surface-border)', verticalAlign: 'top' }
const HEADER_STYLE = { ...COLUMN_STYLE, fontWeight: 600, background: 'var(--surface-ground)', color: 'var(--text-color-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }

const truncate = (str, n = 32) => str.length > n ? str.slice(0, n) + '…' : str

const ImportDialog = ({ open, onClose }) => {
  const [rows, setRows] = useState([])
  const [selectedRowNums, setSelectedRowNums] = useState(new Set())
  const [step, setStep] = useState('idle')
  const [importedCount, setImportedCount] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const importMutation = useImportSentences()

  const validRows = rows.filter((r) => r.valid)
  const invalidRows = rows.filter((r) => !r.valid)
  const selectedValidRows = validRows.filter((r) => selectedRowNums.has(r.rowNum))
  const allValidSelected = validRows.length > 0 && selectedValidRows.length === validRows.length
  const someValidSelected = selectedValidRows.length > 0 && !allValidSelected

  const toggleRow = useCallback((rowNum) => {
    setSelectedRowNums((prev) => {
      const next = new Set(prev)
      next.has(rowNum) ? next.delete(rowNum) : next.add(rowNum)
      return next
    })
  }, [])

  const toggleAllValid = useCallback(() => {
    setSelectedRowNums(allValidSelected
      ? (prev) => { const next = new Set(prev); validRows.forEach((r) => next.delete(r.rowNum)); return next }
      : (prev) => { const next = new Set(prev); validRows.forEach((r) => next.add(r.rowNum)); return next }
    )
  }, [allValidSelected, validRows])

  const processFile = useCallback((file) => {
    if (!file || !file.name.endsWith('.csv')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const parsed = parseImportCSV(e.target.result)
      setRows(parsed)
      setSelectedRowNums(new Set(parsed.filter((r) => r.valid).map((r) => r.rowNum)))
      setStep('preview')
    }
    reader.readAsText(file)
  }, [])

  const handleFileChange = (e) => processFile(e.target.files[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    processFile(e.dataTransfer.files[0])
  }

  const handleImport = async () => {
    const payload = selectedValidRows.map(({ en, bn, others, category, tags, additionalInfo }) => ({
      en, bn, others, category, tags, additionalInfo,
    }))
    const result = await importMutation.mutateAsync(payload)
    setImportedCount(result?.data?.imported ?? validRows.length)
    setStep('done')
  }

  const handleClose = () => {
    setRows([])
    setSelectedRowNums(new Set())
    setStep('idle')
    setImportedCount(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
    onClose()
  }

  const footer = (
    <div className="import-dialog-footer">
      {step === 'preview' && (
        <>
          <Button label="Back" icon="pi pi-arrow-left" outlined severity="secondary" onClick={() => { setRows([]); setSelectedRowNums(new Set()); setStep('idle') }} disabled={importMutation.isPending} />
          <Button
            label={selectedValidRows.length === 0 ? 'None selected' : `Import ${selectedValidRows.length} ${selectedValidRows.length === 1 ? 'record' : 'records'}`}
            icon={importMutation.isPending ? 'pi pi-spin pi-spinner' : 'pi pi-upload'}
            onClick={handleImport}
            disabled={selectedValidRows.length === 0 || importMutation.isPending}
          />
        </>
      )}
      {(step === 'idle' || step === 'done') && (
        <Button label={step === 'done' ? 'Close' : 'Cancel'} outlined severity="secondary" onClick={handleClose} />
      )}
    </div>
  )

  return (
    <Dialog
      visible={open}
      onHide={handleClose}
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <i className="pi pi-file-import" style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }} />
          <span>Import Sentences</span>
        </div>
      }
      style={{ width: '680px', maxWidth: '95vw' }}
      footer={footer}
    >
      {/* ── Idle: upload step ── */}
      {step === 'idle' && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.375rem' }}>Step 1 — Download the sample CSV</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-color-secondary)', marginBottom: '0.75rem' }}>
              Fill in your sentences using the required columns, then upload below.
            </div>
            <Button
              label="Download Sample CSV"
              icon="pi pi-download"
              outlined
              size="small"
              onClick={downloadSampleCSV}
            />
          </div>

          <div style={{ fontWeight: 600, marginBottom: '0.375rem' }}>Step 2 — Upload your filled CSV</div>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? 'var(--primary-color)' : 'var(--surface-border)'}`,
              borderRadius: 10,
              padding: 'clamp(1rem, 4vw, 2rem)',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragging ? 'var(--primary-50)' : 'var(--surface-ground)',
              transition: 'all 0.15s',
            }}
          >
            <i className="pi pi-cloud-upload" style={{ fontSize: '2rem', color: 'var(--text-color-secondary)', marginBottom: '0.75rem', display: 'block' }} />
            <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Drop your CSV file here</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-color-secondary)' }}>or click to browse — .csv files only</div>
          </div>
          <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileChange} />

          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--surface-ground)', borderRadius: 8, fontSize: '0.8125rem', color: 'var(--text-color-secondary)', lineHeight: 1.7, wordBreak: 'break-word' }}>
            <strong style={{ color: 'var(--text-color)' }}>Required:</strong> english, bangla, category<br />
            <strong style={{ color: 'var(--text-color)' }}>Optional:</strong> other_languages, tags, additional_info<br />
            <strong style={{ color: 'var(--text-color)' }}>other_languages:</strong> <code style={{ fontSize: '0.8rem' }}>hi:text | fr:text</code><br />
            <strong style={{ color: 'var(--text-color)' }}>tags:</strong> comma-separated
          </div>
        </div>
      )}

      {/* ── Preview: validate + review ── */}
      {step === 'preview' && (
        <div>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <Tag value={`${rows.length} total`} severity="secondary" />
            <Tag value={`${selectedValidRows.length} / ${validRows.length} selected`} severity="success" />
            {invalidRows.length > 0 && <Tag value={`${invalidRows.length} with errors`} severity="danger" />}
          </div>

          {rows.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color-secondary)' }}>
              No data rows found in the file.
            </div>
          ) : (
            <div className="import-preview-wrapper">
              <table className="import-preview-table">
                <thead>
                  <tr>
                    <th style={{ ...HEADER_STYLE, width: 40, textAlign: 'center' }}>
                      <Checkbox checked={allValidSelected} indeterminate={someValidSelected} onChange={toggleAllValid} disabled={validRows.length === 0} />
                    </th>
                    <th style={{ ...HEADER_STYLE, width: 36 }}>#</th>
                    <th style={HEADER_STYLE}>English</th>
                    <th style={HEADER_STYLE}>Bangla</th>
                    <th style={HEADER_STYLE}>Category</th>
                    <th style={{ ...HEADER_STYLE, width: 100 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.rowNum} style={{ background: row.valid ? undefined : 'var(--red-50)', opacity: row.valid && !selectedRowNums.has(row.rowNum) ? 0.45 : 1, transition: 'opacity 0.15s' }}>
                      <td data-label="" style={{ ...COLUMN_STYLE, textAlign: 'center' }}>
                        <Checkbox checked={row.valid && selectedRowNums.has(row.rowNum)} onChange={() => row.valid && toggleRow(row.rowNum)} disabled={!row.valid} />
                      </td>
                      <td data-label="Row" style={{ ...COLUMN_STYLE, color: 'var(--text-color-secondary)', textAlign: 'center' }}>{row.rowNum}</td>
                      <td data-label="English" style={COLUMN_STYLE}>{truncate(row.en || '—')}</td>
                      <td data-label="Bangla" style={COLUMN_STYLE}>{truncate(row.bn || '—')}</td>
                      <td data-label="Category" style={COLUMN_STYLE}>{row.category || '—'}</td>
                      <td data-label="Status" style={COLUMN_STYLE}>
                        {row.valid ? (
                          <Tag value="Valid" severity="success" style={{ fontSize: '0.7rem' }} />
                        ) : (
                          <div>
                            <Tag value="Error" severity="danger" style={{ fontSize: '0.7rem', marginBottom: '0.25rem' }} />
                            {row.errors.map((e, i) => (
                              <div key={i} style={{ fontSize: '0.7rem', color: 'var(--red-600)', marginTop: '0.15rem' }}>{e}</div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {invalidRows.length > 0 && validRows.length > 0 && (
            <div style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-color-secondary)' }}>
              Only valid rows will be imported. Fix the CSV and re-upload to import all rows.
            </div>
          )}
        </div>
      )}

      {/* ── Done ── */}
      {step === 'done' && (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>
            <i className="pi pi-check-circle" style={{ color: 'var(--green-500)' }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.375rem' }}>
            Import complete
          </div>
          <div style={{ color: 'var(--text-color-secondary)' }}>
            {importedCount} {importedCount === 1 ? 'sentence' : 'sentences'} imported and approved successfully.
          </div>
        </div>
      )}
    </Dialog>
  )
}

export default ImportDialog
