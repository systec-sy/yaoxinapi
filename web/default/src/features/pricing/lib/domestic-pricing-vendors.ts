import type { PricingModel } from '../types'

/**
 * Vendor names that map to “domestic” list pricing: show ¥ without multiplying
 * by the global USD→CNY display rate (numbers stay as returned by the pricing formula).
 *
 * Names must match `vendor_name` from `/api/pricing` (merged in usePricingData).
 */
export const DOMESTIC_PRICING_VENDOR_NAMES: readonly string[] = [
  '360',
  'MiniMax',
  'Moonshot',
  'Vidu',
  'DeepSeek',
  '快手',
  '即梦',
  '字节跳动',
  '腾讯',
  '智谱',
  '百度',
  '讯飞',
  '阿里巴巴',
  '零一万物',
  '百川',
  '百川智能',
  'Baichuan',
  '阶跃星辰',
  'StepFun',
  '华为',
  '华为云',
  'Huawei',
  '商汤',
  'SenseTime',
  '日日新',
  '昆仑万维',
  'Skywork',
  '天工',
  '面壁智能',
  '出门问问',
  'Mobvoi',
  '澜舟科技',
  'Langboat',
  '中国电信',
  'TeleChat',
  '星河',
  '中国联通',
  '鸿湖',
  '中国移动',
  '九天',
  '网易有道',
  '有道',
  '科大讯飞',
  '阿里云',
  '腾讯云',
]

const DOMESTIC_VENDOR_SET = new Set(DOMESTIC_PRICING_VENDOR_NAMES)

export function isDomesticPricingModel(model: PricingModel): boolean {
  const name = model.vendor_name?.trim()
  if (!name) return false
  return DOMESTIC_VENDOR_SET.has(name)
}
