import ms from 'ms'
import { Configs } from './utils'

export const msToString = (time: number | unknown): string => {
  if (!time) return ''
  const str = ms(time as number, { long: true })
  if (!Configs.isJa()) return `${str} ago`
  return (
    str
      .replace('days', '日')
      .replace('day', '日')
      .replace('minutes', '分')
      .replace('minute', '分')
      .replace('hours', '時間')
      .replace('hour', '時間')
      .replace('seconds', '秒') + '前'
  )
}

export const getDNSPrefetchValue = (domain: string | undefined): string | null => {
  if (!domain) return null
  if (domain.startsWith('http')) return domain.replace(/https?:/, '')
  if (domain.startsWith('//')) return domain
  return `//${domain}`
}
