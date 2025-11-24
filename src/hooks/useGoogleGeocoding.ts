import { useMapsLibrary } from 'solid-google-maps'
import { type Accessor, createEffect, createSignal } from 'solid-js'

import { useGoogleMapsScript } from './useGoogleMapsScript'

/**
 * Options for the useGoogleGeocoding hook.
 */
export type GoogleGeocodingOptions = {
  /**
   * Optional map reference. If provided, ensures the geocoder is initialized
   * after the map is ready (useful for consistency).
   * If not provided, the geocoder will be initialized independently.
   */
  mapRef?: Accessor<google.maps.Map | null>

  /**
   * Google Maps API key (required only if not using solid-google-maps APIProvider).
   */
  apiKey?: string
}

/**
 * Result from the useGoogleGeocoding hook.
 */
export type GoogleGeocodingResult = {
  /**
   * Geocoder instance.
   */
  geocoder: Accessor<google.maps.Geocoder | null>

  /**
   * Whether the geocoder is ready to use.
   */
  isReady: Accessor<boolean>
}

/**
 * Hook for Google Geocoding Service.
 *
 * Can be used with or without a map reference:
 * - With map: Ensures geocoder is initialized after map is ready
 * - Without map: Initializes geocoder independently (e.g., in Navbar)
 *
 * @param options - Configuration options
 * @returns Geocoder instance and ready state
 *
 * @example
 * // With map (inside APIProvider on collection-points page)
 * const { geocoder } = useGoogleGeocoding({ mapRef })
 *
 * @example
 * // Without map (standalone in Navbar)
 * const { geocoder } = useGoogleGeocoding({
 *   apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
 * })
 */
export function useGoogleGeocoding(
  options: GoogleGeocodingOptions = {},
): GoogleGeocodingResult {
  const geocodingLibrary = useMapsLibrary('geocoding')
  // Only load script if we're NOT using a map ref and have an apiKey
  const fallbackScriptLoaded = useGoogleMapsScript(
    options.mapRef ? undefined : options.apiKey,
  )

  const [geocoder, setGeocoder] = createSignal<google.maps.Geocoder | null>(
    null,
  )

  const isReady = () => {
    // If we have a mapRef, we're inside APIProvider - wait for the map
    if (options.mapRef) {
      return Boolean(options.mapRef())
    }
    // Otherwise, use the fallback script loading
    return Boolean(geocodingLibrary()) || fallbackScriptLoaded()
  }

  createEffect(() => {
    // Explicitly track mapRef if provided to ensure effect re-runs
    const map = options.mapRef?.()
    // Also track geocodingLibrary to re-run when it loads
    const geocodingLib = geocodingLibrary()

    console.log('[useGoogleGeocoding] Effect running', {
      isReady: isReady(),
      geocodingLibrary: Boolean(geocodingLib),
      fallbackScriptLoaded: fallbackScriptLoaded(),
      hasMapRef: Boolean(options.mapRef),
      map: map,
    })

    // When using mapRef, wait for BOTH map AND geocoding library
    if (options.mapRef) {
      if (!map) {
        console.log('[useGoogleGeocoding] Waiting for map')
        return
      }
      if (!geocodingLib) {
        console.log('[useGoogleGeocoding] Waiting for geocoding library')
        return
      }
      console.log('[useGoogleGeocoding] Map and geocoding library ready')
    } else {
      // Without mapRef, use the original isReady check
      if (!isReady()) {
        console.log('[useGoogleGeocoding] Not ready yet')
        return
      }
    }

    const globalWithGoogle = globalThis as unknown as {
      google?: {
        maps?: {
          Geocoder: new () => google.maps.Geocoder
        }
      }
    }

    if (!globalWithGoogle.google?.maps?.Geocoder) {
      console.warn(
        '[useGoogleGeocoding] Google Maps Geocoding API not available yet, will retry',
      )
      return
    }

    console.log('[useGoogleGeocoding] Creating geocoder instance')
    setGeocoder(new google.maps.Geocoder())
  })

  return {
    geocoder,
    isReady,
  }
}
