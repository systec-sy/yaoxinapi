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
import { useSystemConfig } from '@/hooks/use-system-config'
import { Skeleton } from '@/components/ui/skeleton'
import { AuthAnimatedBackdrop } from './components/auth-animated-backdrop'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()
  const { systemName, logo, loading } = useSystemConfig()

  return (
    <div className='relative isolate flex min-h-svh max-w-none flex-col overflow-hidden dark:bg-background'>
      <AuthAnimatedBackdrop />
      <div className='relative z-10 flex flex-1 flex-col'>
        <Link
          to='/'
          className='relative z-20 flex shrink-0 items-center gap-2 px-6 pt-6 transition-opacity hover:opacity-80 sm:absolute sm:top-8 sm:left-8 sm:px-0 sm:pt-0'
        >
          <div className='relative h-8 w-8'>
            {loading ? (
              <Skeleton className='absolute inset-0 rounded-full' />
            ) : (
              <img
                src={logo}
                alt={t('Logo')}
                className='h-8 w-8 rounded-full object-cover'
              />
            )}
          </div>
          {loading ? (
            <Skeleton className='h-6 w-24' />
          ) : (
            <h1 className='text-xl font-medium'>{systemName}</h1>
          )}
        </Link>
        <div className='container flex flex-1 flex-col justify-center pb-12 pt-4 sm:items-center sm:pb-24 sm:pt-[4.75rem]'>
          <div className='mx-auto flex w-full max-w-[480px] flex-col justify-center rounded-[20px] bg-white/95 px-6 py-10 shadow-xl shadow-indigo-200/35 backdrop-blur-[2px] sm:w-[480px] sm:px-10 sm:py-12 dark:bg-card/95 dark:shadow-black/35'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
