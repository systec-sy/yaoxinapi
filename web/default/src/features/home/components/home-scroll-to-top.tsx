import { useCallback, useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SCROLL_SHOW_AFTER_PX = 400

export function HomeScrollToTop() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_SHOW_AFTER_PX)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = useCallback(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? 'auto' : 'smooth',
    })
  }, [])

  return (
    <Button
      type='button'
      variant='default'
      size='icon-lg'
      aria-label={t('Back to top')}
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
      onClick={scrollTop}
      className={cn(
        'fixed right-6 bottom-8 z-50 size-11 rounded-full shadow-lg md:right-8 md:bottom-10',
        'transition-[opacity,transform] duration-200 motion-reduce:transition-none',
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0'
      )}
    >
      <ChevronUp className='size-5' aria-hidden />
    </Button>
  )
}
