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
import { useCallback, useState } from 'react'
import { ArrowUpDown, Check, Filter, Grid2X2, Table2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  VIEW_MODES,
  getSortLabels,
  type ContextMinFilterKey,
  type SortOption,
  type ViewMode,
} from '../constants'
import type { ModelMetadata } from '../lib/model-metadata'
import type { Modality, PricingModel, PricingVendor } from '../types'
import { PricingSidebar } from './pricing-sidebar'
import { SearchBar } from './search-bar'

type SegmentOption = {
  value: string
  label?: string
  icon?: React.ComponentType<{ className?: string }>
  tooltip?: string
}

export interface PricingToolbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchClear: () => void
  searchPlaceholder?: string
  filteredCount: number
  totalCount?: number
  sortBy: string
  onSortChange: (value: string) => void
  viewMode: ViewMode
  onViewModeChange: (value: ViewMode) => void
  quotaTypeFilter: string
  endpointTypeFilter: string
  vendorFilter: string
  groupFilter: string
  tagFilter: string
  onQuotaTypeChange: (value: string) => void
  onEndpointTypeChange: (value: string) => void
  onVendorChange: (value: string) => void
  onGroupChange: (value: string) => void
  onTagChange: (value: string) => void
  vendors: PricingVendor[]
  groups: string[]
  groupRatios?: Record<string, number>
  tags: string[]
  models: PricingModel[]
  metadataByName: Map<string, ModelMetadata>
  selectedModalities: Modality[]
  onModalityToggle: (m: Modality) => void
  contextMinFilter: ContextMinFilterKey
  onContextMinChange: (k: ContextMinFilterKey) => void
  hasActiveFilters: boolean
  activeFilterCount: number
  onClearFilters: () => void
}

/** Matches {@link SearchBar} input (`h-10`). */
const TOOLBAR_CONTROL_H = 'h-10 min-h-10'

function SortViewCluster(props: {
  sortLabels: ReturnType<typeof getSortLabels>
  sortBy: string
  onSortChange: (value: string) => void
  viewMode: ViewMode
  onViewModeChange: (value: string) => void
  className?: string
}) {
  const { t } = useTranslation()

  return (
    <div className={cn('flex shrink-0 items-center gap-2', props.className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type='button'
              variant='outline'
              className={cn(
                TOOLBAR_CONTROL_H,
                'gap-1.5 bg-background px-3 text-sm shadow-xs'
              )}
            />
          }
        >
          <ArrowUpDown className='size-3.5' />
          <span>
            {props.sortLabels[props.sortBy as SortOption] || t('Sort')}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          {Object.entries(props.sortLabels).map(([value, label]) => (
            <DropdownMenuItem
              key={value}
              onClick={() => props.onSortChange(value)}
              className='gap-2'
            >
              <Check
                className={cn(
                  'size-4 shrink-0',
                  props.sortBy === value ? 'opacity-100' : 'opacity-0'
                )}
              />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <SegmentedControl
        options={[
          {
            value: VIEW_MODES.CARD,
            icon: Grid2X2,
            tooltip: t('Card view'),
          },
          {
            value: VIEW_MODES.TABLE,
            icon: Table2,
            tooltip: t('Table view'),
          },
        ]}
        value={props.viewMode}
        onChange={props.onViewModeChange}
        ariaLabel={t('View mode')}
      />
    </div>
  )
}

function SegmentedControl(props: {
  options: SegmentOption[]
  value: string
  onChange: (value: string) => void
  ariaLabel: string
}) {
  return (
    <div
      role='group'
      aria-label={props.ariaLabel}
      className='bg-muted/60 inline-flex h-10 items-center rounded-lg border p-0.5'
    >
      {props.options.map((option) => {
        const Icon = option.icon
        const isActive = option.value === props.value
        const button = (
          <button
            key={option.value}
            type='button'
            onClick={() => props.onChange(option.value)}
            aria-pressed={isActive}
            className={cn(
              'inline-flex h-full min-h-0 items-center justify-center rounded-md text-xs font-medium transition-all',
              Icon && !option.label ? 'w-9' : 'gap-1.5 px-3',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {Icon && <Icon className='size-3.5' />}
            {option.label}
          </button>
        )

        if (!option.tooltip) {
          return button
        }

        return (
          <Tooltip key={option.value}>
            <TooltipTrigger render={button}></TooltipTrigger>
            <TooltipContent side='bottom' className='text-xs'>
              {option.tooltip}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}

export function PricingToolbar(props: PricingToolbarProps) {
  const { t } = useTranslation()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const sortLabels = getSortLabels(t)

  const handleViewModeChange = useCallback(
    (value: string) => props.onViewModeChange(value as ViewMode),
    [props]
  )

  const modelCount = (
    <div className='text-muted-foreground flex items-baseline gap-1 text-sm'>
      <span className='text-foreground font-semibold tabular-nums'>
        {props.filteredCount.toLocaleString()}
      </span>
      <span>{props.filteredCount === 1 ? t('model') : t('models')}</span>
      {props.hasActiveFilters && props.totalCount && (
        <span className='text-muted-foreground/60 text-xs'>
          / {props.totalCount.toLocaleString()}
        </span>
      )}
    </div>
  )

  return (
    <div className='rounded-xl'>
      <div className='flex flex-col gap-3 lg:hidden'>
        <div className='flex w-full min-w-0 items-center justify-between gap-2'>
          <div className='text-foreground flex min-w-0 flex-1 flex-row flex-wrap items-center gap-2'>
            <h2 className='shrink-0 text-2xl font-semibold tracking-tight'>
              {t('Model Square')}
            </h2>
            {modelCount}
          </div>
          <div className='flex shrink-0 items-center gap-1'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setMobileFiltersOpen(true)}
              className={cn(TOOLBAR_CONTROL_H, 'gap-1.5 px-3 xl:hidden')}
            >
              <Filter className='size-4' />
              {t('Filter')}
              {props.activeFilterCount > 0 && (
                <Badge className='ml-0.5 size-5 justify-center rounded-full p-0 text-[10px]'>
                  {props.activeFilterCount}
                </Badge>
              )}
            </Button>
            <SortViewCluster
              sortLabels={sortLabels}
              sortBy={props.sortBy}
              onSortChange={props.onSortChange}
              viewMode={props.viewMode}
              onViewModeChange={handleViewModeChange}
            />
          </div>
        </div>

        <SearchBar
          value={props.searchValue}
          onChange={props.onSearchChange}
          onClear={props.onSearchClear}
          placeholder={props.searchPlaceholder}
          className='w-full min-w-0'
        />
      </div>

      <div className='hidden gap-x-4 gap-y-3 lg:flex lg:flex-wrap lg:items-center lg:justify-between'>
        <div className='text-foreground flex min-w-0 shrink-0 flex-row flex-wrap items-center gap-2'>
          <h2 className='text-2xl font-semibold tracking-tight lg:text-2xl'>
            {t('Model Square')}
          </h2>
          {modelCount}
        </div>

        {/* Search + filter/sort/view: compact group aligned to the right; wraps below title as one unit */}
        <div className='flex max-w-full shrink-0 flex-wrap items-center justify-end gap-2 lg:ml-auto'>
          <SearchBar
            value={props.searchValue}
            onChange={props.onSearchChange}
            onClear={props.onSearchClear}
            placeholder={props.searchPlaceholder}
            className='w-[380px] max-w-full shrink-0'
          />
          <div className='flex shrink-0 items-center gap-1'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setMobileFiltersOpen(true)}
              className={cn(
                TOOLBAR_CONTROL_H,
                'hidden shrink-0 gap-1.5 px-3 lg:inline-flex xl:hidden'
              )}
            >
              <Filter className='size-4' />
              {t('Filter')}
              {props.activeFilterCount > 0 && (
                <Badge className='ml-0.5 size-5 justify-center rounded-full p-0 text-[10px]'>
                  {props.activeFilterCount}
                </Badge>
              )}
            </Button>
            <SortViewCluster
              sortLabels={sortLabels}
              sortBy={props.sortBy}
              onSortChange={props.onSortChange}
              viewMode={props.viewMode}
              onViewModeChange={handleViewModeChange}
            />
          </div>
        </div>
      </div>

      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent
          side='right'
          className='flex h-dvh w-full flex-col overflow-hidden p-0 sm:max-w-md'
        >
          <SheetHeader className='border-b px-4 py-3 sm:px-6 sm:py-4'>
            <SheetTitle>{t('Filter')}</SheetTitle>
            <SheetDescription>
              {t(
                'Filter models by input method, context length, provider, group, endpoint, and tags.'
              )}
            </SheetDescription>
          </SheetHeader>
          <div className='flex-1 overflow-y-auto p-3 sm:p-4'>
            <PricingSidebar
              quotaTypeFilter={props.quotaTypeFilter}
              endpointTypeFilter={props.endpointTypeFilter}
              vendorFilter={props.vendorFilter}
              groupFilter={props.groupFilter}
              tagFilter={props.tagFilter}
              onQuotaTypeChange={props.onQuotaTypeChange}
              onEndpointTypeChange={props.onEndpointTypeChange}
              onVendorChange={props.onVendorChange}
              onGroupChange={props.onGroupChange}
              onTagChange={props.onTagChange}
              vendors={props.vendors}
              groups={props.groups}
              groupRatios={props.groupRatios}
              tags={props.tags}
              models={props.models}
              metadataByName={props.metadataByName}
              selectedModalities={props.selectedModalities}
              onModalityToggle={props.onModalityToggle}
              contextMinFilter={props.contextMinFilter}
              onContextMinChange={props.onContextMinChange}
              hasActiveFilters={props.hasActiveFilters}
              onClearFilters={props.onClearFilters}
              className='border-0 bg-transparent p-0 shadow-none'
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
