import { Marker } from '@googlemaps/markerclusterer'
import { AdvancedMarker, APIProvider, InfoWindow, Map } from 'solid-google-maps'
import { createEffect, createMemo, createSignal, For, Show } from 'solid-js'

import { ClusteredMarkers } from '~/components/ClusteredMarkers'
import { API_KEY } from '~/utils/env'

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

export function TestMap() {
  const [trees, setTrees] = createSignal<Tree[]>()
  const [selectedCategory] = createSignal<string | null>(null)

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
    <APIProvider apiKey={API_KEY}>
      <Map
        style={{ height: '500px', width: '100%' }}
        mapId={'bf51a910020fa25a'}
        defaultCenter={{ lat: 43.64, lng: -79.41 }}
        defaultZoom={10}
        gestureHandling={'greedy'}
        disableDefaultUI
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
