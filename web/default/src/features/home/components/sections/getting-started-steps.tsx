import type { ReactNode } from 'react'
import {
  Key,
  Mail,
  User,
  Wallet,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FcGoogle } from 'react-icons/fc'
import { SiGithub } from 'react-icons/si'
import { AnimateInView } from '@/components/animate-in-view'
import { cn } from '@/lib/utils'

/** Card shell — lavender (light) / theme card (dark). */
const stepCardShell = cn(
  'w-full overflow-hidden rounded-xl border border-[#f1f1f1] bg-[#f6f6ffeb] shadow-sm',
  'dark:border-border dark:bg-card dark:shadow-none'
)

/** Mock icon circle — signup / credits / api key row. */
const mockIconCircle = cn(
  'flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EBEAFD]',
  'dark:bg-white/10'
)

/** Mini oauth / list tile — light panel on card. */
const mockTile = cn(
  'flex h-full min-h-0 flex-col items-center justify-center gap-1.5 rounded-lg px-1 py-3',
  'border border-[#E5E7EB] bg-white dark:border-border dark:bg-background/90'
)

/** Inner row pill accent (credits row 1, gateway label). */
const accentPillRow = cn(
  'rounded-lg border border-[#5850ec] bg-[#EBEAFD] px-3 py-2.5 text-xs font-medium text-[#5850ec]',
  'dark:border-violet-500/45 dark:bg-violet-950/45 dark:text-violet-300'
)

/** Mail icon — brand blue. */
const MAIL_BRAND = 'text-[#2563EB]'
/** GitHub mark — official near-black. */
const GITHUB_BRAND = 'text-[#181717]'

/** Lower mock block: aligns signup OAuth row height with credits list (two `py-2.5` rows + `space-y-2` ≈ 5.5rem). */
const LOWER_MOCK_BLOCK_MIN_H = 'min-h-[5.5rem]'

const titleClass =
  'text-lg font-bold tracking-tight text-[#111827] dark:text-foreground'

const descClass =
  'mt-2 min-h-[3.75rem] text-sm leading-relaxed text-[#6B7280] dark:text-muted-foreground line-clamp-3'

function StepBadge(props: { num: string }) {
  return (
    <span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-[#5850ec] text-sm font-bold text-white'>
      {props.num}
    </span>
  )
}

function PlaceholderBars(props: { className?: string }) {
  const bar =
    'h-2 w-full rounded-full bg-[#EDE9FE] dark:bg-white/20'
  return (
    <div className={cn('min-w-0 flex-1 space-y-2', props.className)}>
      <div className={cn('max-w-[88%]', bar)} />
      <div className={cn('max-w-[72%]', bar)} />
    </div>
  )
}

function StepCard(props: { children: ReactNode }) {
  return (
    <div className={cn(stepCardShell, 'mt-3 w-full')}>
      <div className='p-4'>{props.children}</div>
    </div>
  )
}

function SignUpVisual() {
  const { t } = useTranslation()

  return (
    <StepCard>
      <div className='flex items-center gap-2'>
        <div className={mockIconCircle}>
          <User
            className='size-4 text-[#5850ec] dark:text-violet-400'
            strokeWidth={1.75}
          />
        </div>
        <PlaceholderBars />
      </div>
      <div
        className={cn(
          'mt-4 grid grid-cols-3 gap-4 items-stretch sm:gap-3',
          LOWER_MOCK_BLOCK_MIN_H
        )}
      >
        {[
          { icon: <FcGoogle className='size-6 shrink-0' aria-hidden />, label: t('Google') },
          {
            icon: (
              <SiGithub
                className={cn('size-6 shrink-0', GITHUB_BRAND, 'dark:text-white')}
                aria-hidden
              />
            ),
            label: t('GitHub'),
          },
          {
            icon: (
              <Mail
                className={cn('size-6 shrink-0', MAIL_BRAND, 'dark:text-blue-400')}
                strokeWidth={1.75}
                aria-hidden
              />
            ),
            label: t('Account'),
          },
        ].map((item) => (
          <div key={item.label} className={mockTile}>
            {item.icon}
            <span className='text-center text-[12px] font-medium leading-tight text-[#6B7280] dark:text-muted-foreground'>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </StepCard>
  )
}

function CreditsVisual() {
  const { t } = useTranslation()

  return (
    <StepCard>
      <div className='flex items-center gap-2'>
        <div className={mockIconCircle}>
          <Wallet
            className='size-4 text-[#5850ec] dark:text-violet-400'
            strokeWidth={1.75}
          />
        </div>
        <PlaceholderBars />
      </div>
      <div className='mt-4 space-y-2'>
        <div className={cn(accentPillRow, 'flex items-center justify-between')}>
          <span>{t('Apr 1')}</span>
          <span className='font-semibold tabular-nums'>{t('99 USD')}</span>
        </div>
        <div
          className={cn(
            'flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs',
            'text-[#111827] dark:border-border dark:bg-muted/35 dark:text-foreground'
          )}
        >
          <span className='text-[#6B7280] dark:text-muted-foreground'>
            {t('Mar 30')}
          </span>
          <span className='font-semibold tabular-nums'>{t('10 USD')}</span>
        </div>
      </div>
    </StepCard>
  )
}

function ApiKeyVisual() {
  const { t } = useTranslation()

  return (
    <StepCard>
      <div className='flex flex-col gap-4'>
        <div className='flex min-w-0 items-center gap-2'>
          <div className={mockIconCircle}>
            <Key
              className='size-4 text-[#5850ec] dark:text-violet-400'
              strokeWidth={1.75}
              aria-hidden
            />
          </div>
          <div
            className={cn(
              'min-w-0 flex-1 rounded-lg px-3 py-2.5 text-center text-xs font-medium',
              accentPillRow
            )}
          >
            {t('Your gateway API key')}
          </div>
        </div>
        <div
          className={cn(
            'flex items-center justify-between gap-2 rounded-lg border border-dashed border-[#D1D5DB] bg-white px-3 py-2.5',
            'dark:border-border dark:bg-muted/35'
          )}
        >
          <span className='font-mono text-xs tracking-widest text-[#9CA3AF] dark:text-muted-foreground'>
            ••••••••••••••••
          </span>
        </div>
      </div>
    </StepCard>
  )
}

function StepColumn(props: { header: ReactNode; card: ReactNode }) {
  return (
    <div className='flex h-full min-h-0 flex-col'>
      <div className='shrink-0'>{props.header}</div>
      <div className='flex min-h-0 flex-1 flex-col'>{props.card}</div>
    </div>
  )
}

interface GettingStartedStepsProps {
  className?: string
}

export function GettingStartedSteps(props: GettingStartedStepsProps) {
  const { t } = useTranslation()

  const columns = [
    {
      key: 'signup',
      header: (
        <div className='flex items-start gap-3'>
          <StepBadge num='1' />
          <div className='min-w-0'>
            <h3 className={titleClass}>{t('Create an account')}</h3>
            <p className={descClass}>
              {t(
                'Create an account to get started. You can create an organization for your team later.'
              )}
            </p>
          </div>
        </div>
      ),
      card: <SignUpVisual />,
    },
    {
      key: 'credits',
      header: (
        <div className='flex items-start gap-3'>
          <StepBadge num='2' />
          <div className='min-w-0'>
            <h3 className={titleClass}>{t('Purchase credits')}</h3>
            <p className={descClass}>{t('Credits work with any model or provider.')}</p>
          </div>
        </div>
      ),
      card: <CreditsVisual />,
    },
    {
      key: 'apikey',
      header: (
        <div className='flex items-start gap-3'>
          <StepBadge num='3' />
          <div className='min-w-0'>
            <h3 className={titleClass}>{t('Get your API key')}</h3>
            <p className={descClass}>
              {t('Create an API key and start sending requests.')}{' '}
              <span className='font-medium text-[#5850ec] dark:text-[#c084fc]'>
                {t('Fully compatible with OpenAI.')}
              </span>
            </p>
          </div>
        </div>
      ),
      card: <ApiKeyVisual />,
    },
  ] as const

  return (
    <section
      className={cn(
        'relative z-10 bg-white px-6 dark:bg-background',
        props.className
      )}
      aria-label={t('Three steps to get started')}
    >
      <div className='mx-auto max-w-6xl'>
        <div className='grid auto-rows-fr gap-12 md:grid-cols-3 md:gap-8 lg:gap-10'>
          {columns.map((col, i) => (
            <AnimateInView
              key={col.key}
              delay={i * 150}
              animation='fade-up'
              className='min-h-0'
            >
              <StepColumn header={col.header} card={col.card} />
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
