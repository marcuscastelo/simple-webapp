import { createSignal } from 'solid-js'

import { useStringSearchParam } from '~/modules/common/hooks/useStringSearchParam'

/**
 * Hook for managing user coordinates from URL parameters.
 * Reads lat/lng from URL query params and provides signals for reactive updates.
 * @returns Object with lat/lng signals and setters
 */
export function useCoordinatesFromUrl() {
  const [getLatParam] = useStringSearchParam('lat')
  const [getLngParam] = useStringSearchParam('lng')

  // Initialize from URL params
  const latFromUrl = getLatParam()
  const lngFromUrl = getLngParam()

  const [userLat, setUserLat] = createSignal<number | null>(
    latFromUrl ? parseFloat(latFromUrl) : null,
  )
  const [userLng, setUserLng] = createSignal<number | null>(
    lngFromUrl ? parseFloat(lngFromUrl) : null,
  )

  return {
    userLat,
    setUserLat,
    userLng,
    setUserLng,
  }
}
