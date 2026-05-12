import type { CurrencyFormatOptions } from '@/lib/currency'

const DEFAULT_OPTS: Required<CurrencyFormatOptions> = {
  digitsLarge: 2,
  digitsSmall: 4,
  abbreviate: true,
  minimumNonZero: 0,
}

function mergeOptions(
  options?: CurrencyFormatOptions
): Required<CurrencyFormatOptions> {
  if (!options) return DEFAULT_OPTS
  return {
    digitsLarge: options.digitsLarge ?? DEFAULT_OPTS.digitsLarge,
    digitsSmall: options.digitsSmall ?? DEFAULT_OPTS.digitsSmall,
    abbreviate: options.abbreviate ?? DEFAULT_OPTS.abbreviate,
    minimumNonZero: options.minimumNonZero ?? DEFAULT_OPTS.minimumNonZero,
  }
}

function adjustForMinimum(
  value: number,
  digits: number,
  minimumNonZero: number
): number {
  if (value === 0) return value
  const threshold = minimumNonZero > 0 ? minimumNonZero : Math.pow(10, -digits)
  const abs = Math.abs(value)
  if (abs > 0 && abs < threshold) {
    return value > 0 ? threshold : -threshold
  }
  return value
}

/**
 * Format a pricing scalar for the model square / pricing tables.
 * Does not apply global quota display conversion (no USD→CNY multiply).
 * Domestic → ¥, foreign → $, same numeric magnitude as the billing formula output.
 */
export function formatPricingCurrencyAmount(
  amount: number,
  domestic: boolean,
  options?: CurrencyFormatOptions
): string {
  if (!Number.isFinite(amount)) return '-'

  const merged = mergeOptions(options)
  const digits =
    Math.abs(amount) >= 1 ? merged.digitsLarge : merged.digitsSmall
  const adjusted = adjustForMinimum(amount, digits, merged.minimumNonZero)

  const currencyCode = domestic ? 'CNY' : 'USD'
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(adjusted)
}
