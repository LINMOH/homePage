import { ref, computed } from 'vue'
import zhCN from './zh-CN'
import enUS from './en-US'
import jaJP from './ja-JP'

export const languages = [
  { code: 'zh', name: '简体中文', flag: '/flags/china.png', shortCode: 'ZH' },
  { code: 'en', name: 'English', flag: '/flags/usa.png', shortCode: 'EN' },
  { code: 'jp', name: '日本語', flag: '/flags/japan.png', shortCode: 'JP' }
]

const messages = {
  'zh': zhCN,
  'en': enUS,
  'jp': jaJP
}

const currentLanguage = ref(localStorage.getItem('language') || 'en')

export { currentLanguage }

export const setLanguage = (lang) => {
  if (messages[lang]) {
    currentLanguage.value = lang
    localStorage.setItem('language', lang)
  }
}

export const getCurrentLanguage = () => currentLanguage.value

export const t = (path) => {
  const keys = path.split('.')
  let result = messages[currentLanguage.value]

  for (const key of keys) {
    if (result && typeof result === 'object') {
      result = result[key]
    } else {
      return path
    }
  }

  return result || path
}

export const currentLanguageInfo = computed(() => {
  return languages.find(lang => lang.code === currentLanguage.value) || languages[0]
})

export const getPublicPath = (path) => {
  return path
}

export function useLocaleContent() {
  const content = computed(() => {
    const lang = currentLanguage.value
    if (lang === 'zh') return zhCN
    if (lang === 'jp') return jaJP
    return enUS
  })

  return { content, currentLanguage }
}