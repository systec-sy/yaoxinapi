/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { type TFunction } from 'i18next'
import type { Modality, TokenUnit } from './types'

// ----------------------------------------------------------------------------
// Pricing Constants
// ----------------------------------------------------------------------------

/** Sort options for pricing models */
export const SORT_OPTIONS = {
  NAME: 'name',
  PRICE_LOW: 'price-low',
  PRICE_HIGH: 'price-high',
} as const

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS]

export function getSortLabels(t: TFunction): Record<SortOption, string> {
  return {
    [SORT_OPTIONS.NAME]: t('Name'),
    [SORT_OPTIONS.PRICE_LOW]: t('Price: Low to High'),
    [SORT_OPTIONS.PRICE_HIGH]: t('Price: High to Low'),
  }
}

/** Filter values */
export const FILTER_ALL = 'all'

/** Quota type options */
export const QUOTA_TYPES = {
  ALL: 'all',
  TOKEN: 'token',
  REQUEST: 'request',
} as const

export type QuotaTypeOption = (typeof QUOTA_TYPES)[keyof typeof QUOTA_TYPES]

/** Quota type labels */
export function getQuotaTypeLabels(
  t: TFunction
): Record<QuotaTypeOption, string> {
  return {
    [QUOTA_TYPES.ALL]: t('All Models'),
    [QUOTA_TYPES.TOKEN]: t('Token-based'),
    [QUOTA_TYPES.REQUEST]: t('Per Request'),
  }
}

/** Endpoint type options */
export const ENDPOINT_TYPES = {
  ALL: 'all',
  OPENAI: 'openai',
  OPENAI_RESPONSE: 'openai-response',
  ANTHROPIC: 'anthropic',
  GEMINI: 'gemini',
  JINA_RERANK: 'jina-rerank',
  IMAGE_GENERATION: 'image-generation',
  EMBEDDINGS: 'embeddings',
  OPENAI_VIDEO: 'openai-video',
} as const

export type EndpointTypeOption =
  (typeof ENDPOINT_TYPES)[keyof typeof ENDPOINT_TYPES]

/** Endpoint type labels */
export function getEndpointTypeLabels(
  t: TFunction
): Record<EndpointTypeOption, string> {
  return {
    [ENDPOINT_TYPES.ALL]: t('All Types'),
    [ENDPOINT_TYPES.OPENAI]: 'Chat',
    [ENDPOINT_TYPES.OPENAI_RESPONSE]: 'Response',
    [ENDPOINT_TYPES.ANTHROPIC]: 'Anthropic',
    [ENDPOINT_TYPES.GEMINI]: 'Gemini',
    [ENDPOINT_TYPES.JINA_RERANK]: 'Rerank',
    [ENDPOINT_TYPES.IMAGE_GENERATION]: t('Image'),
    [ENDPOINT_TYPES.EMBEDDINGS]: t('Embeddings'),
    [ENDPOINT_TYPES.OPENAI_VIDEO]: t('Video'),
  }
}

/** Filter section keys */
export const FILTER_SECTIONS = {
  PRICING_TYPE: 'pricingType',
  ENDPOINT_TYPE: 'endpointType',
  VENDOR: 'vendor',
  GROUP: 'group',
  TAG: 'tag',
} as const

/** Maximum number of tags to display in model row */
export const MAX_TAGS_DISPLAY = 5

/** Maximum number of filter items to display before showing "More..." */
export const MAX_FILTER_ITEMS = 5

/** Sidebar width */
export const SIDEBAR_WIDTH = 'w-64'

/** Excluded groups */
export const EXCLUDED_GROUPS = ['', 'auto']

/** Quota type values */
export const QUOTA_TYPE_VALUES = {
  TOKEN: 0,
  REQUEST: 1,
} as const

/** Token unit divisors */
export const TOKEN_UNIT_DIVISORS = {
  M: 1,
  K: 1000,
} as const

/** Default token unit for pricing display */
export const DEFAULT_TOKEN_UNIT: TokenUnit = 'M'

/** View mode options */
export const VIEW_MODES = {
  CARD: 'card',
  TABLE: 'table',
} as const

export type ViewMode = (typeof VIEW_MODES)[keyof typeof VIEW_MODES]

/** Default page size for pricing table */
export const DEFAULT_PRICING_PAGE_SIZE = 20

/** Minimum context (tokens) filters — uses inferred context_length */
export const CONTEXT_MIN_FILTERS = {
  ALL: 'all',
  CTX_4K: '4k',
  CTX_8K: '8k',
  CTX_32K: '32k',
  CTX_64K: '64k',
  CTX_128K: '128k',
  CTX_200K: '200k',
  CTX_1M: '1m',
} as const

export type ContextMinFilterKey =
  (typeof CONTEXT_MIN_FILTERS)[keyof typeof CONTEXT_MIN_FILTERS]

export const CONTEXT_MIN_TOKEN_BY_KEY: Record<
  Exclude<ContextMinFilterKey, typeof CONTEXT_MIN_FILTERS.ALL>,
  number
> = {
  [CONTEXT_MIN_FILTERS.CTX_4K]: 4_000,
  [CONTEXT_MIN_FILTERS.CTX_8K]: 8_000,
  [CONTEXT_MIN_FILTERS.CTX_32K]: 32_000,
  [CONTEXT_MIN_FILTERS.CTX_64K]: 64_000,
  [CONTEXT_MIN_FILTERS.CTX_128K]: 128_000,
  [CONTEXT_MIN_FILTERS.CTX_200K]: 200_000,
  [CONTEXT_MIN_FILTERS.CTX_1M]: 1_000_000,
}

export const CONTEXT_MIN_FILTER_ORDER: ContextMinFilterKey[] = [
  CONTEXT_MIN_FILTERS.ALL,
  CONTEXT_MIN_FILTERS.CTX_4K,
  CONTEXT_MIN_FILTERS.CTX_8K,
  CONTEXT_MIN_FILTERS.CTX_32K,
  CONTEXT_MIN_FILTERS.CTX_64K,
  CONTEXT_MIN_FILTERS.CTX_128K,
  CONTEXT_MIN_FILTERS.CTX_200K,
  CONTEXT_MIN_FILTERS.CTX_1M,
]

/** Modalities in plaza sidebar filter (order preserved) */
export const FILTER_MODALITIES: readonly Modality[] = [
  'text',
  'image',
  'audio',
  'video',
  'file',
] as const

export function getContextMinLabels(
  t: TFunction
): Record<ContextMinFilterKey, string> {
  return {
    [CONTEXT_MIN_FILTERS.ALL]: t('Any context'),
    [CONTEXT_MIN_FILTERS.CTX_4K]: t('≥ 4K context'),
    [CONTEXT_MIN_FILTERS.CTX_8K]: t('≥ 8K context'),
    [CONTEXT_MIN_FILTERS.CTX_32K]: t('≥ 32K context'),
    [CONTEXT_MIN_FILTERS.CTX_64K]: t('≥ 64K context'),
    [CONTEXT_MIN_FILTERS.CTX_128K]: t('≥ 128K context'),
    [CONTEXT_MIN_FILTERS.CTX_200K]: t('≥ 200K context'),
    [CONTEXT_MIN_FILTERS.CTX_1M]: t('≥ 1M context'),
  }
}

export function getModalityFilterLabel(
  t: TFunction,
  modality: Modality
): string {
  const map: Record<Modality, string> = {
    text: t('Text'),
    image: t('Image'),
    audio: t('Audio'),
    video: t('Video'),
    file: t('File'),
  }
  return map[modality]
}
