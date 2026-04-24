/**
 * Transform sentence objects to flat rows suitable for CSV export
 */
export const sentencesToCsvRows = (sentences = []) => {
  return sentences.map((s) => ({
    id: s._id || s.id || '',
    english: s.sentences?.en || '',
    bangla: s.sentences?.bn || '',
    other_languages: (s.sentences?.others || [])
      .map((o) => `${o.lang}:${o.text}`)
      .join(' | '),
    category: s.category || '',
    tags: (s.tags || []).join(', '),
    additional_info: s.additionalInfo || '',
    created_by: s.createdBy || '',
    created_at: s.createdAt || '',
  }))
}

export const CSV_HEADERS = [
  { label: 'ID', key: 'id' },
  { label: 'English', key: 'english' },
  { label: 'Bangla', key: 'bangla' },
  { label: 'Other Languages', key: 'other_languages' },
  { label: 'Category', key: 'category' },
  { label: 'Tags', key: 'tags' },
  { label: 'Additional Info', key: 'additional_info' },
  { label: 'Created By', key: 'created_by' },
  { label: 'Created At', key: 'created_at' },
]
