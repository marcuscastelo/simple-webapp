import { Crosshair as CrosshairIcon, Search as SearchIcon } from 'lucide-solid'
import { useMapsLibrary } from 'solid-google-maps'
import {
  createEffect,
  createResource,
  createSignal,
  For,
  onCleanup,
  Show,
} from 'solid-js'

export type SearchPillProps = {
  onUseLocationClick?: () => void
  onSearch?: (query: string) => void
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void
  map?: google.maps.Map | null
}

export function SearchPill(props: SearchPillProps) {
  const placesLibrary = useMapsLibrary('places')

  const [query, setQuery] = createSignal('')
  const [sessionToken, setSessionToken] =
    createSignal<google.maps.places.AutocompleteSessionToken>()
  const [autocompleteService, setAutocompleteService] =
    createSignal<google.maps.places.AutocompleteService | null>(null)
  const [placesService, setPlacesService] =
    createSignal<google.maps.places.PlacesService | null>(null)
  const [isOpen, setIsOpen] = createSignal(false)
  const [selectedPrediction, setSelectedPrediction] =
    createSignal<google.maps.places.AutocompletePrediction | null>(null)

  let inputRef: HTMLInputElement | undefined

  createEffect(() => {
    if (!props.map || !placesLibrary()) return

    setSessionToken(new google.maps.places.AutocompleteSessionToken())
    setAutocompleteService(new google.maps.places.AutocompleteService())
    setPlacesService(new google.maps.places.PlacesService(props.map))

    onCleanup(() => {
      setAutocompleteService(null)
    })
  })

  const [predictions] = createResource(
    () => ({
      service: autocompleteService(),
      value: query(),
    }),
    async (params) => {
      const { service, value } = params
      if (!value || !service) {
        return []
      }

      try {
        const response = await service.getPlacePredictions({
          input: value,
          sessionToken: sessionToken(),
        })
        return response.predictions
      } catch (error) {
        alert(`Error fetching predictions: ${error as string}`)
        return []
      }
    },
    { initialValue: [] },
  )

  const [placeDetails] = createResource(
    () =>
      placesService() && selectedPrediction()
        ? selectedPrediction()!.place_id
        : undefined,
    async (placeId) => {
      if (!placeId) return null

      try {
        const response =
          await new Promise<google.maps.places.PlaceResult | null>(
            (resolve, reject) => {
              const service = placesService()
              if (!service) {
                reject(new Error('Places service not available'))
                return
              }
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
      } catch {
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
      inputRef?.blur()
    }, 0)
  }

  const handleBlur = () => {
    // Delay to allow click events on suggestions
    setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  const handleFocus = () => {
    setIsOpen(true)
  }

  return (
    <div class="flex-1 mx-4 min-w-0 relative">
      <div class="flex items-center bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm">
        <button
          class="p-1 rounded-full hover:bg-gray-100 text-muted-foreground mr-2"
          onClick={() => props.onUseLocationClick?.()}
          aria-label="Use my location"
          title="Usar minha localização"
          disabled={!props.onUseLocationClick}
        >
          <CrosshairIcon class="h-4 w-4" />
        </button>
        <input
          ref={inputRef}
          value={query()}
          onInput={(e) => setQuery(e.currentTarget.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Pesquisar pontos de recolha"
          class="outline-none bg-transparent text-sm flex-1"
        />
        <Show when={props.onSearch}>
          <button
            class="ml-3 bg-primary text-black rounded-full p-2 hover:opacity-95"
            onClick={() => props.onSearch?.(query())}
            aria-label="search"
          >
            <SearchIcon class="h-4 w-4" />
          </button>
        </Show>
      </div>

      {/* Autocomplete dropdown */}
      <Show when={isOpen() && query().length > 0}>
        <div class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
          <Show
            when={!predictions.loading && predictions().length === 0}
            fallback={
              <Show when={predictions.loading}>
                <div class="px-4 py-3 text-sm text-gray-500">Carregando...</div>
              </Show>
            }
          >
            <div class="px-4 py-3 text-sm text-gray-500">
              Nenhum resultado encontrado
            </div>
          </Show>

          <Show when={predictions().length > 0}>
            <ul class="py-1">
              <For each={predictions()}>
                {(prediction) => (
                  <li>
                    <button
                      type="button"
                      class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={() => handleSelectPrediction(prediction)}
                    >
                      <div class="flex flex-col">
                        <span class="font-medium text-sm text-gray-900">
                          {prediction.structured_formatting.main_text}
                        </span>
                        <span class="text-xs text-gray-500">
                          {prediction.structured_formatting.secondary_text}
                        </span>
                      </div>
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </Show>
        </div>
      </Show>
    </div>
  )
}
