import { Marker } from '@googlemaps/markerclusterer'
import { scheduleIdle } from '@solid-primitives/scheduled'
import { AdvancedMarker, APIProvider, InfoWindow, Map } from 'solid-google-maps'
import { createEffect, createMemo, createSignal, For, Show } from 'solid-js'

import { ClusteredMarkers } from '~/components/ClusteredMarkers'
import * as POI from '~/poi.json'
import { API_KEY, MAP_ID } from '~/utils/env'

// eslint-disable-next-line @typescript-eslint/require-await
async function loadTreeDataset(): Promise<POIBasic[]> {
  return POI.data.publicGetMapInformation.points
    .map(
      (poi) =>
        ({
          id: poi.id,
          latitude: parseFloat(poi.latitude),
          longitude: parseFloat(poi.longitude),
          slug: poi.slug,
          type: poi.type,
          families_pope: poi.families_pope,
          location_types_pope: poi.location_types_pope,
          plainWastes: poi.plainWastes,
          plainTypes: poi.plainTypes,
          plainFilters: poi.plainFilters,
        }) satisfies POIBasic,
    )
    .filter((poi) => !isNaN(poi.latitude) && !isNaN(poi.longitude))
}

type POIBasic = {
  id: string
  latitude: number
  longitude: number
  slug: string
  type: string
  families_pope: { slug: string }[]
  location_types_pope: { slug: string }[]
  plainWastes: string
  plainTypes: string
  plainFilters: string
}

const DEFAULT_MAP_PROPS = {
  center: { lat: 41.544581, lng: -8.427375 },
  zoom: 14,
}

export function TestMap() {
  const [trees, setTrees] = createSignal<POIBasic[]>()

  const [setMapRef] = createSignal<google.maps.Map | null>(null)

  // load data asynchronously
  createEffect(() => {
    loadTreeDataset()
      .then((data) => setTrees(data))
      .catch(console.error)
  })

  const [selectedTreeKey, setSelectedTreeKey] = createSignal<string | null>(
    null,
  )
  const selectedTree = createMemo(() =>
    selectedTreeKey()
      ? (trees()?.find((t) => t.id === selectedTreeKey()) ?? null)
      : null,
  )
  const [markers, setMarkers] = createSignal<{ [key: string]: Marker }>({})

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        style={{ height: '100vh', width: '100vw' }}
        mapId={MAP_ID}
        defaultCenter={DEFAULT_MAP_PROPS.center}
        defaultZoom={DEFAULT_MAP_PROPS.zoom}
        gestureHandling={'greedy'}
        disableDefaultUI
        ref={setMapRef}
      >
        <ClusteredMarkers ref={setMarkers}>
          {(addToCluster) => (
            <For each={trees()}>
              {(tree) => (
                <AdvancedMarker
                  position={{
                    lat: tree.latitude,
                    lng: tree.longitude,
                  }}
                  ref={(ref) => addToCluster(ref, tree.id)}
                  onClick={() => setSelectedTreeKey(tree.id)}
                >
                  <span class="text-lg">🌳</span>
                </AdvancedMarker>
              )}
            </For>
          )}
        </ClusteredMarkers>
        <Show when={selectedTreeKey() && markers()[selectedTreeKey()!]}>
          <InfoWindow
            anchor={markers()[selectedTreeKey()!]}
            onCloseClick={() => setSelectedTreeKey(null)}
          >
            {selectedTree()?.slug}
          </InfoWindow>
        </Show>
      </Map>
    </APIProvider>
  )
}
