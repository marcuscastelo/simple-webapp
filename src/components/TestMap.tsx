import { Marker } from '@googlemaps/markerclusterer'
import { Key } from '@solid-primitives/keyed'
import { scheduleIdle } from '@solid-primitives/scheduled'
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  APIProvider,
  InfoWindow,
  Map,
  MapCameraChangedEvent,
} from 'solid-google-maps'
import { createEffect, createMemo, createSignal, For, Show } from 'solid-js'
import { ClusterProperties } from 'supercluster'

import { ClusteredMarkers } from '~/components/ClusteredMarkers'
import { POIBasic } from '~/hooks/usePOI'
import { useSupercluster } from '~/hooks/useSupercluster'
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

const DEFAULT_MAP_PROPS = {
  center: { lat: 41.544581, lng: -8.427375 },
  zoom: 14,
}

export function TestMap() {
  const [trees, setTrees] = createSignal<POIBasic[]>([])
  const [bounds, setBounds] = createSignal<{
    west: number
    south: number
    east: number
    north: number
  }>({
    west: -180,
    south: -90,
    east: 180,
    north: 90,
  })
  const [zoom, setZoom] = createSignal<number>(DEFAULT_MAP_PROPS.zoom)
  const [center, setCenter] = createSignal<google.maps.LatLngLiteral>(
    DEFAULT_MAP_PROPS.center,
  )

  const { clusters, getLeaves } = useSupercluster({
    points: trees,
    bbox: bounds,
    zoom: zoom,
    options: {
      extent: 256,
      radius: 60,
      maxZoom: 12,
    },
  })

  const [mapRef, setMapRef] = createSignal<google.maps.Map | null>(null)

  const handleBoundsChanged = () => {
    try {
      // const bounds = new google.maps.LatLngBounds(input.detail.bounds)
      const bounds = mapRef()!.getBounds()!
      const zoom = mapRef()!.getZoom()!
      const center = mapRef()!.getCenter()!

      const sw = bounds.getSouthWest()
      const ne = bounds.getNorthEast()

      const paddingDegrees = 0

      const n = Math.min(90, ne.lat() + paddingDegrees)
      const s = Math.max(-90, sw.lat() - paddingDegrees)

      const w = sw.lng() - paddingDegrees
      const e = ne.lng() + paddingDegrees

      setBounds({
        west: w,
        south: s,
        east: e,
        north: n,
      })
      setZoom(zoom)
      setCenter({ lat: center.lat(), lng: center.lng() })
    } catch {
      // ignore errors from bounds being invalid during map initialization
    }
  }

  createEffect(() => {
    const map = mapRef()
    if (!map) return

    const listener = map.addListener('idle', () => {
      handleBoundsChanged()
    })

    return () => {
      google.maps.event.removeListener(listener)
    }
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
        <Key each={clusters()} by={(item) => item.id}>
          {(feature) => {
            const position = () => ({
              lat: feature().geometry.coordinates[1],
              lng: feature().geometry.coordinates[0],
            })
            const clusterProperties = () =>
              feature().properties as ClusterProperties
            const isCluster = () => clusterProperties().cluster
            const markerSize = () =>
              Math.floor(48 + Math.sqrt(clusterProperties().point_count) * 2)

            if (isNaN(position().lat) || isNaN(position().lng)) {
              return null
            }

            return (
              <>
                <Show when={isCluster()}>
                  <AdvancedMarker
                    position={position()}
                    zIndex={clusterProperties().point_count}
                    anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
                    style={{
                      width: `${markerSize()}px`,
                      height: `${markerSize()}px`,
                    }}
                    class="marker cluster"
                  >
                    {isCluster() ? '[C]' : '[F]'} ({position().lat.toFixed(2)},{' '}
                    {position().lng.toFixed(2)})
                  </AdvancedMarker>
                </Show>
                {/* <Show when={!isCluster()}>
                  <AdvancedMarker
                    position={position()}
                    anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM}
                    class="marker tree-marker"
                  >
                    🍇{' '}
                  </AdvancedMarker>
                </Show> */}
              </>
            )
          }}
        </Key>
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
