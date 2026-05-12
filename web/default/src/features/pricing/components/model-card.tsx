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
import { memo, useMemo } from 'react'
import { ChevronRight, Copy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getLobeIcon } from '@/lib/lobe-icon'
import { cn } from '@/lib/utils'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { DEFAULT_TOKEN_UNIT } from '../constants'
import {
  getDynamicDisplayGroupRatio,
  getDynamicPricingSummary,
} from '../lib/dynamic-price'
import { parseTags } from '../lib/filters'
import {
  formatTokenCount,
  inferModelMetadata,
} from '../lib/model-metadata'
import { isTokenBasedModel } from '../lib/model-helpers'
import { formatPrice, formatRequestPrice } from '../lib/price'
import type { PricingModel, TokenUnit } from '../types'
import { ModelPerfBadge, type ModelPerfBadgeData } from './model-perf-badge'

export interface ModelCardProps {
  model: PricingModel
  onClick: () => void
  priceRate?: number
  usdExchangeRate?: number
  tokenUnit?: TokenUnit
  showRechargePrice?: boolean
  perf?: ModelPerfBadgeData
}

export const ModelCard = memo(function ModelCard(props: ModelCardProps) {
  const { t } = useTranslation()
  const { copyToClipboard } = useCopyToClipboard()
  const tokenUnit = props.tokenUnit ?? DEFAULT_TOKEN_UNIT
  const priceRate = props.priceRate ?? 1
  const usdExchangeRate = props.usdExchangeRate ?? 1
  const showRechargePrice = props.showRechargePrice ?? false
  const isTokenBased = isTokenBasedModel(props.model)
  const tokenUnitLabel = tokenUnit === 'K' ? '1K' : '1M'
  const tags = parseTags(props.model.tags)
  const tagStrings = useMemo(
    () => tags.map((x) => String(x).trim()).filter(Boolean),
    [tags]
  )
  const endpoints = props.model.supported_endpoint_types || []
  const vendorIcon = props.model.vendor_icon
    ? getLobeIcon(props.model.vendor_icon, 28)
    : null
  const initial = props.model.model_name?.charAt(0).toUpperCase() || '?'
  const isDynamicPricing =
    props.model.billing_mode === 'tiered_expr' &&
    Boolean(props.model.billing_expr)
  const hasCachedPrice = isTokenBased && props.model.cache_ratio != null
  const dynamicSummary = isDynamicPricing
    ? getDynamicPricingSummary(props.model, {
        tokenUnit,
        showRechargePrice,
        priceRate,
        usdExchangeRate,
        groupRatioMultiplier: getDynamicDisplayGroupRatio(props.model),
      })
    : null

  const vendorLabel = props.model.vendor_name?.trim() || ''
  const endpointKeys = useMemo(() => {
    const set = new Set<string>()
    for (const ep of endpoints) {
      set.add(String(ep).toLowerCase().replace(/\s+/g, ''))
    }
    return set
  }, [endpoints])

  const inlineMetaTags = useMemo(() => {
    const vendorKey = vendorLabel.toLowerCase().replace(/\s+/g, '')
    const out: string[] = []
    const seenNorm = new Set<string>()
    for (const tag of tagStrings) {
      if (out.length >= 3) break
      const normalized = tag.toLowerCase().replace(/\s+/g, '')
      if (
        !normalized ||
        normalized === vendorKey ||
        endpointKeys.has(normalized) ||
        seenNorm.has(normalized)
      ) {
        continue
      }
      seenNorm.add(normalized)
      out.push(tag)
    }
    return out
  }, [vendorLabel, tagStrings, endpointKeys])

  const hiddenTagCount = useMemo(() => {
    const shown = new Set(
      inlineMetaTags.map((s) => s.toLowerCase().replace(/\s+/g, ''))
    )
    const vendorKey = vendorLabel.toLowerCase().replace(/\s+/g, '')
    return tagStrings.filter((tagStr) => {
      const n = tagStr.toLowerCase().replace(/\s+/g, '')
      if (!n || n === vendorKey || endpointKeys.has(n)) return false
      return !shown.has(n)
    }).length
  }, [inlineMetaTags, tagStrings, endpointKeys, vendorLabel])

  const metadata = useMemo(
    () => inferModelMetadata(props.model),
    [props.model]
  )
  const contextTokensDisplay = useMemo(
    () => formatTokenCount(metadata.context_length),
    [metadata]
  )
  const showMetaRow = inlineMetaTags.length > 0 || hiddenTagCount > 0
  const contextFooterSuffix =
    contextTokensDisplay !== '—'
      ? `${contextTokensDisplay} ${t('Context')}`
      : null

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    copyToClipboard(props.model.model_name || '')
  }

  return (
    <div
      className={cn(
        'group relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-shadow duration-200',
        'hover:shadow-[0_4px_14px_rgba(15,23,42,0.07)]',
        'dark:border-border dark:bg-card dark:shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_4px_18px_rgba(0,0,0,0.28)]'
      )}
    >
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 isolate overflow-hidden rounded-2xl'
      >
        {/* No CSS mask here: mask + blurred child wipes out most visible color in WebKit/Chromium. */}
        <div
          className='absolute -right-14 -top-[28%] h-[120%] w-[95%] opacity-[0.78] will-change-transform dark:opacity-[0.42]'
          style={{
            filter: 'blur(44px)',
            transform: 'translate3d(0,0,0)',
            background: [
              'radial-gradient(ellipse 52% 48% at 78% 32%, oklch(0.86 0.12 330 / 52%), oklch(0.92 0.04 320 / 18%) 38%, oklch(0.96 0.02 320 / 6%) 58%, transparent 82%)',
              'radial-gradient(ellipse 48% 44% at 92% 48%, oklch(0.94 0.1 95 / 45%), oklch(0.97 0.04 90 / 14%) 42%, oklch(0.99 0.01 90 / 5%) 62%, transparent 84%)',
              'radial-gradient(ellipse 40% 36% at 62% 80%, oklch(0.88 0.09 250 / 40%), oklch(0.94 0.04 250 / 12%) 45%, transparent 78%)',
            ].join(', '),
          }}
        />
      </div>

      <div className='relative z-10 flex min-h-0 flex-1 flex-col gap-3'>
        <div className='shrink-0'>
          <div className='flex items-start gap-3'>
            <div className='bg-muted/50 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/40 dark:border-border/60'>
              {vendorIcon || (
                <span className='text-muted-foreground text-sm font-bold'>
                  {initial}
                </span>
              )}
            </div>
            <div className='min-w-0 flex-1 pe-1'>
              <h3
                className='text-foreground min-w-0 truncate font-mono text-[14px] leading-snug font-bold tracking-tight'
                title={props.model.model_name || undefined}
              >
                {props.model.model_name}
              </h3>

              <div className='mt-2.5 flex flex-col gap-2'>
                <div className='flex flex-wrap items-center gap-2'>
              {dynamicSummary ? (
                dynamicSummary.isSpecialExpression ? (
                  <span className='min-w-0'>
                    <span className='bg-amber-500/12 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200 inline-block rounded-md px-2 py-0.5 text-[11px] font-medium'>
                      {t('Special billing expression')}
                    </span>
                    <code className='text-muted-foreground/80 mt-1 line-clamp-1 block font-mono text-[11px] break-all'>
                      {dynamicSummary.rawExpression}
                    </code>
                  </span>
                ) : dynamicSummary.primaryEntries.length > 0 ? (
                  dynamicSummary.primaryEntries.map((entry) => (
                    <span
                      key={entry.key}
                      className='bg-muted-foreground/10 text-foreground inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium'
                    >
                      {t(entry.shortLabel)}{' '}
                      <span className='text-foreground ms-0.5 font-mono'>
                        {entry.formatted}
                      </span>
                      /{tokenUnitLabel}
                    </span>
                  ))
                ) : (
                  <span className='bg-muted-foreground/10 text-muted-foreground rounded-md px-2 py-0.5 text-[11px] font-medium'>
                    {t('Dynamic Pricing')}
                  </span>
                )
              ) : isTokenBased ? (
                <>
                  <span className='bg-emerald-500/[0.13] text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium'>
                    {t('Input')}{' '}
                    <span className='ms-0.5 font-mono font-semibold'>
                      {formatPrice(
                        props.model,
                        'input',
                        tokenUnit,
                        showRechargePrice,
                        priceRate,
                        usdExchangeRate
                      )}
                    </span>
                    /{tokenUnitLabel}
                  </span>
                  <span className='bg-violet-500/[0.12] text-violet-800 dark:bg-violet-400/16 dark:text-violet-200 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium'>
                    {t('Output')}{' '}
                    <span className='ms-0.5 font-mono font-semibold'>
                      {formatPrice(
                        props.model,
                        'output',
                        tokenUnit,
                        showRechargePrice,
                        priceRate,
                        usdExchangeRate
                      )}
                    </span>
                    /{tokenUnitLabel}
                  </span>
                  {hasCachedPrice ? (
                    <span className='bg-sky-500/[0.11] text-sky-900 dark:bg-sky-400/14 dark:text-sky-200 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium'>
                      {t('Cached')}{' '}
                      <span className='ms-0.5 font-mono'>
                        {formatPrice(
                          props.model,
                          'cache',
                          tokenUnit,
                          showRechargePrice,
                          priceRate,
                          usdExchangeRate
                        )}
                      </span>
                    </span>
                  ) : null}
                </>
              ) : (
                <span className='bg-indigo-500/[0.11] text-indigo-900 dark:bg-indigo-400/15 dark:text-indigo-200 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium'>
                  <span className='font-mono font-semibold'>
                    {formatRequestPrice(
                      props.model,
                      showRechargePrice,
                      priceRate,
                      usdExchangeRate
                    )}
                  </span>
                </span>
              )}
                </div>

                {showMetaRow ? (
                  <div className='flex min-w-0 flex-col gap-1 text-[11px]'>
                    <div className='text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5'>
                      {inlineMetaTags.map((item) => (
                        <span
                          key={item}
                          className='text-indigo-600/85 dark:text-indigo-400/90'
                        >
                          {item}
                        </span>
                      ))}
                      {hiddenTagCount > 0 ? (
                        <span className='text-muted-foreground/70'>
                          +{hiddenTagCount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <button
              type='button'
              onClick={handleCopy}
              className={cn(
                'text-muted-foreground hover:text-foreground shrink-0 rounded-lg border border-transparent bg-neutral-100/90 p-2 transition-all hover:bg-neutral-200/90 dark:bg-muted/60 dark:hover:bg-muted',
                'pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100'
              )}
              title={t('Copy')}
            >
              <Copy className='size-3.5' />
            </button>
          </div>
        </div>

        <p className='text-muted-foreground line-clamp-2 min-h-[2.25rem] flex-1 text-[13px] leading-relaxed'>
          {props.model.description || t('No description available.')}
        </p>

        <div className='text-muted-foreground mt-auto flex shrink-0 items-end justify-between gap-3 pt-0.5 text-[11px] leading-snug'>
          <div className='min-w-0 flex-1'>
            {vendorLabel ? (
              <>
                <span>{vendorLabel}</span>
                <span className='text-muted-foreground/50' aria-hidden>
                  {' '}
                  ·{' '}
                </span>
              </>
            ) : null}
            <span>
              {isTokenBased ? t('Token-based') : t('Per Request')}
            </span>
            {contextFooterSuffix ? (
              <>
                <span className='text-muted-foreground/50' aria-hidden>
                  {' '}
                  ·{' '}
                </span>
                <span
                  className='tabular-nums'
                  title={`${t('Context')}: ${contextTokensDisplay}`}
                >
                  {contextFooterSuffix}
                </span>
              </>
            ) : null}
          </div>
          <button
            type='button'
            onClick={props.onClick}
            className='text-muted-foreground hover:text-foreground inline-flex shrink-0 items-center gap-0.5 rounded-lg border border-transparent bg-neutral-100/90 px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-neutral-200/90 dark:bg-muted/60 dark:hover:bg-muted'
          >
            {t('Details')}
            <ChevronRight className='size-3.5' />
          </button>
        </div>
      </div>
    </div>
  )
})
