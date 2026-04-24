import { useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import TagInput from '@/components/ui/TagInput'
import { CATEGORIES, LANGUAGE_OPTIONS } from '@/constants'
import useAuthStore from '@/store/authStore'

const schema = yup.object({
  sentences: yup.object({
    en: yup.string().trim().min(2, 'At least 2 characters').required('English sentence is required'),
    bn: yup.string().trim().min(1, 'Required').required('Bangla sentence is required'),
    others: yup.array().of(yup.object({
      lang: yup.string().required('Select a language'),
      text: yup.string().trim().required('Translation required'),
    })),
  }),
  category: yup.string().required('Category is required').oneOf(CATEGORIES, 'Select a valid category'),
  tags: yup.array().of(yup.string()),
  additionalInfo: yup.string().optional(),
})

const DEFAULT_VALUES = { sentences: { en: '', bn: '', others: [] }, category: '', tags: [], additionalInfo: '' }

const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ label: c, value: c }))

const OTHER_LANG_OPTIONS = LANGUAGE_OPTIONS.filter((o) => o.value !== 'en' && o.value !== 'bn')

const SentenceForm = ({ open, onClose, onSubmit, initialData, isSubmitting }) => {
  const { user } = useAuthStore()
  const isEditing = !!initialData

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: DEFAULT_VALUES,
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'sentences.others' })

  useEffect(() => {
    if (open) {
      reset(initialData ? {
        sentences: { en: initialData.sentences?.en || '', bn: initialData.sentences?.bn || '', others: initialData.sentences?.others || [] },
        category: initialData.category || '',
        tags: initialData.tags || [],
        additionalInfo: initialData.additionalInfo || '',
      } : DEFAULT_VALUES)
    }
  }, [open, initialData, reset])

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, sentences: { ...data.sentences, en: data.sentences.en.trim(), bn: data.sentences.bn.trim() }, createdBy: isEditing ? initialData.createdBy : user?.id })
  }

  const usedLangs = fields.map((f) => f.lang).filter(Boolean)
  const availableLangs = OTHER_LANG_OPTIONS.filter((o) => !usedLangs.includes(o.value))

  const footer = (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
      <Button label="Cancel" outlined severity="secondary" onClick={onClose} disabled={isSubmitting} />
      <Button
        type="submit"
        form="sentence-form"
        label={isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Sentence'}
        icon={isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
        disabled={isSubmitting}
      />
    </div>
  )

  return (
    <Dialog
      visible={open}
      onHide={onClose}
      header={isEditing ? 'Edit Sentence' : 'Add New Sentence'}
      footer={footer}
      style={{ width: 'min(700px, 95vw)', maxHeight: '90vh' }}
      contentStyle={{ overflowX: 'hidden', overflowY: 'auto' }}
    >
      <form id="sentence-form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        {/* English + Bangla */}
        <div className="grid" style={{ margin: 0 }}>
          <div className="col-12 md:col-6" style={{ paddingTop: 0 }}>
            <label style={labelStyle}>English Sentence *</label>
            <Controller
              name="sentences.en"
              control={control}
              render={({ field: f }) => (
                <InputTextarea {...f} rows={3} autoResize style={{ width: '100%' }} className={errors.sentences?.en ? 'p-invalid' : ''} placeholder="Enter English sentence…" />
              )}
            />
            {errors.sentences?.en && <small className="p-error">{errors.sentences.en.message}</small>}
          </div>
          <div className="col-12 md:col-6" style={{ paddingTop: 0 }}>
            <label style={labelStyle}>বাংলা বাক্য *</label>
            <Controller
              name="sentences.bn"
              control={control}
              render={({ field: f }) => (
                <InputTextarea {...f} rows={3} autoResize style={{ width: '100%', fontFamily: '"Noto Sans Bengali", sans-serif', fontSize: '1rem' }} className={errors.sentences?.bn ? 'p-invalid' : ''} placeholder="বাংলা বাক্য লিখুন…" />
              )}
            />
            {errors.sentences?.bn && <small className="p-error">{errors.sentences.bn.message}</small>}
          </div>
        </div>

        {/* Additional Languages */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-color-secondary)', fontWeight: 500 }}>Additional Languages (Optional)</span>
            <Button type="button" label="Add Language" icon="pi pi-plus" size="small" outlined disabled={availableLangs.length === 0} onClick={() => append({ lang: '', text: '' })} />
          </div>
          {fields.map((field, index) => (
            <div key={field.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem', border: '1px solid var(--surface-border)', borderRadius: 8, marginBottom: '0.5rem', background: 'var(--surface-ground)' }}>
              <Controller
                name={`sentences.others.${index}.lang`}
                control={control}
                render={({ field: f }) => (
                  <Dropdown
                    {...f}
                    options={OTHER_LANG_OPTIONS.filter((o) => !usedLangs.includes(o.value) || o.value === f.value)}
                    placeholder="Language"
                    style={{ minWidth: 130 }}
                    className={errors.sentences?.others?.[index]?.lang ? 'p-invalid' : ''}
                  />
                )}
              />
              <Controller
                name={`sentences.others.${index}.text`}
                control={control}
                render={({ field: f }) => (
                  <InputText {...f} placeholder="Translation" style={{ flex: 1 }} className={errors.sentences?.others?.[index]?.text ? 'p-invalid' : ''} />
                )}
              />
              <Button type="button" icon="pi pi-times" severity="danger" text rounded onClick={() => remove(index)} />
            </div>
          ))}
        </div>

        <Divider />

        {/* Category + Tags */}
        <div className="grid" style={{ margin: 0 }}>
          <div className="col-12 md:col-6" style={{ paddingTop: 0 }}>
            <label style={labelStyle}>Category *</label>
            <Controller
              name="category"
              control={control}
              render={({ field: f }) => (
                <Dropdown {...f} options={CATEGORY_OPTIONS} placeholder="Select category" style={{ width: '100%' }} className={errors.category ? 'p-invalid' : ''} />
              )}
            />
            {errors.category && <small className="p-error">{errors.category.message}</small>}
          </div>
          <div className="col-12 md:col-6" style={{ paddingTop: 0 }}>
            <Controller
              name="tags"
              control={control}
              render={({ field: f }) => <TagInput value={f.value} onChange={f.onChange} />}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div style={{ marginTop: '0.75rem' }}>
          <label style={labelStyle}>Additional Info</label>
          <Controller
            name="additionalInfo"
            control={control}
            render={({ field: f }) => (
              <InputTextarea {...f} rows={2} autoResize style={{ width: '100%' }} placeholder="Notes, context, usage examples…" />
            )}
          />
        </div>
      </form>
    </Dialog>
  )
}

const labelStyle = { display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-color)' }

export default SentenceForm
