import { Marker } from '@googlemaps/markerclusterer'
import { AdvancedMarker, APIProvider, InfoWindow, Map } from 'solid-google-maps'
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  onMount,
  Show,
} from 'solid-js'

import { ClusteredMarkers } from '~/components/ClusteredMarkers'
import { API_KEY, MAP_ID } from '~/utils/env'

function loadTreeDataset(): Promise<Tree[]> {
  return Promise.resolve([
    {
      key: '1',
      name: 'Oak Tree',
      category: 'Oak',
      position: { lat: 41.545, lng: -8.427 },
    },
    {
      key: '2',
      name: 'Pine Tree',
      category: 'Pine',
      position: { lat: 41.546, lng: -8.428 },
    },
    {
      key: '3',
      name: 'Maple Tree',
      category: 'Maple',
      position: { lat: 41.547, lng: -8.429 },
    },
  ])
}

type Tree = {
  key: string
  name: string
  category: string
  position: google.maps.LatLngLiteral
}

export function TestMap() {
  const [trees, setTrees] = createSignal<Tree[]>()

  const [lastUserLocation] = createSignal<google.maps.LatLngLiteral | null>({
    lat: 41.544581,
    lng: -8.427375,
  })

  const [userLocation, setUserLocation] =
    // eslint-disable-next-line solid/reactivity
    createSignal<google.maps.LatLngLiteral | null>(lastUserLocation())

  let mapRef: google.maps.Map | null = null

  onMount(() => {
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(
    //       (position) => {
    //         setUserLocation({
    //           lat: position.coords.latitude,
    //           lng: position.coords.longitude,
    //         })
    //         if (mapRef) {
    //           mapRef.setCenter({
    //             lat: position.coords.latitude,
    //             lng: position.coords.longitude,
    //           })
    //         }
    //       },
    //       (error) => {
    //         console.error('Error getting user location:', error)
    //       },
    //     )
    //   } else {
    //     console.error('Geolocation is not supported by this browser.')
    //   }
  })

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
      ? (trees()?.find((t) => t.key === selectedTreeKey()) ?? null)
      : null,
  )
  const [markers, setMarkers] = createSignal<{ [key: string]: Marker }>({})

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        style={{ height: '100vh', width: '100vw' }}
        mapId={MAP_ID}
        defaultCenter={userLocation() || { lat: 22.54992, lng: 0 }}
        defaultZoom={14}
        gestureHandling={'greedy'}
        disableDefaultUI
        ref={(map) => (mapRef = map)}
      >
        <ClusteredMarkers ref={setMarkers}>
          {(addToCluster) => (
            <For each={trees()}>
              {(tree) => (
                <AdvancedMarker
                  position={tree.position}
                  ref={(ref) => addToCluster(ref, tree.key)}
                  onClick={() => setSelectedTreeKey(tree.key)}
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
            {selectedTree()?.name}
          </InfoWindow>
        </Show>
      </Map>
    </APIProvider>
  )
}
