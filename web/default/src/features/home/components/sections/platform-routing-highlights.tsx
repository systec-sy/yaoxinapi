import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Check,
  Globe,
  Layers,
  Rocket,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { AnimateInView } from '@/components/animate-in-view'
import {
  PROMO_CARD_HAIRLINE,
  PROMO_CARD_HAIRLINE_HOVER,
} from '@/features/home/lib/promo-card-hairline'
import { cn } from '@/lib/utils'

interface PlatformRoutingHighlightsProps {
  className?: string
}

/** Landing palette: blue #3B82F6, violet #8B5CF6, emerald #10B981, amber #F59E0B */
const ACCENT = {
  blue: {
    circle: 'bg-[#3B82F6]',
    title: 'text-[#3B82F6] dark:text-blue-400',
    check: 'bg-[#3B82F6]',
    metricIcon: 'text-[#3B82F6] dark:text-blue-400',
    cardSurface:
      'bg-gradient-to-br from-white via-slate-50/80 to-blue-50 dark:from-card dark:via-card dark:to-blue-950/40',
    metricSurface:
      'bg-gradient-to-br from-white via-slate-50/90 to-blue-50/95 dark:from-card dark:via-card dark:to-blue-950/35',
  },
  purple: {
    circle: 'bg-[#8B5CF6]',
    title: 'text-[#8B5CF6] dark:text-violet-400',
    check: 'bg-[#8B5CF6]',
    metricIcon: 'text-[#8B5CF6] dark:text-violet-400',
    cardSurface:
      'bg-gradient-to-br from-white via-slate-50/80 to-violet-50 dark:from-card dark:via-card dark:to-violet-950/35',
    metricSurface:
      'bg-gradient-to-br from-white via-slate-50/90 to-violet-50/95 dark:from-card dark:via-card dark:to-violet-950/30',
  },
  green: {
    circle: 'bg-[#10B981]',
    title: 'text-[#10B981] dark:text-emerald-400',
    check: 'bg-[#10B981]',
    metricIcon: 'text-[#10B981] dark:text-emerald-400',
    cardSurface:
      'bg-gradient-to-br from-white via-slate-50/80 to-emerald-50 dark:from-card dark:via-card dark:to-emerald-950/35',
    metricSurface:
      'bg-gradient-to-br from-white via-slate-50/90 to-emerald-50/95 dark:from-card dark:via-card dark:to-emerald-950/30',
  },
  orange: {
    metricIcon: 'text-[#F59E0B] dark:text-amber-400',
    metricSurface:
      'bg-gradient-to-br from-white via-slate-50/90 to-amber-50/95 dark:from-card dark:via-card dark:to-amber-950/30',
  },
} as const

type CardAccent = 'blue' | 'purple' | 'green'
type MetricAccent = keyof typeof ACCENT

const METRICS_FRAME =
  'border-0 bg-[rgba(229,231,235,0.26)] shadow-[inset_0_0_0_1px_rgba(226,232,240,0.28),0_1px_2px_-1px_rgba(15,23,42,0.04)] dark:bg-muted/30 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),0_1px_2px_-1px_rgba(0,0,0,0.15)]'

/** Match inner grid rounding so hover inset shadow follows container corners. */
const METRIC_TILE_SHELL = [
  'rounded-tl-[18px] md:rounded-l-[18px]',
  'rounded-tr-[18px] md:rounded-none',
  'rounded-bl-[18px] md:rounded-none',
  'rounded-br-[18px] md:rounded-r-[18px]',
] as const

function MetricHighlightCell(props: {
  accent: MetricAccent
  icon: ReactNode
  valueKey: string
  labelKey: string
  shellClassName: string
}) {
  const { t } = useTranslation()
  const surface = ACCENT[props.accent].metricSurface
  const iconTint = ACCENT[props.accent].metricIcon

  return (
    <div
      className={cn(
        surface,
        'group/metric relative isolate flex flex-col items-center justify-center gap-1.5 px-3 py-5 text-center md:gap-2 md:py-6',
        props.shellClassName,
        'motion-safe:transition-[box-shadow,border-color,color] motion-safe:duration-300',
        'motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]',
        'motion-safe:hover:z-10',
        'motion-safe:hover:shadow-[inset_0_0_0_1px_rgba(147,51,234,0.38),0_18px_40px_-22px_rgba(15,23,42,0.12)]',
        'dark:motion-safe:hover:shadow-[inset_0_0_0_1px_rgba(192,132,252,0.42),0_18px_40px_-22px_rgba(0,0,0,0.38)]'
      )}
    >
      <div
        className={cn(
          'transform-gpu backface-hidden',
          'motion-safe:transition-transform motion-safe:duration-[420ms]',
          'motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]',
          'motion-safe:group-hover/metric:scale-[1.052]'
        )}
        aria-hidden
      >
        <span className={cn('inline-flex', iconTint)}>{props.icon}</span>
      </div>
      <p className='text-lg font-bold tabular-nums text-slate-800 md:text-xl dark:text-foreground'>
        {t(props.valueKey)}
      </p>
      <p className='text-xs text-slate-500 transition-colors duration-200 group-hover/metric:text-foreground/90 md:text-[13px] dark:text-muted-foreground'>
        {t(props.labelKey)}
      </p>
    </div>
  )
}

function HighlightCard(props: {
  accent: CardAccent
  icon: ReactNode
  titleKey: string
  bulletsKey: readonly string[]
  delayMs: number
}) {
  const { t } = useTranslation()

  return (
    <AnimateInView
      delay={props.delayMs}
      animation='fade-up'
      className={cn(
        'group/card text-card-foreground flex h-full min-h-[352px] flex-col overflow-hidden rounded-[20px] bg-white px-8 py-12 md:min-h-[412px] md:px-9 md:py-14 dark:bg-card',
        PROMO_CARD_HAIRLINE,
        'motion-safe:transition-[box-shadow,border-color,color] motion-safe:duration-300',
        'motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]',
        PROMO_CARD_HAIRLINE_HOVER,
        props.accent === 'blue' && ACCENT.blue.cardSurface,
        props.accent === 'purple' && ACCENT.purple.cardSurface,
        props.accent === 'green' && ACCENT.green.cardSurface
      )}
    >
      <div
        className={cn(
          'mb-5 flex size-12 origin-center items-center justify-center rounded-full text-white',
          'transform-gpu backface-hidden',
          'motion-safe:transition-transform motion-safe:duration-[420ms]',
          'motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]',
          'motion-safe:group-hover/card:scale-[1.052]',
          props.accent === 'blue' && ACCENT.blue.circle,
          props.accent === 'purple' && ACCENT.purple.circle,
          props.accent === 'green' && ACCENT.green.circle
        )}
        aria-hidden
      >
        {props.icon}
      </div>
      <h3
        className={cn(
          'mb-5 text-lg font-semibold tracking-tight',
          props.accent === 'blue' && ACCENT.blue.title,
          props.accent === 'purple' && ACCENT.purple.title,
          props.accent === 'green' && ACCENT.green.title
        )}
      >
        {t(props.titleKey)}
      </h3>
      <div
        className='mb-6 border-t border-dashed border-slate-200/45 dark:border-border/50'
        aria-hidden
      />
      <ul className='flex flex-1 flex-col justify-center gap-4 md:gap-5'>
        {props.bulletsKey.map((key) => (
          <li key={key} className='flex gap-3 text-left'>
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full',
                props.accent === 'blue' && ACCENT.blue.check,
                props.accent === 'purple' && ACCENT.purple.check,
                props.accent === 'green' && ACCENT.green.check
              )}
              aria-hidden
            >
              <Check className='size-3 text-white' strokeWidth={3} />
            </span>
            <span className='text-[15px] leading-snug text-slate-500 transition-colors duration-200 group-hover/card:text-foreground/90 dark:text-muted-foreground'>
              {t(key)}
            </span>
          </li>
        ))}
      </ul>
    </AnimateInView>
  )
}

export function PlatformRoutingHighlights(props: PlatformRoutingHighlightsProps) {
  const { t } = useTranslation()

  return (
    <section
      className={cn('relative z-10 px-6', props.className)}
      aria-labelledby='platform-routing-highlights-heading'
    >
      <div className='mx-auto max-w-7xl'>
        <AnimateInView className='mb-14 max-w-3xl text-left md:mb-16'>
          <h2
            id='platform-routing-highlights-heading'
            className='text-pretty text-2xl font-bold tracking-tight text-slate-800 md:text-3xl lg:text-[2rem] dark:text-foreground'
          >
            {t('Core Competitive Advantages')}
          </h2>
          <p className='mt-4 text-pretty text-base leading-relaxed text-slate-500 md:text-lg dark:text-muted-foreground'>
            {t(
              'High availability, low latency, intelligently scheduled global routing and AI service platform'
            )}
          </p>
        </AnimateInView>

        <div className='grid gap-6 md:grid-cols-3 md:gap-8'>
          <HighlightCard
            accent='blue'
            delayMs={0}
            titleKey='Global Intelligent Routing Acceleration'
            icon={<Zap className='size-6' strokeWidth={2} aria-hidden />}
            bulletsKey={[
              'Edge node deployment, P99 latency under 800ms',
              'Automatic failover, 99.99% availability',
              'Private VPC deployment supported',
            ]}
          />
          <HighlightCard
            accent='purple'
            delayMs={80}
            titleKey='One API, 200+ models'
            icon={<Box className='size-6' strokeWidth={2} aria-hidden />}
            bulletsKey={[
              'OpenAI-compatible, zero-code migration',
              'Intelligent model routing and load balancing',
              'Model versioning and A/B testing support',
            ]}
          />
          <HighlightCard
            accent='green'
            delayMs={160}
            titleKey='Transparent pricing and cost control'
            icon={<ShieldCheck className='size-6' strokeWidth={2} aria-hidden />}
            bulletsKey={[
              'Real-time token billing, pay as you go',
              'Monthly invoicing, flexible settlement',
              'Budget alerts and controls to prevent runaway costs',
            ]}
          />
        </div>

        <AnimateInView
          delay={200}
          animation='fade-up'
          className={cn(
            'mt-8 overflow-hidden rounded-[20px] p-px',
            METRICS_FRAME,
            'md:mt-10'
          )}
        >
          <div className='grid grid-cols-2 gap-px overflow-hidden rounded-[18px] bg-[rgba(229,231,235,0.22)] md:grid-cols-4 dark:bg-border/35'>
            <MetricHighlightCell
              accent='blue'
              shellClassName={METRIC_TILE_SHELL[0]}
              valueKey='Global Coverage'
              labelKey='Edge node deployment'
              icon={
                <Globe className='size-8' strokeWidth={1.5} aria-hidden />
              }
            />
            <MetricHighlightCell
              accent='purple'
              shellClassName={METRIC_TILE_SHELL[1]}
              valueKey='99.99%'
              labelKey='Service availability'
              icon={
                <ShieldCheck
                  className='size-8'
                  strokeWidth={1.5}
                  aria-hidden
                />
              }
            />
            <MetricHighlightCell
              accent='green'
              shellClassName={METRIC_TILE_SHELL[2]}
              valueKey='< 800ms'
              labelKey='P99 latency'
              icon={
                <Rocket className='size-9' strokeWidth={1.5} aria-hidden />
              }
            />
            <MetricHighlightCell
              accent='orange'
              shellClassName={METRIC_TILE_SHELL[3]}
              valueKey='200+'
              labelKey='Available models'
              icon={
                <Layers className='size-8' strokeWidth={1.5} aria-hidden />
              }
            />
          </div>
        </AnimateInView>
      </div>
    </section>
  )
}
