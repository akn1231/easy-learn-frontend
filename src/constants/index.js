export const APP_NAME = 'EasyLearn'

export const DISPLAY_MODES = {
  BOTH: 'both',
  ENGLISH: 'en',
  BANGLA: 'bn',
}

export const DISPLAY_MODE_LABELS = {
  [DISPLAY_MODES.BOTH]: 'Both',
  [DISPLAY_MODES.ENGLISH]: 'English Only',
  [DISPLAY_MODES.BANGLA]: 'Bangla Only',
}

export const LANGUAGES = {
  en: 'English',
  bn: 'Bangla',
  hi: 'Hindi',
  ar: 'Arabic',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
}

export const LANGUAGE_OPTIONS = Object.entries(LANGUAGES).map(([code, label]) => ({
  value: code,
  label,
}))

export const CATEGORIES = [
  'Greeting',
  'Daily Conversation',
  'Business',
  'Education',
  'Travel',
  'Food',
  'Health',
  'Technology',
  'Sports',
  'Culture',
  'Religion',
  'Family',
  'Nature',
  'Emotion',
  'Other',
]

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
}

export const AUTH_TOKEN_KEY = 'easylearn_auth_token'
