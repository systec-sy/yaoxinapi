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
import { useTranslation } from 'react-i18next'
import { FcGoogle } from 'react-icons/fc'
import {
  SiDiscord,
  SiGitea,
  SiGithub,
  SiGitlab,
  SiGmail,
  SiTelegram,
} from 'react-icons/si'
import { IconLinuxDo, IconWeChat } from '@/assets/brand-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useOAuthLogin } from '../hooks/use-oauth-login'
import type { SystemStatus } from '../types'

type OAuthProvidersProps = {
  status: SystemStatus | null
  disabled?: boolean
  className?: string
  onWeChatLogin?: () => void
  isWeChatLoading?: boolean
}

type ProviderButton = {
  key: string
  label: string
  onClick: () => void
  icon?: ReactNode
  disabled?: boolean
}

const iconWrap = 'inline-flex shrink-0 items-center justify-center'

function GoogleColorIcon() {
  return (
    <span className={cn(iconWrap, 'h-5 w-5')} aria-hidden>
      <FcGoogle className='h-full w-full' />
    </span>
  )
}

function GitHubColorIcon() {
  return (
    <span
      className={cn(iconWrap, 'text-[#181717] dark:text-white')}
      aria-hidden
    >
      <SiGithub className='h-[18px] w-[18px]' />
    </span>
  )
}

function DiscordColorIcon() {
  return (
    <span className={cn(iconWrap, 'text-[#5865F2]')} aria-hidden>
      <SiDiscord className='h-[18px] w-[18px]' />
    </span>
  )
}

function GitLabColorIcon() {
  return (
    <span className={cn(iconWrap, 'text-[#FC6D26]')} aria-hidden>
      <SiGitlab className='h-[18px] w-[18px]' />
    </span>
  )
}

function GiteaColorIcon() {
  return (
    <span className={cn(iconWrap, 'text-[#609926]')} aria-hidden>
      <SiGitea className='h-[18px] w-[18px]' />
    </span>
  )
}

function GmailColorIcon() {
  return (
    <span className={cn(iconWrap, 'text-[#EA4335]')} aria-hidden>
      <SiGmail className='h-[18px] w-[18px]' />
    </span>
  )
}

function WeChatColorIcon() {
  return (
    <span className={cn(iconWrap, 'text-[#07C160]')} aria-hidden>
      <IconWeChat className='h-[18px] w-[18px]' />
    </span>
  )
}

function TelegramColorIcon() {
  return (
    <span className={cn(iconWrap, 'text-[#26A5E4]')} aria-hidden>
      <SiTelegram className='h-[18px] w-[18px]' />
    </span>
  )
}

function customOAuthButtonIcon(
  icon: string | undefined,
  slug: string
): ReactNode | undefined {
  const key = (icon?.trim() || slug.trim()).toLowerCase()
  switch (key) {
    case 'google':
      return <GoogleColorIcon />
    case 'gmail':
      return <GmailColorIcon />
    case 'github':
      return <GitHubColorIcon />
    case 'gitlab':
      return <GitLabColorIcon />
    case 'gitea':
      return <GiteaColorIcon />
    case 'discord':
      return <DiscordColorIcon />
    default:
      return undefined
  }
}

export function OAuthProviders({
  status,
  disabled = false,
  className,
  onWeChatLogin,
  isWeChatLoading = false,
}: OAuthProvidersProps) {
  const { t } = useTranslation()
  const {
    isLoading,
    githubButtonText,
    githubButtonDisabled,
    handleGitHubLogin,
    handleDiscordLogin,
    handleOIDCLogin,
    handleLinuxDOLogin,
    handleTelegramLogin,
    handleCustomOAuthLogin,
  } = useOAuthLogin(status)

  const providerButtons: ProviderButton[] = []

  if (status?.wechat_login && onWeChatLogin) {
    providerButtons.push({
      key: 'wechat',
      label: t('Continue with WeChat'),
      onClick: onWeChatLogin,
      icon: <WeChatColorIcon />,
      disabled: isWeChatLoading,
    })
  }

  if (status?.github_oauth) {
    providerButtons.push({
      key: 'github',
      label: githubButtonText || t('Continue with GitHub'),
      onClick: handleGitHubLogin,
      icon: <GitHubColorIcon />,
      disabled: githubButtonDisabled,
    })
  }

  if (status?.discord_oauth) {
    providerButtons.push({
      key: 'discord',
      label: t('Continue with Discord'),
      onClick: handleDiscordLogin,
      icon: <DiscordColorIcon />,
    })
  }

  if (status?.oidc_enabled) {
    providerButtons.push({
      key: 'oidc',
      label: t('Continue with OIDC'),
      onClick: handleOIDCLogin,
    })
  }

  if (status?.linuxdo_oauth) {
    providerButtons.push({
      key: 'linuxdo',
      label: t('Continue with LinuxDO'),
      onClick: handleLinuxDOLogin,
      icon: (
        <span className={cn(iconWrap, 'h-[18px] w-[18px]')} aria-hidden>
          <IconLinuxDo className='h-full w-full' />
        </span>
      ),
    })
  }

  if (status?.telegram_oauth) {
    providerButtons.push({
      key: 'telegram',
      label: t('Continue with Telegram'),
      onClick: handleTelegramLogin,
      icon: <TelegramColorIcon />,
    })
  }

  // Custom OAuth providers
  const customProviders = status?.custom_oauth_providers
  if (customProviders && customProviders.length > 0) {
    for (const provider of customProviders) {
      providerButtons.push({
        key: `custom-${provider.slug}`,
        label: t('Continue with {{name}}', { name: provider.name }),
        onClick: () => handleCustomOAuthLogin(provider),
        icon: customOAuthButtonIcon(provider.icon, provider.slug),
      })
    }
  }

  if (providerButtons.length === 0) return null

  return (
    <div className={cn('space-y-4', className)}>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-gray-200 dark:border-border' />
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='bg-white px-3 text-gray-500 dark:bg-card dark:text-muted-foreground'>
            {t('Or continue with')}
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-3'>
        {providerButtons.map(
          ({ key, label, onClick, icon, disabled: extraDisabled }) => (
            <Button
              key={key}
              variant='outline'
              type='button'
              disabled={disabled || isLoading || extraDisabled}
              onClick={onClick}
              className='h-11 w-full justify-center gap-2 rounded-lg border-gray-200 bg-white font-medium text-gray-800 shadow-none hover:bg-gray-50 dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-muted/50'
            >
              {icon}
              {label}
            </Button>
          )
        )}
      </div>
    </div>
  )
}
