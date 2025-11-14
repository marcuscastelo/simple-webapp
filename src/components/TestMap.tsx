import { Key } from '@solid-primitives/keyed'
import { FeatureCollection, Point } from 'geojson'
import { AdvancedMarker, APIProvider, Map } from 'solid-google-maps'
import { createEffect, createSignal } from 'solid-js'
import Supercluster from 'supercluster'

import { POIBasic } from '~/hooks/usePOI'
import { useSupercluster } from '~/hooks/useSupercluster'
import * as POI from '~/poi.json'
import { env } from '~/utils/env'

// eslint-disable-next-line @typescript-eslint/require-await
async function loadFeaturesDataset(): Promise<
  FeatureCollection<Point, POIBasic>
> {
  const features = POI.data.publicGetMapInformation.points
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

  return {
    type: 'FeatureCollection',
    features: features.map((poi) => ({
      type: 'Feature',
      id: poi.id,
      properties: poi,
      geometry: {
        type: 'Point',
        coordinates: [poi.longitude, poi.latitude],
      },
    })),
  }
}

const DEFAULT_MAP_PROPS = {
  center: { lat: 41.544581, lng: -8.427375 },
  zoom: 14,
}

export function TestMap() {
  const [features, setFeatures] = createSignal<
    FeatureCollection<Point, POIBasic>
  >({
    type: 'FeatureCollection',
    features: [],
  })

  const [bounds, setBounds] = createSignal<[number, number, number, number]>([
    -180, -90, 180, 90,
  ])
  const [zoom, setZoom] = createSignal<number>(DEFAULT_MAP_PROPS.zoom)
  const [center, setCenter] = createSignal<google.maps.LatLngLiteral>(
    DEFAULT_MAP_PROPS.center,
  )

  const { clusters, getLeaves } = useSupercluster(
    features,
    bounds,
    zoom,
    () => ({
      extent: 256,
      radius: 60,
      maxZoom: 12,
    }),
  )

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

      setBounds([w, s, e, n])
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
    loadFeaturesDataset()
      .then((data) => setFeatures(data))
      .catch(console.error)
  })

  return (
    <APIProvider apiKey={env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        style={{ height: '100vh', width: '100vw' }}
        mapId={env.VITE_GOOGLE_MAPS_MAP_ID}
        defaultCenter={DEFAULT_MAP_PROPS.center}
        defaultZoom={DEFAULT_MAP_PROPS.zoom}
        gestureHandling={'greedy'}
        disableDefaultUI
        ref={setMapRef}
      >
        <Key each={clusters()} by={(item) => item.id}>
          {(featureOrCluster) => {
            const featureOrCluster_ = featureOrCluster()
            const properties = featureOrCluster_.properties as Record<
              string,
              unknown
            >

            if (properties.cluster) {
              return (
                <ClusterMarker
                  cluster={
                    featureOrCluster_ as Supercluster.ClusterFeature<Supercluster.ClusterProperties>
                  }
                />
              )
            }

            return (
              <FeatureMarker
                feature={
                  featureOrCluster_ as Supercluster.PointFeature<POIBasic>
                }
              />
            )
          }}
        </Key>
        {/* <Show when={selectedTreeKey() && markers()[selectedTreeKey()!]}>
          <InfoWindow
            anchor={markers()[selectedTreeKey()!]}
            onCloseClick={() => setSelectedTreeKey(null)}
          >
            {selectedTree()?.slug}
          </InfoWindow>
        </Show> */}
      </Map>
    </APIProvider>
  )
}

function ClusterMarker(props: {
  cluster: Supercluster.ClusterFeature<Supercluster.ClusterProperties>
}) {
  const position = () => {
    const [lng, lat] = props.cluster.geometry.coordinates
    return { lat, lng }
  }
  return (
    <AdvancedMarker
      position={position()}
      zIndex={props.cluster.properties.point_count}
      // anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
      // style={{
      //   width: `${markerSize()}px`,
      //   height: `${markerSize()}px`,
      // }}
      // class="marker cluster"
    >
      {/* {isCluster() ? '[C]' : '[F]'} ({position().lat.toFixed(2)},{' '}
                    {position().lng.toFixed(2)}) */}
      <svg id="svg3512" viewBox="0 0 80 80" version="1.0" y="0" x="0">
        <g id="layer1">
          <g id="g3535" transform="matrix(.96875 0 0 .98751 1.2501 -.25079)">
            <path
              id="path2742"
              style="fill-rule:evenodd;fill:#000000"
              d="m54.962 37.281l17.138-10.262 7.678 14.835c1.855 8.105-8.309 11.079-16.47 10.596l-8.346-15.169z"
            />
            <path
              id="path2743"
              style="fill-rule:evenodd;fill:#000000"
              d="m51.067 47.877l-9.013 15.95 9.013 16.173 0.223-6.469h8.235c3.005 0.26 6.899-1.711 8.346-4.573l10.572-19.408c-3.487 3.458-7.971 4.35-13.131 4.35h-13.911l-0.334-6.023z"
            />
            <path
              id="path2751"
              style="fill-rule:evenodd;fill:#000000"
              d="m30.928 28.212l-17.269-10.037 9.213-13.93c6.17-5.5589 13.698 1.9041 17.237 9.29l-9.181 14.677z"
            />
            <path
              id="path2752"
              style="fill-rule:evenodd;fill:#000000"
              d="m42.062 26.482l18.288 0.157 9.732-15.749-5.751 2.945-3.997-7.2167c-1.231-2.7593-4.84-5.216-8.04-5.0942l-22.06 0.156c4.708 1.3773 7.663 4.8732 10.168 9.3959l6.752 12.19-5.092 3.216z"
            />
            <path
              id="path2753"
              style="fill-rule:evenodd;fill:#000000"
              d="m0.44401 27.381l5.3508 4.101-5.036 9.464c-2.5181 4.365 1.8077 8.616 4.5639 10.096 2.7133 1.457 6.9243 1.63 10.859 1.577l7.082-11.357 5.35 2.839-9.285-16.878-18.885 0.158z"
            />
            <path
              id="path2754"
              style="fill-rule:evenodd;fill:#000000"
              d="m1.2309 49.307l11.488 20.821c2.309 2.892 6.663 3.576 11.174 3.471h12.118v-19.718l-22.977-0.158c-3.5671 0.211-8.2359-0.525-11.803-4.416z"
            />
          </g>
        </g>
      </svg>
      <span class="text-xl w-full bg-black/20 text-center">
        {props.cluster.properties.point_count_abbreviated}
      </span>
    </AdvancedMarker>
  )
}

function FeatureMarker(props: {
  feature: Supercluster.PointFeature<POIBasic>
}) {
  const position = () => {
    const [lng, lat] = props.feature.geometry.coordinates
    return { lat, lng }
  }
  return (
    <AdvancedMarker position={position()}>
      {props.feature.properties.slug}
    </AdvancedMarker>
  )
}
