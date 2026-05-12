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
import type { ReactNode } from 'react'
import { ChevronDown, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getLobeIcon } from '@/lib/lobe-icon'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  ENDPOINT_TYPES,
  FILTER_ALL,
  QUOTA_TYPES,
  CONTEXT_MIN_FILTER_ORDER,
  CONTEXT_MIN_FILTERS,
  CONTEXT_MIN_TOKEN_BY_KEY,
  FILTER_MODALITIES,
  getContextMinLabels,
  getEndpointTypeLabels,
  getModalityFilterLabel,
  getQuotaTypeLabels,
  type ContextMinFilterKey,
} from '../constants'
import type { ModelMetadata } from '../lib/model-metadata'
import type { Modality, PricingModel, PricingVendor } from '../types'

type FilterOption = {
  value: string
  label: string
  count?: number
  suffix?: string
  icon?: ReactNode
}

type FilterSectionProps = {
  title: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
}

export interface PricingSidebarProps {
  quotaTypeFilter: string
  endpointTypeFilter: string
  vendorFilter: string
  groupFilter: string
  tagFilter: string
  onQuotaTypeChange: (value: string) => void
  onEndpointTypeChange: (value: string) => void
  onVendorChange: (value: string) => void
  onGroupChange: (value: string) => void
  onTagChange: (value: string) => void
  vendors: PricingVendor[]
  groups: string[]
  groupRatios?: Record<string, number>
  tags: string[]
  models: PricingModel[]
  metadataByName: Map<string, ModelMetadata>
  selectedModalities: Modality[]
  onModalityToggle: (m: Modality) => void
  contextMinFilter: ContextMinFilterKey
  onContextMinChange: (k: ContextMinFilterKey) => void
  hasActiveFilters: boolean
  onClearFilters: () => void
  className?: string
}

function countBy(
  models: PricingModel[],
  predicate: (model: PricingModel) => boolean
): number {
  return models.reduce((count, model) => count + (predicate(model) ? 1 : 0), 0)
}

/* Groups filter helpers — restore when Groups section is re-enabled.
function formatGroupRatio(ratio: number | undefined): string | undefined {
  if (ratio == null) return undefined
  const formatted = Number.isInteger(ratio)
    ? ratio.toString()
    : ratio.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')
  return `x${formatted}`
}
*/

function modalityPredicate(
  metaByName: Map<string, ModelMetadata>,
  modality: Modality,
  model: PricingModel
): boolean {
  const meta = metaByName.get(model.model_name)
  if (!meta) return false
  const union = new Set<Modality>([
    ...meta.input_modalities,
    ...meta.output_modalities,
  ])
  return union.has(modality)
}

function contextMinPredicate(
  metaByName: Map<string, ModelMetadata>,
  minTokens: number,
  model: PricingModel
): boolean {
  const len = metaByName.get(model.model_name)?.context_length ?? 0
  return len >= minTokens
}

function ModalityFilterSection(props: {
  title: string
  modalities: readonly Modality[]
  selected: Modality[]
  onToggle: (m: Modality) => void
  models: PricingModel[]
  metaByName: Map<string, ModelMetadata>
  hint?: string
}) {
  const { t } = useTranslation()
  return (
    <Collapsible
      defaultOpen
      className='border-border/70 border-b pb-3 last:border-b-0'
    >
      <CollapsibleTrigger className='group flex w-full items-center justify-between py-2.5 text-left'>
        <span className='text-foreground text-sm font-semibold'>
          {props.title}
        </span>
        <ChevronDown className='text-muted-foreground size-4 transition-transform group-data-[panel-open]:rotate-180' />
      </CollapsibleTrigger>
      <CollapsibleContent>
        {props.hint ? (
          <p className='text-muted-foreground mb-2 text-[11px] leading-snug'>
            {props.hint}
          </p>
        ) : null}
        <div className='grid grid-cols-2 gap-1.5'>
          {props.modalities.map((modality) => {
            const active = props.selected.includes(modality)
            const count = countBy(props.models, (model) =>
              modalityPredicate(props.metaByName, modality, model)
            )
            return (
              <FilterChip
                key={modality}
                option={{
                  value: modality,
                  label: getModalityFilterLabel(t, modality),
                  count,
                }}
                active={active}
                onClick={() => props.onToggle(modality)}
              />
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
function FilterChip(props: {
  option: FilterOption
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type='button'
      onClick={props.onClick}
      className={cn(
        'group flex min-w-0 w-full items-center justify-start gap-1.5 rounded-md border px-2 py-1 text-left text-xs font-medium transition-all',
        props.active
          ? 'border-indigo-500/15 bg-indigo-500/10 text-foreground dark:border-indigo-400/30 dark:bg-indigo-400/8'
          : 'border-border/70 bg-muted/40 text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground'
      )}
      title={props.option.label}
    >
      {props.option.icon && (
        <span className='shrink-0'>{props.option.icon}</span>
      )}
      <span className='min-w-0 flex-1 truncate'>{props.option.label}</span>
      {(props.option.suffix || props.option.count != null) && (
        <span
          className={cn(
            'shrink-0 rounded-full px-1.5 py-0.5 text-[10px]',
            props.active
              ? 'bg-background text-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {props.option.suffix ?? props.option.count}
        </span>
      )}
    </button>
  )
}

function FilterSection(props: FilterSectionProps) {
  return (
    <Collapsible
      defaultOpen
      className='border-border/70 border-b pb-3 last:border-b-0'
    >
      <CollapsibleTrigger className='group flex w-full items-center justify-between py-2.5 text-left'>
        <span className='text-foreground text-sm font-semibold'>
          {props.title}
        </span>
        <ChevronDown className='text-muted-foreground size-4 transition-transform group-data-[panel-open]:rotate-180' />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className='grid grid-cols-2 gap-1.5'>
          {props.options.map((option) => (
            <FilterChip
              key={option.value}
              option={option}
              active={props.value === option.value}
              onClick={() => props.onChange(option.value)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function PricingSidebar(props: PricingSidebarProps) {
  const { t } = useTranslation()
  const quotaTypeLabels = getQuotaTypeLabels(t)
  const endpointTypeLabels = getEndpointTypeLabels(t)

  const vendorOptions: FilterOption[] = [
    {
      value: FILTER_ALL,
      label: t('All Vendors'),
      count: props.models.length,
    },
    ...props.vendors
      .map((vendor) => ({
        value: vendor.name,
        label: vendor.name,
        count: countBy(
          props.models,
          (model) => model.vendor_name === vendor.name
        ),
        icon: vendor.icon ? getLobeIcon(vendor.icon, 14) : undefined,
      }))
      .filter((vendor) => vendor.count > 0),
  ]

  /* Groups filter — hidden per product request; restore when needed.
  const groupOptions: FilterOption[] = [
    {
      value: FILTER_ALL,
      label: t('All Groups'),
    },
    ...props.groups.map((group) => ({
      value: group,
      label: group,
      suffix: formatGroupRatio(props.groupRatios?.[group]),
    })),
  ]
  */

  const quotaOptions: FilterOption[] = [
    {
      value: QUOTA_TYPES.ALL,
      label: quotaTypeLabels[QUOTA_TYPES.ALL],
      count: props.models.length,
    },
    {
      value: QUOTA_TYPES.TOKEN,
      label: quotaTypeLabels[QUOTA_TYPES.TOKEN],
      count: countBy(props.models, (model) => model.quota_type === 0),
    },
    {
      value: QUOTA_TYPES.REQUEST,
      label: quotaTypeLabels[QUOTA_TYPES.REQUEST],
      count: countBy(props.models, (model) => model.quota_type === 1),
    },
  ]

  /* Model Tags filter — hidden per product request; restore when needed.
  const tagOptions: FilterOption[] = [
    {
      value: FILTER_ALL,
      label: t('All Tags'),
      count: props.models.length,
    },
    ...props.tags.map((tag) => ({
      value: tag,
      label: tag,
      count: countBy(props.models, (model) =>
        parseTags(model.tags)
          .map((item) => item.toLowerCase())
          .includes(tag.toLowerCase())
      ),
    })),
  ]
  */

  const endpointOptions: FilterOption[] = [
    {
      value: ENDPOINT_TYPES.ALL,
      label: endpointTypeLabels[ENDPOINT_TYPES.ALL],
      count: props.models.length,
    },
    ...Object.entries(endpointTypeLabels)
      .filter(([value]) => value !== ENDPOINT_TYPES.ALL)
      .map(([value, label]) => ({
        value,
        label,
        count: countBy(
          props.models,
          (model) => model.supported_endpoint_types?.includes(value) ?? false
        ),
      })),
  ]

  const contextMinLabels = getContextMinLabels(t)
  const contextOptions: FilterOption[] = CONTEXT_MIN_FILTER_ORDER.map(
    (key) => ({
      value: key,
      label: contextMinLabels[key],
      count:
        key === CONTEXT_MIN_FILTERS.ALL
          ? props.models.length
          : countBy(props.models, (model) =>
              contextMinPredicate(
                props.metadataByName,
                CONTEXT_MIN_TOKEN_BY_KEY[key],
                model
              )
            ),
    })
  )

  return (
    <aside
      className={cn(
        'text-foreground flex h-full min-h-0 flex-col border-0 border-r border-border/50 bg-[#fafbfd] py-3 pl-3 pr-0 dark:border-border/70 dark:bg-background',
        props.className
      )}
    >
      <div className='mb-2.5 shrink-0 pr-3'>
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0'>
            <h2 className='text-foreground text-sm font-bold'>{t('Filter')}</h2>
            <p className='text-muted-foreground mt-1 text-xs'>
              {t(
                'Refine models by input method, context length, provider, pricing type, and endpoint type.'
              )}
            </p>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={props.onClearFilters}
            disabled={!props.hasActiveFilters}
            className='h-7 shrink-0 gap-1.5 px-2 text-xs'
          >
            <RotateCcw className='size-3.5' />
            {t('Reset')}
          </Button>
        </div>

        {props.hasActiveFilters ? (
          <Badge variant='secondary' className='mt-3'>
            {t('Filters active')}
          </Badge>
        ) : null}
      </div>

      <div className='hover-scrollbar min-h-0 flex-1 overflow-y-auto'>
        <div className='space-y-1 pr-3'>
          <ModalityFilterSection
            title={t('Input method')}
            modalities={FILTER_MODALITIES}
            selected={props.selectedModalities}
            onToggle={props.onModalityToggle}
            models={props.models}
            metaByName={props.metadataByName}
          />
          <FilterSection
            title={t('Context length')}
            value={props.contextMinFilter}
            options={contextOptions}
            onChange={(v) =>
              props.onContextMinChange(v as ContextMinFilterKey)
            }
          />
          {/* Groups filter — hidden per product request; restore when needed.
          <FilterSection
            title={t('Groups')}
            value={props.groupFilter}
            options={groupOptions}
            onChange={props.onGroupChange}
          />
          */}
          <FilterSection
            title={t('Vendor')}
            value={props.vendorFilter}
            options={vendorOptions}
            onChange={props.onVendorChange}
          />
          {/* Model Tags filter — hidden per product request; restore when needed.
          <FilterSection
            title={t('Model Tags')}
            value={props.tagFilter}
            options={tagOptions}
            onChange={props.onTagChange}
          />
          */}
          <FilterSection
            title={t('Pricing Type')}
            value={props.quotaTypeFilter}
            options={quotaOptions}
            onChange={props.onQuotaTypeChange}
          />
          <FilterSection
            title={t('Endpoint Type')}
            value={props.endpointTypeFilter}
            options={endpointOptions}
            onChange={props.onEndpointTypeChange}
          />
        </div>
      </div>
    </aside>
  )
}
