import { useMapsLibrary } from 'solid-google-maps'
import { createEffect, createResource, createSignal, Suspense } from 'solid-js'

import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useGoogleMapsScript } from '~/hooks/useGoogleMapsScript'
import { useGooglePlacesAutocomplete } from '~/hooks/useGooglePlacesAutocomplete'

import { AutocompleteDropdown } from './AutocompleteDropdown'
import { SearchInput } from './SearchInput'

export type SearchPillProps = {
  onUseLocationClick?: () => void
  onSearch?: (query: string) => void
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void
}
/**
 * Search pill component with Google Places autocomplete.
 *
 * @param props - Component props
 * @returns Search pill UI with autocomplete functionality
 */
export function SearchPill(props: SearchPillProps) {
  const placesLibrary = useMapsLibrary('places')
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const fallbackScriptLoaded = useGoogleMapsScript(apiKey)

  const [query, setQuery] = createSignal('')
  const [debouncedQuery, setDebouncedQuery] = useDebouncedValue('', 300)
  const [isOpen, setIsOpen] = createSignal(false)
  const [selectedPrediction, setSelectedPrediction] =
    createSignal<google.maps.places.AutocompletePrediction | null>(null)
  const [placesService, setPlacesService] =
    createSignal<google.maps.places.PlacesService | null>(null)

  const [inputRef, setInputRef] = createSignal<HTMLInputElement | null>(null)

  const isReady = () => Boolean(placesLibrary()) || fallbackScriptLoaded()

  const { predictions, loading } = useGooglePlacesAutocomplete({
    isReady,
    query: debouncedQuery,
  })

  createEffect(() => {
    const newQuery = query()
    if (newQuery !== debouncedQuery()) {
      setDebouncedQuery(newQuery)
    }
  })

  createEffect(() => {
    if (!isReady()) return

    const globalWithGoogle = globalThis as unknown as {
      google?: {
        maps?: {
          places?: {
            PlacesService: new (
              container: HTMLDivElement,
            ) => google.maps.places.PlacesService
          }
        }
      }
    }

    if (!globalWithGoogle.google?.maps?.places) {
      console.warn('Google Maps Places API not available')
      return
    }

    const hiddenContainer = document.createElement('div')
    setPlacesService(new google.maps.places.PlacesService(hiddenContainer))
  })

  const [placeDetails] = createResource(
    () => ({
      service: placesService(),
      placeId: selectedPrediction()?.place_id,
    }),
    async (params) => {
      const { service, placeId } = params
      if (!placeId || !service) return null

      try {
        const response =
          await new Promise<google.maps.places.PlaceResult | null>(
            (resolve, reject) => {
              service.getDetails({ placeId }, (result, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  resolve(result)
                } else {
                  reject(new Error(`Places service error: ${status}`))
                }
              })
            },
          )

        return response
      } catch (err) {
        console.warn('Error fetching place details', err)
        return null
      }
    },
    { initialValue: null },
  )

  createEffect(() => {
    const details = placeDetails()
    if (details) {
      props.onPlaceSelected?.(details)
    }
  })

  const handleSelectPrediction = (
    prediction: google.maps.places.AutocompletePrediction,
  ) => {
    setQuery(prediction.structured_formatting.main_text)
    setSelectedPrediction(prediction)
    setIsOpen(false)
    setTimeout(() => {
      inputRef()?.blur()
    }, 0)
  }

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  const handleFocus = () => {
    setIsOpen(true)
  }

  return (
    <div class="flex-1 mx-4 min-w-0 relative">
      <SearchInput
        value={query}
        onInput={setQuery}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onUseLocationClick={props.onUseLocationClick}
        onSearch={props.onSearch}
        ref={setInputRef}
      />

      <Suspense fallback={null}>
        <AutocompleteDropdown
          isOpen={isOpen}
          query={query}
          predictions={predictions}
          loading={loading}
          onSelectPrediction={handleSelectPrediction}
        />
      </Suspense>
    </div>
  )
}
