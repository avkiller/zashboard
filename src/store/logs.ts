import { useStorage } from '@/composables/use-storage'
import { stripAnsi } from '@/helper/ansi'
import { ref } from 'vue'

export const logFilter = ref('')
export const logTypeFilter = ref('')
export const logFilterRegex = useStorage<string>('config/log-filter-regex', '')
export const logFilterEnabled = useStorage<boolean>('config/log-filter-enabled', false)

// sing-box 日志以连接 id 开头,如 [3829292130 5ms] router: match[0]
export const getLogConnectionID = (payload: string) => {
  // return stripAnsi(payload).match(/^\[(\d+)\s[^\]]*\]/)?.[1] ?? null
  const clean = stripAnsi(payload)
  // 1. 匹配带 uptime 前缀的格式，如 INFO[196096] [2866031011 0ms]
  const matchWithUptime = clean.match(/(?:[A-Z]+)?\[\d+\]\s+\[(\d+)(?:\s+[^\]]+)?\]/)
  if (matchWithUptime) {
    return matchWithUptime[1]
  }

  // 2. 匹配直接以连接ID开头的格式，如 [1417998225 0ms] 或 [1417998225]
  const matchDirect = clean.match(/^\[(\d+)(?:\s+\d+(?:ms|µs|s))?\]/)
  if (matchDirect) {
    return matchDirect[1]
  }

  // 3. 通用兜底：匹配字符串中任意形如 [大数字 耗时] 的模式
  const fallback = clean.match(/\[(\d{8,})(?:\s+\d+(?:ms|µs|s))?\]/)
  return fallback ? fallback[1] : null
}
