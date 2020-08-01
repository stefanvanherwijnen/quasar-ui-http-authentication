import enUS from './en-us'
import nl from './nl'
import vi from './vi'

const languages = {
  'en-us': enUS,
  'nl': nl,
  'vi': vi
}

const loadLang = (lang?: string) => {
  lang = lang || 'en-us'
  if (Object.keys(languages).includes(lang)) {
    return languages[lang]
  } else {
    throw new Error('Language is not available')
  }
}

export type i18n = typeof enUS
export { loadLang }