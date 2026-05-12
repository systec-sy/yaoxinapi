import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Claude, Gemini, OpenAI } from '@lobehub/icons'
import { AnimateInView } from '@/components/animate-in-view'
import {
  PROMO_CARD_HAIRLINE,
  PROMO_CARD_HAIRLINE_HOVER,
} from '@/features/home/lib/promo-card-hairline'
import { cn } from '@/lib/utils'

interface FeaturedModelCardProps {
  icon: ReactNode
  name: string
  byline: string
  isNew?: boolean
  tokensDisplay: string
  trendDisplay: string
  trendPositive: boolean
}

function FeaturedModelCard(props: FeaturedModelCardProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'group/card text-card-foreground relative isolate flex h-full flex-col overflow-hidden rounded-xl bg-white p-5 dark:bg-card',
        PROMO_CARD_HAIRLINE,
        'motion-safe:transition-[box-shadow,border-color,color] motion-safe:duration-300',
        'motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]',
        PROMO_CARD_HAIRLINE_HOVER
      )}
    >
      <div className='flex gap-3'>
        <div
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-full border border-slate-200/45 bg-white dark:border-border/60 dark:bg-card'
          )}
        >
          {props.icon}
        </div>
        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <h3 className='text-sm font-semibold tracking-tight md:text-base'>
              {props.name}
            </h3>
            {props.isNew ? (
              <span
                className={cn(
                  'rounded-md border px-1.5 py-0.5 text-[10px] font-medium',
                  'border-border/60 bg-muted/50 text-muted-foreground'
                )}
              >
                {t('New')}
              </span>
            ) : null}
          </div>
          <p className='text-muted-foreground group-hover/card:text-foreground/90 mt-1 text-xs transition-colors duration-200'>
            {props.byline}
          </p>
        </div>
      </div>
      <div className='my-4 border-t border-slate-200/45 dark:border-border/50' />
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <p className='text-muted-foreground text-xs font-medium'>
            {t('Tokens')}
          </p>
          <p className='mt-1 text-lg font-bold tabular-nums tracking-tight md:text-xl'>
            {props.tokensDisplay}
          </p>
        </div>
        <div className='text-right'>
          <p className='text-muted-foreground text-xs font-medium'>
            {t('Weekly Trend')}
          </p>
          <p
            className={cn(
              'mt-1 text-lg font-semibold tabular-nums md:text-xl',
              props.trendPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            )}
          >
            {props.trendDisplay}
          </p>
        </div>
      </div>
    </div>
  )
}

interface FeaturedModelsProps {
  className?: string
}

export function FeaturedModels(props: FeaturedModelsProps) {
  const { t } = useTranslation()
  const iconSize = 22

  const models: FeaturedModelCardProps[] = [
    {
      icon: <Claude.Color size={iconSize} />,
      name: t('Claude Opus 4.7'),
      byline: t('by {{provider}}', { provider: t('Anthropic') }),
      tokensDisplay: '968.0B',
      trendDisplay: '+84.63%',
      trendPositive: true,
    },
    {
      icon: <OpenAI size={iconSize} />,
      name: t('GPT-5.5'),
      byline: t('by {{provider}}', { provider: t('OpenAI') }),
      isNew: true,
      tokensDisplay: '412.5B',
      trendDisplay: '-26.3%',
      trendPositive: false,
    },
    {
      icon: <Gemini.Color size={iconSize} />,
      name: t('Gemini 3 Pro Preview'),
      byline: t('by {{provider}}', { provider: t('Google') }),
      tokensDisplay: '289.1B',
      trendDisplay: '+12.45%',
      trendPositive: true,
    },
  ]

  return (
    <section
      className={cn('relative z-10 px-6', props.className)}
      aria-labelledby='featured-models-heading'
    >
      <div className='mx-auto max-w-7xl'>
        <AnimateInView className='mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-start sm:justify-between md:mb-12'>
          <div>
            <h2
              id='featured-models-heading'
              className='text-2xl font-bold tracking-tight md:text-3xl'
            >
              {t('Featured Models')}
            </h2>
          </div>
          <Link
            to='/pricing'
            className='text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm font-medium transition-colors sm:shrink-0 sm:pt-1'
          >
            {t('View all')}
            <ArrowRight className='size-4' aria-hidden />
          </Link>
        </AnimateInView>
        <div className='grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6'>
          {models.map((m, i) => (
            <AnimateInView
              key={`${m.name}-${i}`}
              delay={i * 100}
              animation='fade-up'
              className='min-h-0'
            >
              <FeaturedModelCard
                icon={m.icon}
                name={m.name}
                byline={m.byline}
                isNew={m.isNew}
                tokensDisplay={m.tokensDisplay}
                trendDisplay={m.trendDisplay}
                trendPositive={m.trendPositive}
              />
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
