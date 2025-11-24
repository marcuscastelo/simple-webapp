import {
  AdvancedMarker,
  InfoWindow,
  Map,
  useMapsLibrary,
} from 'solid-google-maps'
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  onCleanup,
  Show,
} from 'solid-js'

export const AutocompleteMap: Component = () => {
  const placesLibary = useMapsLibrary('places')

  const [map, setMap] = createSignal<google.maps.Map | null>(null)
  const [sessionToken, setSessionToken] =
    createSignal<google.maps.places.AutocompleteSessionToken>()
  const [autocompleteService, setAutocompleteService] =
    createSignal<google.maps.places.AutocompleteService | null>(null)
  const [placesService, setPlacesService] =
    createSignal<google.maps.places.PlacesService | null>(null)
  const [inputValue] = createSignal<string>('Santos')
  const [infowindowOpen, setInfowindowOpen] = createSignal(true)
  const [selected] =
    createSignal<google.maps.places.AutocompletePrediction | null>(null)

  createEffect(() => {
    if (!map() || !placesLibary()) return

    setSessionToken(new google.maps.places.AutocompleteSessionToken())
    setAutocompleteService(new google.maps.places.AutocompleteService())
    setPlacesService(new google.maps.places.PlacesService(map()!))

    onCleanup(() => {
      setAutocompleteService(null)
    })
  })

  const [results] = createResource(
    () => ({
      service: autocompleteService(),
      value: inputValue(),
    }),
    async ({ service, value }) => {
      if (!value || !service) return []

      const response = await service.getPlacePredictions({
        input: value,
        sessionToken: sessionToken(),
      })

      return response.predictions
    },
    { initialValue: [] },
  )

  const [placeDetails] = createResource(
    () => (placesService() && selected() ? selected()!.place_id : undefined),
    async (placeId) => {
      if (!placeId) return

      const response = await new Promise<google.maps.places.PlaceResult | null>(
        (resolve, reject) =>
          placesService()?.getDetails({ placeId }, (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              resolve(result)
            } else {
              reject(new Error(`Failed to get place details: ${status}`))
            }
          }),
      )

      return response
    },
    { initialValue: null },
  )

  createEffect(() => {
    if (!placeDetails.latest?.geometry?.location) return
    map()?.setCenter(placeDetails()!.geometry!.location!.toJSON())
    map()?.setZoom(15)
    setInfowindowOpen(true)
  })

  return (
    <>
      <Map
        ref={setMap}
        style={{ height: '500px', width: '100%' }}
        mapId="DEMO_MAP_ID"
        defaultZoom={3}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        <Show when={placeDetails.latest}>
          {(placeDetails) => (
            <AdvancedMarker
              position={placeDetails().geometry!.location}
              onClick={() => setInfowindowOpen(true)}
            >
              <InfoWindow
                minWidth={250}
                maxWidth={250}
                open={infowindowOpen()}
                onOpenChange={setInfowindowOpen}
              >
                <div class="flex flex-col gap-4">
                  <div class="flex flex-col">
                    <span class="font-semibold mb-1">
                      {placeDetails().name}
                    </span>
                    <span class="text-sm">
                      {placeDetails().formatted_address}
                    </span>
                    <span class="text-sm">{placeDetails().website}</span>
                  </div>
                  <Show when={placeDetails().rating}>
                    <div class="flex justify-between">
                      <span class="text-sm">
                        Rating: {placeDetails().rating}
                      </span>
                      <span class="text-sm">
                        Total Ratings: {placeDetails().user_ratings_total}
                      </span>
                    </div>
                  </Show>
                </div>
              </InfoWindow>
            </AdvancedMarker>
          )}
        </Show>
      </Map>
      <div class="absolute top-4 left-1/2 -translate-x-1/2">
        <Show when={results.latest.length > 0}>
          <For each={results.latest}>
            {(option) => {
              return (
                <div class="flex flex-col">
                  <span class="font-semibold">
                    {option.structured_formatting.main_text}
                  </span>
                  <span class="text-sm">
                    {option.structured_formatting.secondary_text}
                  </span>
                </div>
              )
            }}
          </For>
        </Show>
      </div>
    </>
  )
}
