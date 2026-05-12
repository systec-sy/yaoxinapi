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
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { getLobeIcon } from '@/lib/lobe-icon'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { GroupBadge } from '@/components/group-badge'
import { DEFAULT_TOKEN_UNIT, QUOTA_TYPE_VALUES } from '../constants'
import {
  getDynamicDisplayGroupRatio,
  getDynamicPricingSummary,
} from '../lib/dynamic-price'
import { parseTags } from '../lib/filters'
import { formatTokenCount, inferModelMetadata } from '../lib/model-metadata'
import { isTokenBasedModel } from '../lib/model-helpers'
import {
  formatPrice,
  formatRequestPrice,
  stripTrailingZeros,
} from '../lib/price'
import type { PricingModel, TokenUnit } from '../types'

// ----------------------------------------------------------------------------
// Pricing Table Columns
// ----------------------------------------------------------------------------

export interface PricingColumnsOptions {
  tokenUnit?: TokenUnit
  priceRate?: number
  usdExchangeRate?: number
  showRechargePrice?: boolean
}

function renderLimitedTags(
  items: string[],
  maxDisplay: number = 3
): React.ReactNode {
  if (items.length === 0)
    return <span className='text-muted-foreground/50 text-xs'>—</span>

  const displayed = items.slice(0, maxDisplay)
  const remaining = items.length - maxDisplay

  return (
    <span className='text-muted-foreground text-xs'>
      {displayed.join(', ')}
      {remaining > 0 && (
        <span className='text-muted-foreground/50'> +{remaining}</span>
      )}
    </span>
  )
}

function renderLimitedGroupBadges(
  groups: string[],
  maxDisplay: number = 2
): React.ReactNode {
  if (groups.length === 0)
    return <span className='text-muted-foreground/50 text-xs'>—</span>

  const displayed = groups.slice(0, maxDisplay)
  const remaining = groups.length - maxDisplay

  return (
    <div className='flex max-w-full items-center gap-1 overflow-hidden'>
      {displayed.map((group) => (
        <GroupBadge key={group} group={group} size='sm' />
      ))}
      {remaining > 0 && (
        <span className='text-muted-foreground/50 text-xs'>+{remaining}</span>
      )}
    </div>
  )
}

export function usePricingColumns(
  options: PricingColumnsOptions = {}
): ColumnDef<PricingModel>[] {
  const { t } = useTranslation()
  const {
    tokenUnit = DEFAULT_TOKEN_UNIT,
    priceRate = 1,
    usdExchangeRate = 1,
    showRechargePrice = false,
  } = options

  const tokenUnitLabel = tokenUnit === 'K' ? '1K' : '1M'
  const perUnitPriceLabel = (labelKey: string) =>
    `${t(labelKey)} / ${tokenUnitLabel}`

  return [
    // Model column
    {
      accessorKey: 'model_name',
      meta: { label: t('Model') },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('Model')} />
      ),
      cell: ({ row }) => {
        const model = row.original
        const vendorIcon = model.vendor_icon
          ? getLobeIcon(model.vendor_icon, 14)
          : null

        return (
          <div className='flex min-w-[200px] items-center gap-2'>
            {vendorIcon}
            <span className='truncate font-mono text-sm font-medium'>
              {model.model_name}
            </span>
          </div>
        )
      },
      minSize: 200,
    },

    // Type column
    {
      accessorKey: 'quota_type',
      meta: { label: t('Type') },
      header: t('Type'),
      cell: ({ row }) => {
        const isTokenBased = row.original.quota_type === QUOTA_TYPE_VALUES.TOKEN
        return (
          <span className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
            {isTokenBased ? t('Token') : t('Request')}
          </span>
        )
      },
      size: 80,
      enableSorting: false,
    },

    // Context column (aligned with model detail quick stats)
    {
      id: 'context',
      meta: { label: t('Context') },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('Context')} />
      ),
      cell: ({ row }) => {
        const meta = inferModelMetadata(row.original)
        const ctx = formatTokenCount(meta.context_length)
        return (
          <span className='text-muted-foreground min-w-[9.5rem] text-sm whitespace-nowrap tabular-nums'>
            {ctx === '—' ? ctx : `${ctx} ${t('Context')}`}
          </span>
        )
      },
      size: 168,
      minSize: 140,
      enableSorting: false,
    },

    // Input price column
    {
      id: 'input_price',
      meta: {
        label: perUnitPriceLabel('Input'),
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={perUnitPriceLabel('Input')}
        />
      ),
      cell: ({ row }) => {
        const model = row.original
        const dynamicOpts = {
          tokenUnit,
          showRechargePrice,
          priceRate,
          usdExchangeRate,
          groupRatioMultiplier: getDynamicDisplayGroupRatio(model),
        }
        const dynamicSummary = getDynamicPricingSummary(model, dynamicOpts)

        if (dynamicSummary) {
          if (dynamicSummary.isSpecialExpression) {
            return (
              <div className='max-w-[220px]'>
                <div className='text-xs font-medium text-amber-700 dark:text-amber-300'>
                  {t('Special billing expression')}
                </div>
                <div className='text-muted-foreground text-[10px]'>
                  {t('Unable to parse structured pricing')}
                </div>
                <code className='text-muted-foreground/70 mt-1 line-clamp-2 block font-mono text-[10px] leading-relaxed break-all'>
                  {dynamicSummary.rawExpression}
                </code>
              </div>
            )
          }

          const inputEntry = dynamicSummary.entries.find(
            (e) => e.field === 'inputPrice'
          )
          if (!inputEntry) {
            return (
              <span className='text-muted-foreground text-xs'>
                {dynamicSummary.primaryEntries.length === 0
                  ? t('Dynamic Pricing')
                  : '—'}
              </span>
            )
          }

          return (
            <div className='min-w-[92px]'>
              <span className='font-mono text-sm tabular-nums'>
                {stripTrailingZeros(inputEntry.formatted)}
              </span>
              {dynamicSummary.tierCount > 1 ? (
                <div className='text-muted-foreground/50 mt-0.5 text-[10px]'>
                  {t('{{count}} tiers', {
                    count: dynamicSummary.tierCount,
                  })}
                </div>
              ) : null}
            </div>
          )
        }

        const isTokenBased = isTokenBasedModel(model)

        if (isTokenBased) {
          const inputPrice = stripTrailingZeros(
            formatPrice(
              model,
              'input',
              tokenUnit,
              showRechargePrice,
              priceRate,
              usdExchangeRate
            )
          )

          return (
            <span className='font-mono text-sm tabular-nums'>
              {inputPrice}
            </span>
          )
        }

        const price = stripTrailingZeros(
          formatRequestPrice(
            model,
            showRechargePrice,
            priceRate,
            usdExchangeRate
          )
        )

        return (
          <span className='font-mono text-sm tabular-nums'>{price}</span>
        )
      },
      size: 120,
      enableSorting: false,
    },

    // Output price column
    {
      id: 'output_price',
      meta: {
        label: perUnitPriceLabel('Output'),
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={perUnitPriceLabel('Output')}
        />
      ),
      cell: ({ row }) => {
        const model = row.original
        const dynamicOpts = {
          tokenUnit,
          showRechargePrice,
          priceRate,
          usdExchangeRate,
          groupRatioMultiplier: getDynamicDisplayGroupRatio(model),
        }
        const dynamicSummary = getDynamicPricingSummary(model, dynamicOpts)

        if (dynamicSummary) {
          if (dynamicSummary.isSpecialExpression) {
            return (
              <span className='text-muted-foreground/30 text-xs'>—</span>
            )
          }

          const outputEntry = dynamicSummary.entries.find(
            (e) => e.field === 'outputPrice'
          )
          if (!outputEntry) {
            return (
              <span className='text-muted-foreground text-xs'>
                {dynamicSummary.primaryEntries.length === 0
                  ? t('Dynamic Pricing')
                  : '—'}
              </span>
            )
          }

          return (
            <div className='min-w-[92px]'>
              <span className='font-mono text-sm tabular-nums'>
                {stripTrailingZeros(outputEntry.formatted)}
              </span>
            </div>
          )
        }

        const isTokenBased = isTokenBasedModel(model)

        if (isTokenBased) {
          const outputPrice = stripTrailingZeros(
            formatPrice(
              model,
              'output',
              tokenUnit,
              showRechargePrice,
              priceRate,
              usdExchangeRate
            )
          )

          return (
            <span className='font-mono text-sm tabular-nums'>
              {outputPrice}
            </span>
          )
        }

        return <span className='text-muted-foreground/30 text-xs'>—</span>
      },
      size: 120,
      enableSorting: false,
    },

    // Cached price column (Vercel AI Gateway style)
    {
      id: 'cached_price',
      meta: { label: t('Cached') },
      header: t('Cached'),
      cell: ({ row }) => {
        const model = row.original
        const dynamicSummary = getDynamicPricingSummary(model, {
          tokenUnit,
          showRechargePrice,
          priceRate,
          usdExchangeRate,
          groupRatioMultiplier: getDynamicDisplayGroupRatio(model),
        })

        if (dynamicSummary) {
          if (dynamicSummary.isSpecialExpression) {
            return (
              <span className='text-muted-foreground/50 text-xs'>
                {t('Special billing expression')}
              </span>
            )
          }

          const cacheEntry = dynamicSummary.entries.find(
            (entry) => entry.field === 'cacheReadPrice'
          )
          if (!cacheEntry) {
            return <span className='text-muted-foreground/30 text-xs'>—</span>
          }

          return (
            <span className='font-mono text-sm tabular-nums'>
              {stripTrailingZeros(cacheEntry.formatted)}
            </span>
          )
        }

        const isTokenBased = isTokenBasedModel(model)

        if (!isTokenBased || model.cache_ratio == null) {
          return <span className='text-muted-foreground/30 text-xs'>—</span>
        }

        const cachedPrice = stripTrailingZeros(
          formatPrice(
            model,
            'cache',
            tokenUnit,
            showRechargePrice,
            priceRate,
            usdExchangeRate
          )
        )

        return (
          <span className='font-mono text-sm tabular-nums'>
            {cachedPrice}
          </span>
        )
      },
      size: 110,
      enableSorting: false,
    },

    // Vendor column
    {
      accessorKey: 'vendor_name',
      meta: { label: t('Vendor') },
      header: t('Vendor'),
      cell: ({ row }) => {
        const model = row.original
        if (!model.vendor_name) {
          return <span className='text-muted-foreground/50 text-xs'>—</span>
        }
        const vendorIcon = model.vendor_icon
          ? getLobeIcon(model.vendor_icon, 12)
          : null
        return (
          <span className='text-muted-foreground flex items-center gap-1.5 text-xs'>
            {vendorIcon}
            {model.vendor_name}
          </span>
        )
      },
      size: 130,
      enableSorting: false,
    },

    // Tags column
    {
      accessorKey: 'tags',
      meta: { label: t('Tags') },
      header: t('Tags'),
      cell: ({ row }) => {
        const tags = parseTags(row.original.tags)
        if (tags.length === 0) {
          return <span className='text-muted-foreground/50 text-xs'>—</span>
        }

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<div />}>
                {renderLimitedTags(tags, 2)}
              </TooltipTrigger>
              {tags.length > 2 && (
                <TooltipContent side='top' className='max-w-[280px] p-2'>
                  <span className='text-xs'>{tags.join(', ')}</span>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )
      },
      size: 140,
      enableSorting: false,
    },

    // Endpoints column
    {
      accessorKey: 'supported_endpoint_types',
      meta: { label: t('Endpoints') },
      header: t('Endpoints'),
      cell: ({ row }) => {
        const endpoints = row.original.supported_endpoint_types || []
        if (endpoints.length === 0) {
          return <span className='text-muted-foreground/50 text-xs'>—</span>
        }

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<div />}>
                {renderLimitedTags(endpoints, 2)}
              </TooltipTrigger>
              {endpoints.length > 2 && (
                <TooltipContent side='top' className='max-w-[280px] p-2'>
                  <span className='text-xs'>{endpoints.join(', ')}</span>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )
      },
      size: 130,
      enableSorting: false,
    },

    // Enable Groups column
    {
      accessorKey: 'enable_groups',
      meta: { label: t('Groups') },
      header: t('Groups'),
      cell: ({ row }) => {
        const groups = row.original.enable_groups || []
        if (groups.length === 0) {
          return <span className='text-muted-foreground/50 text-xs'>—</span>
        }

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<div />}>
                {renderLimitedGroupBadges(groups, 2)}
              </TooltipTrigger>
              {groups.length > 2 && (
                <TooltipContent side='top' className='max-w-[280px] p-2'>
                  <div className='flex flex-wrap gap-1'>
                    {groups.map((group) => (
                      <GroupBadge key={group} group={group} size='sm' />
                    ))}
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )
      },
      size: 130,
      enableSorting: false,
    },
  ]
}
