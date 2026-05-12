import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import hermesImg from '@/assets/hermes.webp'
import hermesLogoImg from '@/assets/hermes-logo.png'
import kiloCodeImg from '@/assets/kilocode.webp'
import kiloCodeLogoImg from '@/assets/kilo-code-logo.png'
import replitImg from '@/assets/replit.webp'
import replitLogoImg from '@/assets/replit-logo.png'
import { AnimateInView } from '@/components/animate-in-view'
import {
  PROMO_CARD_HAIRLINE,
  PROMO_CARD_HAIRLINE_HOVER,
} from '@/features/home/lib/promo-card-hairline'
import { cn } from '@/lib/utils'

const agentCardShell = cn(
  'group/card text-card-foreground relative isolate flex h-full flex-col overflow-hidden rounded-xl bg-white dark:bg-card',
  PROMO_CARD_HAIRLINE,
  'motion-safe:transition-[box-shadow,border-color,color] motion-safe:duration-300',
  'motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]',
  PROMO_CARD_HAIRLINE_HOVER
)

interface FeaturedAgentCardProps {
  preview: ReactNode
  icon: ReactNode
  title: string
  description: string
}

const agentPreviewImageClassName = cn(
  'block h-full w-full object-cover object-center',
  'motion-safe:origin-center motion-safe:transition-transform motion-safe:duration-300',
  'motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]',
  'motion-safe:group-hover/card:scale-[1.08]'
)

function AgentPreviewImage(props: { alt: string; src: string }) {
  return (
    <img
      src={props.src}
      alt={props.alt}
      className={agentPreviewImageClassName}
      loading='lazy'
      decoding='async'
    />
  )
}

const agentBrandIconClassName = cn(
  'block h-full w-full object-cover object-center rounded-full'
)

function AgentBrandIcon(props: { src: string }) {
  return (
    <img
      src={props.src}
      alt=''
      className={agentBrandIconClassName}
      loading='lazy'
      decoding='async'
    />
  )
}

function FeaturedAgentCard(props: FeaturedAgentCardProps) {
  return (
    <div className={agentCardShell}>
      <div
        className={cn(
          'relative h-36 w-full shrink-0 overflow-hidden sm:h-40 md:h-44',
          'bg-card',
          'border-b border-slate-200/40 dark:border-border/60',
          'motion-safe:transition-colors motion-safe:duration-300'
        )}
      >
        {props.preview}
      </div>
      <div className='flex flex-1 gap-3 bg-white p-5 dark:bg-card sm:gap-4'>
        <div
          className={cn(
            'flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200/45 bg-white dark:border-border/60 dark:bg-card sm:size-16',
          )}
        >
          {props.icon}
        </div>
        <div className='min-w-0 flex-1'>
          <h3 className='text-sm font-semibold tracking-tight md:text-base'>
            {props.title}
          </h3>
          <p className='text-muted-foreground group-hover/card:text-foreground/90 mt-1 text-xs leading-relaxed transition-colors duration-200 md:text-sm'>
            {props.description}
          </p>
        </div>
      </div>
    </div>
  )
}

interface FeaturedAgentsProps {
  className?: string
}

export function FeaturedAgents(props: FeaturedAgentsProps) {
  const { t } = useTranslation()

  const agents: FeaturedAgentCardProps[] = [
    {
      preview: <AgentPreviewImage alt={t('Replit')} src={replitImg} />,
      icon: <AgentBrandIcon src={replitLogoImg} />,
      title: t('Replit'),
      description: t('The easiest way to go from idea to app'),
    },
    {
      preview: <AgentPreviewImage alt={t('Hermes Agent')} src={hermesImg} />,
      icon: <AgentBrandIcon src={hermesLogoImg} />,
      title: t('Hermes Agent'),
      description: t('An autonomous agent that grows with you'),
    },
    {
      preview: <AgentPreviewImage alt={t('Kilo Code')} src={kiloCodeImg} />,
      icon: <AgentBrandIcon src={kiloCodeLogoImg} />,
      title: t('Kilo Code'),
      description: t('Everything you need for agentic development'),
    },
  ]

  return (
    <section
      className={cn('relative z-10 px-6', props.className)}
      aria-labelledby='featured-agents-heading'
    >
      <div className='mx-auto max-w-7xl'>
        <AnimateInView className='mb-8 flex flex-col gap-4 sm:mb-10 md:mb-12'>
          <div>
            <h2
              id='featured-agents-heading'
              className='text-2xl font-bold tracking-tight md:text-3xl'
            >
              {t('Featured Agents')}
            </h2>
            <p className='text-muted-foreground mt-2 max-w-xl text-sm md:text-base'>
              {t(
                'Discover agent workflows and autonomous tools you can build on one unified API.'
              )}
            </p>
          </div>
        </AnimateInView>
        <div className='grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6'>
          {agents.map((a, i) => (
            <AnimateInView
              key={`${a.title}-${i}`}
              delay={i * 100}
              animation='fade-up'
              className='min-h-0'
            >
              <FeaturedAgentCard
                preview={a.preview}
                icon={a.icon}
                title={a.title}
                description={a.description}
              />
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
