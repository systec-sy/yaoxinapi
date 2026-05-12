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
import {
  SORT_OPTIONS,
  FILTER_ALL,
  QUOTA_TYPES,
  QUOTA_TYPE_VALUES,
  ENDPOINT_TYPES,
  CONTEXT_MIN_FILTERS,
  CONTEXT_MIN_TOKEN_BY_KEY,
  FILTER_MODALITIES,
  type ContextMinFilterKey,
} from '../constants'
import { inferModelMetadata, type ModelMetadata } from './model-metadata'
import type { Modality, PricingModel } from '../types'

const modalitySet = new Set<string>(FILTER_MODALITIES)

// ----------------------------------------------------------------------------
// Filter Utilities
// ----------------------------------------------------------------------------

/**
 * Filter models by search query
 */
export function filterBySearch(
  models: PricingModel[],
  query: string
): PricingModel[] {
  if (!query) return models

  const lowerQuery = query.toLowerCase()
  return models.filter(
    (m) =>
      m.model_name?.toLowerCase().includes(lowerQuery) ||
      m.description?.toLowerCase().includes(lowerQuery) ||
      m.tags?.toLowerCase().includes(lowerQuery) ||
      m.vendor_name?.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Filter models by vendor
 */
export function filterByVendor(
  models: PricingModel[],
  vendor: string
): PricingModel[] {
  if (vendor === FILTER_ALL) return models
  return models.filter((m) => m.vendor_name === vendor)
}

/**
 * Filter models by group
 */
export function filterByGroup(
  models: PricingModel[],
  group: string
): PricingModel[] {
  if (group === FILTER_ALL) return models
  return models.filter((m) => m.enable_groups?.includes(group))
}

/**
 * Filter models by quota type
 */
export function filterByQuotaType(
  models: PricingModel[],
  quotaType: string
): PricingModel[] {
  if (quotaType === QUOTA_TYPES.ALL) return models
  const targetType =
    quotaType === QUOTA_TYPES.TOKEN
      ? QUOTA_TYPE_VALUES.TOKEN
      : QUOTA_TYPE_VALUES.REQUEST
  return models.filter((m) => m.quota_type === targetType)
}

/**
 * Filter models by endpoint type
 */
export function filterByEndpointType(
  models: PricingModel[],
  endpointType: string
): PricingModel[] {
  if (endpointType === ENDPOINT_TYPES.ALL) return models
  return models.filter((m) =>
    m.supported_endpoint_types?.includes(endpointType)
  )
}

/**
 * Get model price for sorting
 */
function getModelPrice(model: PricingModel): number {
  return model.quota_type === 0 ? model.model_ratio : model.model_price || 0
}

/**
 * Sort models by specified option
 */
export function sortModels(
  models: PricingModel[],
  sortBy: string
): PricingModel[] {
  const sorted = [...models]

  switch (sortBy) {
    case SORT_OPTIONS.NAME:
      sorted.sort((a, b) =>
        (a.model_name || '').localeCompare(b.model_name || '')
      )
      break
    case SORT_OPTIONS.PRICE_LOW:
      sorted.sort((a, b) => getModelPrice(a) - getModelPrice(b))
      break
    case SORT_OPTIONS.PRICE_HIGH:
      sorted.sort((a, b) => getModelPrice(b) - getModelPrice(a))
      break
  }

  return sorted
}

export function buildModelMetadataMap(
  models: PricingModel[]
): Map<string, ModelMetadata> {
  const map = new Map<string, ModelMetadata>()
  for (const m of models) {
    const name = m.model_name
    if (!name) continue
    map.set(name, inferModelMetadata(m))
  }
  return map
}

/** Parse comma-separated modalities from URL or state; only known Modality values kept */
export function parseModalitiesParam(value?: string | null): Modality[] {
  if (!value?.trim()) return []
  const out: Modality[] = []
  for (const raw of value.split(',')) {
    const key = raw.trim().toLowerCase()
    if (modalitySet.has(key)) {
      out.push(key as Modality)
    }
  }
  return [...new Set(out)].sort()
}

export function serializeModalitiesParam(
  modalities: Modality[]
): string | undefined {
  if (modalities.length === 0) return undefined
  return [...modalities].sort().join(',')
}

/**
 * Keep models whose input ∪ output modalities intersect selected (OR).
 */
export function filterByModalitiesOr(
  models: PricingModel[],
  metaByName: Map<string, ModelMetadata>,
  selected: Modality[]
): PricingModel[] {
  if (selected.length === 0) return models
  return models.filter((m) => {
    const meta = metaByName.get(m.model_name)
    if (!meta) return false
    const union = new Set<Modality>([
      ...meta.input_modalities,
      ...meta.output_modalities,
    ])
    return selected.some((s) => union.has(s))
  })
}

export function filterByContextMinTokens(
  models: PricingModel[],
  metaByName: Map<string, ModelMetadata>,
  minTokens: number
): PricingModel[] {
  if (minTokens <= 0) return models
  return models.filter((m) => {
    const len = metaByName.get(m.model_name)?.context_length ?? 0
    return len >= minTokens
  })
}

export type MetaFilterOptions = {
  metaByName: Map<string, ModelMetadata>
  modalities: Modality[]
  contextMinKey: ContextMinFilterKey
}

/**
 * Apply all filters and sorting to models
 */
export function filterAndSortModels(
  models: PricingModel[],
  filters: {
    search: string
    vendor: string
    group: string
    quotaType: string
    endpointType: string
    tag: string
    sortBy: string
  },
  metaFilters?: MetaFilterOptions
): PricingModel[] {
  let result = filterBySearch(models, filters.search)
  result = filterByVendor(result, filters.vendor)
  result = filterByGroup(result, filters.group)
  result = filterByQuotaType(result, filters.quotaType)
  result = filterByEndpointType(result, filters.endpointType)
  result = filterByTag(result, filters.tag)

  if (metaFilters) {
    if (metaFilters.modalities.length > 0) {
      result = filterByModalitiesOr(
        result,
        metaFilters.metaByName,
        metaFilters.modalities
      )
    }
    if (metaFilters.contextMinKey !== CONTEXT_MIN_FILTERS.ALL) {
      const min =
        CONTEXT_MIN_TOKEN_BY_KEY[
          metaFilters.contextMinKey as keyof typeof CONTEXT_MIN_TOKEN_BY_KEY
        ]
      if (min != null) {
        result = filterByContextMinTokens(
          result,
          metaFilters.metaByName,
          min
        )
      }
    }
  }

  result = sortModels(result, filters.sortBy)

  return result
}

/**
 * Parse tags from comma-separated string
 */
export function parseTags(tagsString?: string): string[] {
  if (!tagsString) return []
  return tagsString
    .split(/[,;|\s]+/)
    .map((t) => t.trim())
    .filter(Boolean)
}

/**
 * Extract all unique tags from models
 */
export function extractAllTags(models: PricingModel[]): string[] {
  const tagSet = new Set<string>()

  models.forEach((model) => {
    if (model.tags) {
      const tags = parseTags(model.tags)
      tags.forEach((tag) => {
        tagSet.add(tag.toLowerCase())
      })
    }
  })

  return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
}

/**
 * Filter models by tag
 */
export function filterByTag(
  models: PricingModel[],
  tag: string
): PricingModel[] {
  if (tag === FILTER_ALL) return models

  const tagLower = tag.toLowerCase()
  return models.filter((m) => {
    if (!m.tags) return false
    const modelTags = parseTags(m.tags).map((t) => t.toLowerCase())
    return modelTags.includes(tagLower)
  })
}
