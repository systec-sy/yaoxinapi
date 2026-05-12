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
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { SiOpenai } from 'react-icons/si'
import { Button } from '@/components/ui/button'
// import { HeroTerminalDemo } from '../hero-terminal-demo'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()

  return (
    <section className='relative z-10 flex flex-col items-center overflow-hidden px-6 pt-28 pb-0 md:pt-36'>
      {/* Radial gradient background */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10 opacity-25 dark:opacity-[0.12]'
        style={{
          background: [
            'radial-gradient(ellipse 60% 50% at 20% 20%, oklch(0.72 0.18 250 / 80%) 0%, transparent 70%)',
            'radial-gradient(ellipse 50% 40% at 80% 15%, oklch(0.65 0.15 200 / 60%) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 35% at 40% 80%, oklch(0.70 0.12 280 / 40%) 0%, transparent 70%)',
          ].join(', '),
        }}
      />
      {/* Grid pattern */}
      <div
        aria-hidden
        className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black_20%,transparent_100%)] bg-[size:4rem_4rem] opacity-[0.08]'
      />

      <div className='flex max-w-3xl flex-col items-center text-center'>
        <h1
          className='landing-animate-fade-up text-foreground text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.15] font-bold tracking-tight'
          style={{ animationDelay: '0ms' }}
        >
          {t('Unified interface for LLM')}
        </h1>
        <p
          className='landing-animate-fade-up mt-5 max-w-lg text-base leading-relaxed text-[#8a8aff] opacity-0 md:text-lg dark:text-indigo-300'
          style={{ animationDelay: '80ms' }}
        >
          {t('Better prices, longer runtime, no subscription required.')}
        </p>
        <div
          className='landing-animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3 opacity-0'
          style={{ animationDelay: '160ms' }}
        >
          <Button
            className='h-11 rounded-lg border-0 bg-[#6366f1] px-6 text-white shadow-none hover:bg-[#5558dd]'
            render={
              props.isAuthenticated ? (
                <Link to='/keys' />
              ) : (
                <Link to='/sign-in' search={{ redirect: '/keys' }} />
              )
            }
          >
            {t('Get API key')}
          </Button>
          <Button
            variant='outline'
            className='text-foreground h-11 rounded-lg border-neutral-200 bg-white px-6 hover:bg-neutral-50 dark:border-border dark:bg-background dark:hover:bg-muted/50'
            render={<Link to='/pricing' />}
          >
            {t('Explore models')}
            <SiOpenai className='ml-1 size-4 shrink-0' aria-hidden />
          </Button>
        </div>
      </div>

      {/* Home API playground demo (tabs + curl sample) — hidden for custom landing
      <div
        className='landing-animate-fade-up w-full opacity-0'
        style={{ animationDelay: '300ms' }}
      >
        <HeroTerminalDemo />
      </div>
      */}
    </section>
  )
}
