import { Maximize, Minimize } from 'lucide-solid'
import { Accessor, Setter, Show } from 'solid-js'

import { Card } from '~/components/ui/card'
import { SearchPill } from '~/modules/common/sections/SearchPill/SearchPill'
import { CollectionPointsMap } from '~/modules/map/sections/CollectionPointsMap'
import { cn } from '~/utils/cn'

interface MapContainerProps {
  placeId: Accessor<string | null>
  search: Accessor<string | null>
  userLat: Accessor<number | null>
  userLng: Accessor<number | null>
  isFullscreen: Accessor<boolean>
  onSearchChange: Setter<string | null>
  onPlaceSelected: Setter<string | null>
  onLocationSelect: (lat: number, lng: number) => void
  onFullscreenToggle: Setter<boolean>
}

/**
 * Container component for the collection points map.
 * Includes fullscreen toggle and search overlay functionality.
 */
export function MapContainer(props: MapContainerProps) {
  const isFullscreen = () => props.isFullscreen()

  return (
    <Card
      class={cn(
        'mb-8 shadow-lg overflow-hidden h-[400px] transition-all duration-300 ease-in-out relative',
        {
          'h-screen w-screen fixed inset-0 rounded-none z-50': isFullscreen(),
        },
      )}
    >
      {/* Toggle fullscreen button (overlay on right) */}
      <div class="absolute top-3 right-3 z-60">
        <button
          class="inline-flex items-center gap-2 rounded-md bg-base-100/80 px-2 py-1 text-sm shadow hover:brightness-95 transition"
          onClick={() => props.onFullscreenToggle((v) => !v)}
          aria-pressed={isFullscreen()}
          aria-label={isFullscreen() ? 'Exit fullscreen' : 'Open fullscreen'}
        >
          {isFullscreen() ? (
            <Minimize class="h-4 w-4" />
          ) : (
            <Maximize class="h-4 w-4" />
          )}
          <span class="hidden sm:inline">
            {isFullscreen() ? 'Close' : 'Fullscreen'}
          </span>
        </button>
      </div>

      <Show when={isFullscreen()}>
        {/* Search bar (overlay on left) */}
        <div class="absolute top-3 left-3 z-60">
          <SearchPill
            onSearch={props.onSearchChange}
            onPlaceSelected={props.onPlaceSelected}
            onUseLocationClick={props.onLocationSelect}
          />
        </div>
      </Show>

      <CollectionPointsMap
        placeId={props.placeId()}
        search={props.search()}
        lat={props.userLat()}
        lng={props.userLng()}
      />
    </Card>
  )
}
