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
import { env } from '~/utils/env'

function loadTreeDataset(): Promise<Tree[]> {
  return Promise.resolve([])
}

type Tree = {
  key: string
  name: string
  category: string
  position: google.maps.LatLngLiteral
}

// export const TestMap: Component = () => {
//   return (
//     <APIProvider apiKey={API_KEY}>
//       <Map
//         style={{ width: '100vw', height: '100vh' }}
//         defaultCenter={{ lat: 22.54992, lng: 0 }}
//         defaultZoom={3}
//         mapId={'40527d464f34e7febe80350b'}
//         gestureHandling={'greedy'}
//         disableDefaultUI={true}
//       >
//         <Marker
//           position={{ lat: 10, lng: 10 }}
//           clickable={true}
//           onClick={() => alert('marker was clicked!')}
//           title={'clickable google.maps.Marker'}
//         />{' '}
//       </Map>
//     </APIProvider>
//   )
// }

export function TestMap(props: { search?: string | null }) {
  const [trees, setTrees] = createSignal<Tree[]>()
  const [selectedCategory] = createSignal<string | null>(null)

  // Search maps for props.search
  createEffect(() => {
    if (props.search) {
      console.log('Searching for:', props.search)
      // Implement search logic here
      new google.maps.Geocoder()
        .geocode({ address: props.search }, (results, status) => {
          if (
            status === google.maps.GeocoderStatus.OK &&
            results &&
            results[0]
          ) {
            const location = results[0].geometry.location
            console.log('Found location:', location.toJSON())
            // You can center the map to this location if needed
            // mapRef.setCenter(location);
          } else {
            console.error(
              'Geocode was not successful for the following reason:',
              status,
            )
          }
        })
        .catch(console.error)
    }
  })

  const [lastUserLocation] = createSignal<google.maps.LatLngLiteral | null>({
    lat: 41.544581,
    lng: -8.427375,
  })

  const [userLocation, setUserLocation] =
    // eslint-disable-next-line solid/reactivity
    createSignal<google.maps.LatLngLiteral | null>(lastUserLocation())

  let mapRef: google.maps.Map | null = null

  onMount(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          if (mapRef) {
            mapRef.setCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          }
        },
        (error) => {
          console.error('Error getting user location:', error)
        },
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  })

  // load data asynchronously
  createEffect(() => {
    loadTreeDataset()
      .then((data) => setTrees(data))
      .catch(console.error)
  })

  // get category information for the filter-dropdown
  const filteredTrees = createMemo(() => {
    return (
      trees()?.filter(
        (t) => !selectedCategory() || t.category === selectedCategory(),
      ) || []
    )
  })

  const [selectedTreeKey, setSelectedTreeKey] = createSignal<string | null>(
    null,
  )
  const selectedTree = createMemo(() =>
    selectedTreeKey()
      ? filteredTrees().find((t) => t.key === selectedTreeKey())!
      : null,
  )
  const [markers, setMarkers] = createSignal<{ [key: string]: Marker }>({})

  return (
    <APIProvider apiKey={env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        style={{ height: '100vh', width: '100vw' }}
        mapId={env.VITE_GOOGLE_MAPS_MAP_ID}
        defaultCenter={userLocation() || { lat: 22.54992, lng: 0 }}
        defaultZoom={14}
        gestureHandling={'greedy'}
        disableDefaultUI
        ref={(map) => (mapRef = map)}
      >
        <ClusteredMarkers ref={setMarkers}>
          {(addToCluster) => (
            <For each={filteredTrees()}>
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
