import { ref, computed } from 'vue'
import zhCN from './zh-CN'
import enUS from './en-US'
import jaJP from './ja-JP'

// 支持的语言列表
export const languages = [
  { code: 'zh', name: '简体中文', flag: '/flags/china.png', shortCode: 'ZH' },
  { code: 'en', name: 'English', flag: '/flags/usa.png', shortCode: 'EN' },
  { code: 'jp', name: '日本語', flag: '/flags/japan.png', shortCode: 'JP' }
]

// 语言映射
const messages = {
  'zh': zhCN,
  'en': enUS,
  'jp': jaJP
}

// 当前语言
const currentLanguage = ref(localStorage.getItem('language') || 'en')

// 导出 currentLanguage
export { currentLanguage }

// 切换语言
export const setLanguage = (lang) => {
  if (messages[lang]) {
    currentLanguage.value = lang
    localStorage.setItem('language', lang)
  }
}

// 获取当前语言
export const getCurrentLanguage = () => currentLanguage.value

// 翻译函数
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

// 当前语言信息
export const currentLanguageInfo = computed(() => {
  return languages.find(lang => lang.code === currentLanguage.value) || languages[0]
})

// 获取 public 目录路径
export const getPublicPath = (path) => {
  // public 目录中的资源不需要语言前缀
  return path
}
