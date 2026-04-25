import { CATEGORIES } from '@/constants'

export const IMPORT_CSV_HEADERS = 'english,bangla,other_languages,category,tags,additional_info'

export const SAMPLE_CSV_CONTENT = `english,bangla,other_languages,category,tags,additional_info
Hello how are you?,আপনি কেমন আছেন?,hi:आप कैसे हैं? | fr:Comment allez-vous?,Greeting,"greeting,informal",Common daily greeting
I am going to the market,আমি বাজারে যাচ্ছি,,Daily Conversation,daily,
Thank you very much,আপনাকে অনেক ধন্যবাদ,ar:شكرًا جزيلًا,Greeting,gratitude,Formal expression of thanks
`

export function downloadSampleCSV() {
  // BOM (﻿) tells Excel this is UTF-8, so Bangla/Arabic/etc. render correctly
  const blob = new Blob(['﻿', SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'easylearn-import-sample.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function tokenizeCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i <= text.length; i++) {
    const ch = i < text.length ? text[i] : null

    if (ch === null) {
      row.push(field)
      if (row.some((f) => f.trim())) rows.push(row)
      break
    }

    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        field += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        row.push(field)
        field = ''
      } else if (ch === '\n') {
        row.push(field)
        field = ''
        if (row.some((f) => f.trim())) rows.push(row)
        row = []
      } else {
        field += ch
      }
    }
  }

  return rows
}

export function parseImportCSV(text) {
  // Strip UTF-8 BOM if present (added by Excel when saving CSV)
  const stripped = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
  const normalized = stripped.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
  if (!normalized) return []

  const allRows = tokenizeCSV(normalized)
  if (allRows.length < 2) return []

  // Strip any remaining BOM from the very first header cell
  const headers = allRows[0].map((h) =>
    h.replace(/^﻿/, '').toLowerCase().trim().replace(/\s+/g, '_')
  )
  const dataRows = allRows.slice(1).filter((r) => r.some((f) => f.trim()))

  return dataRows.map((row, i) => {
    const get = (key) => {
      const idx = headers.indexOf(key)
      return idx === -1 ? '' : (row[idx] || '').trim()
    }

    const en = get('english')
    const bn = get('bangla')
    let category = get('category')
    const tagsRaw = get('tags')
    const additionalInfo = get('additional_info')
    const othersRaw = get('other_languages')

    const errors = []

    if (!en || en.length < 2) errors.push('English is required (min 2 chars)')
    if (!bn || bn.length < 1) errors.push('Bangla is required')
    if (!category || !CATEGORIES.includes(category)) category = 'Other'
    if (additionalInfo.length > 1000) errors.push('Additional info exceeds 1000 chars')

    const others = []
    if (othersRaw) {
      othersRaw
        .split('|')
        .map((p) => p.trim())
        .filter(Boolean)
        .forEach((part) => {
          const idx = part.indexOf(':')
          if (idx === -1) {
            errors.push(`Invalid other_languages format: "${part}" — use "lang:text"`)
          } else {
            const lang = part.substring(0, idx).trim().toLowerCase()
            const txt = part.substring(idx + 1).trim()
            if (!lang || !txt) errors.push(`Incomplete other_languages entry: "${part}"`)
            else others.push({ lang, text: txt })
          }
        })
    }

    const tags = tagsRaw
      ? tagsRaw
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
      : []

    return {
      rowNum: i + 2,
      en,
      bn,
      others,
      category,
      tags,
      additionalInfo,
      errors,
      valid: errors.length === 0,
    }
  })
}
