import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Moonshot,
  OpenAI,
  XAI,
  Zhipu,
  Volcengine,
  Cohere,
  Claude,
  Gemini,
  Suno,
  Minimax,
  Wenxin,
  Spark,
  Qingyan,
  DeepSeek,
  Qwen,
  Midjourney,
  Grok,
  AzureAI,
  Hunyuan,
  Xinference,
} from '@lobehub/icons'
import { CheckCircle2, Lock, Shield, Users } from 'lucide-react'
import { AnimateInView } from '@/components/animate-in-view'
import {
  PROMO_CARD_HAIRLINE,
  PROMO_CARD_HAIRLINE_HOVER,
} from '@/features/home/lib/promo-card-hairline'
import { cn } from '@/lib/utils'

interface ValueCardsProps {
  className?: string
}

function ValueCard(props: {
  visual: ReactNode
  title: string
  description: string
}) {
  return (
    <div
      className={cn(
        'group relative isolate flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-white dark:bg-card',
        PROMO_CARD_HAIRLINE,
        'motion-safe:transition-[box-shadow,border-color,color] motion-safe:duration-300',
        'motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]',
        PROMO_CARD_HAIRLINE_HOVER
      )}
    >
      {/* Fixed-height strip so titles/descriptions line up across all cards in a row */}
      <div
        className={cn(
          'relative flex h-[200px] shrink-0 overflow-hidden border-b border-slate-200/45 md:h-[212px] dark:border-border/50',
        )}
      >
        <div className='relative h-full w-full'>
          <div
            className={cn(
              'flex h-full w-full items-center justify-center',
              'origin-center transform-gpu backface-hidden',
              'motion-safe:transition-transform motion-safe:duration-[420ms]',
              'motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]',
              'motion-safe:group-hover:scale-[1.052]'
            )}
          >
            {props.visual}
          </div>
        </div>
      </div>
      <div className='flex flex-1 flex-col p-6 text-left'>
        <h3 className='line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-[#111827] dark:text-foreground'>
          {props.title}
        </h3>
        <p className='mt-3 flex-1 text-sm leading-relaxed text-muted-foreground'>
          {props.description}
        </p>
      </div>
    </div>
  )
}

/** Same vendor icons as classic Home; row stagger + minimal outer padding (fills strip). */
function ProviderIconsVisual() {
  const iconSize = 20
  const shell = cn(
    'flex size-8 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB]/90 bg-white',
    'shadow-[0_1px_3px_rgba(15,23,42,0.08)] dark:border-border dark:bg-card dark:shadow-sm'
  )

  /** Order matches `web/classic/src/pages/Home/index.jsx` icon strip (without `30+`). */
  const slots = [
    () => <Moonshot size={iconSize} />,
    () => <OpenAI size={iconSize} />,
    () => <XAI size={iconSize} />,
    () => <Zhipu.Color size={iconSize} />,
    () => <Volcengine.Color size={iconSize} />,
    () => <Cohere.Color size={iconSize} />,
    () => <Claude.Color size={iconSize} />,
    () => <Gemini.Color size={iconSize} />,
    () => <Suno size={iconSize} />,
    () => <Minimax.Color size={iconSize} />,
    () => <Wenxin.Color size={iconSize} />,
    () => <Spark.Color size={iconSize} />,
    () => <Qingyan.Color size={iconSize} />,
    () => <DeepSeek.Color size={iconSize} />,
    () => <Qwen.Color size={iconSize} />,
    () => <Midjourney size={iconSize} />,
    () => <Grok size={iconSize} />,
    () => <AzureAI.Color size={iconSize} />,
    () => <Hunyuan.Color size={iconSize} />,
    () => <Xinference.Color size={iconSize} />,
  ] as const

  const rowCount = 4
  const cols = 5

  return (
    <div
      className='flex h-full min-h-0 w-full flex-col items-center justify-center gap-y-4 md:gap-y-5'
      aria-hidden
    >
      {Array.from({ length: rowCount }, (_, rowIdx) => {
        const start = rowIdx * cols
        const rowSlots = slots.slice(start, start + cols)
        const stagger = rowIdx % 2 === 1
        return (
          <div
            key={rowIdx}
            className={cn(
              'flex shrink-0 justify-center gap-x-6 md:gap-x-8',
              stagger && 'translate-x-[28px] md:translate-x-[34px]'
            )}
          >
            {rowSlots.map((render, i) => (
              <div key={`${rowIdx}-${i}`} className={shell}>
                {render()}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function FailoverVisual() {
  return (
    <div className='flex w-full max-w-[270px] flex-col items-center gap-2.5'>
      <div className='max-w-full truncate rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-4 py-2 font-mono text-[11px] leading-tight text-[#4B5563] md:text-xs dark:border-border dark:bg-muted/50 dark:text-muted-foreground'>
        anthropic/claude-opus-4.7
      </div>
      <div className='flex h-6 w-full items-end justify-center gap-8 px-2'>
        <div className='from-[#E5E7EB] h-6 w-px bg-gradient-to-b to-transparent dark:from-border' />
        <div className='from-[#E5E7EB] h-6 w-px bg-gradient-to-b to-transparent dark:from-border' />
        <div className='from-[#E5E7EB] h-6 w-px bg-gradient-to-b to-transparent dark:from-border' />
      </div>
      <div className='flex w-full justify-between px-1'>
        {['A', 'B', 'C'].map((k) => (
          <div
            key={k}
            className='flex size-11 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[11px] font-medium text-[#6B7280] shadow-sm dark:border-border dark:bg-background dark:text-muted-foreground'
          >
            API
          </div>
        ))}
      </div>
    </div>
  )
}

function MiniLineChart(props: { stroke: string }) {
  return (
    <svg
      viewBox='0 0 80 28'
      className='mt-1 w-full shrink-0'
      fill='none'
      aria-hidden
    >
      <path
        d='M0 18 L12 12 L24 20 L36 8 L48 16 L60 10 L72 6 L80 14'
        stroke={props.stroke}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

function ChartsVisual() {
  return (
    <div className='relative mx-auto h-[148px] w-full max-w-[238px] shrink-0 md:h-[156px] md:max-w-[248px]'>
      <div className='absolute top-0 left-0 z-10 w-[86%] rounded-lg border border-[#E5E7EB] bg-white p-2.5 shadow-md dark:border-border dark:bg-card'>
        <span className='text-[11px] font-medium text-[#6B7280] dark:text-muted-foreground'>
          Throughput
        </span>
        <MiniLineChart stroke='oklch(0.55 0.15 250)' />
      </div>
      <div className='absolute right-0 bottom-0 z-0 w-[80%] rounded-lg border border-[#E5E7EB] bg-white p-2.5 shadow-sm dark:border-border dark:bg-card'>
        <span className='text-[11px] font-medium text-[#6B7280] dark:text-muted-foreground'>
          Latency
        </span>
        <MiniLineChart stroke='oklch(0.7 0.15 85)' />
      </div>
    </div>
  )
}

function PolicyVisual() {
  return (
    <div className='relative flex h-full min-h-0 w-full flex-col items-center justify-center gap-2.5'>
      <div className='flex shrink-0 items-center gap-4'>
        <Lock className='size-4 text-[#6B7280] dark:text-muted-foreground' aria-hidden />
        <CheckCircle2 className='size-4 text-green-600 dark:text-green-500' aria-hidden />
        <Lock className='size-4 text-[#6B7280] dark:text-muted-foreground' aria-hidden />
      </div>
      <div className='border-primary/25 from-primary/5 flex size-[5.5rem] shrink-0 items-center justify-center rounded-2xl border-2 bg-gradient-to-b to-transparent'>
        <div className='relative flex size-[3.75rem] items-center justify-center'>
          <Shield
            className='text-primary/70 absolute size-[3.75rem]'
            strokeWidth={1.25}
            aria-hidden
          />
          <Users
            className='text-primary relative z-10 size-6'
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
      </div>
    </div>
  )
}

export function ValueCards(props: ValueCardsProps) {
  const { t } = useTranslation()

  const items = [
    {
      id: 'one-api',
      visual: <ProviderIconsVisual />,
      title: t('One integration, all mainstream models'),
      description: t(
        'No need to integrate each vendor separately. One unified entry gives you all mainstream models, ready out of the box.'
      ),
    },
    {
      id: 'availability',
      visual: <FailoverVisual />,
      title: t('Smart failover, always online'),
      description: t(
        'When any model provider fails, the system automatically switches to backup channels. Distributed infrastructure keeps your business always available.'
      ),
    },
    {
      id: 'price-perf',
      visual: <ChartsVisual />,
      title: t('Full speed, controlled cost'),
      description: t(
        'The gateway runs at the edge for nearby inference with lower latency. Without hurting responsiveness, it automatically prefers high-value models.'
      ),
    },
    {
      id: 'data-policy',
      visual: <PolicyVisual />,
      title: t('Requests under control, compliance your way'),
      description: t(
        'Fine-grained routing rules ensure every request only reaches models and providers you authorize. Meets enterprise security and privacy requirements.'
      ),
    },
  ] as const

  return (
    <section
      className={cn(
        'relative z-10 px-6',
        props.className
      )}
    >
      <div className='mx-auto grid max-w-7xl auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-5'>
        {items.map((item, i) => (
          <AnimateInView
            key={item.id}
            delay={i * 100}
            animation='fade-up'
            className='min-h-0'
          >
            <ValueCard
              visual={item.visual}
              title={item.title}
              description={item.description}
            />
          </AnimateInView>
        ))}
      </div>
    </section>
  )
}
