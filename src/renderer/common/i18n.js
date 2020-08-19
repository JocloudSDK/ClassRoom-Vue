import zhCN from './i18n/zh'
import en from './i18n/en'

export const language = (lang = 'zh') => {
  return lang.match(/zh/) ? zhCN : en
}
