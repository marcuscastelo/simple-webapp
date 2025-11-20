import { Key } from '@solid-primitives/keyed'
import { FeatureCollection, Point } from 'geojson'
import { Leaf, Recycle } from 'lucide-solid'
import { AdvancedMarker, APIProvider, Map } from 'solid-google-maps'
import { createEffect, createSignal, Show } from 'solid-js'
import Supercluster from 'supercluster'

import { POIBasic } from '~/hooks/usePOI'
import { useSupercluster } from '~/hooks/useSupercluster'
import { env } from '~/utils/env'

async function loadFeaturesDataset(): Promise<
  FeatureCollection<Point, POIBasic>
> {
  const res = await fetch('/api/location')
  if (!res.ok) throw new Error(`Failed to fetch locations: ${res.status}`)
  const data = (await res.json()) as FeatureCollection<Point, POIBasic>
  return data
}

const DEFAULT_MAP_PROPS = {
  center: { lat: 41.544581, lng: -8.427375 },
  zoom: 14,
}

export function TestMap(props: { search?: string | null }) {
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
  const [selectedFeature, setSelectedFeature] = createSignal<string | null>(
    null,
  )

  const { clusters, getClusterExpansionZoom } = useSupercluster(
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

            return (
              <>
                <Show when={properties.cluster}>
                  <ClusterMarker
                    cluster={
                      featureOrCluster_ as Supercluster.ClusterFeature<Supercluster.ClusterProperties>
                    }
                    onClick={() => {
                      const id = (
                        featureOrCluster_ as Supercluster.ClusterFeature<Supercluster.ClusterProperties>
                      ).id
                      setSelectedFeature(id?.toString() ?? null)
                      alert(
                        `Cluster ${id} clicked\nDetails: ${JSON.stringify(properties, null, 2)}`,
                      )
                      // Zoom map to cluster
                      const expansionZoom = getClusterExpansionZoom(
                        id as number,
                      )
                      mapRef()?.setZoom(expansionZoom + 1)
                      mapRef()?.panTo({
                        lat: featureOrCluster_.geometry.coordinates[1],
                        lng: featureOrCluster_.geometry.coordinates[0],
                      })
                    }}
                  />
                </Show>

                <Show when={!properties.cluster}>
                  <FeatureMarker
                    feature={
                      featureOrCluster_ as Supercluster.PointFeature<POIBasic>
                    }
                    onClick={() => {
                      const id = (
                        featureOrCluster_ as Supercluster.PointFeature<POIBasic>
                      ).id
                      setSelectedFeature(id?.toString() ?? null)
                      alert(
                        `Feature ${id} clicked\nDetails: ${JSON.stringify(properties, null, 2)}`,
                      )
                    }}
                  />
                </Show>
              </>
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
  onClick?: () => void
}) {
  const position = () => {
    const [lng, lat] = props.cluster.geometry.coordinates
    return { lat, lng }
  }
  return (
    <AdvancedMarker
      position={position()}
      zIndex={props.cluster.properties.point_count}
      onClick={props.onClick}
      // anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
      // style={{
      //   width: `${markerSize()}px`,
      //   height: `${markerSize()}px`,
      // }}
      // class="marker cluster"
    >
      <div class="flex items-center justify-center">
        <div
          class="relative flex items-center justify-center rounded-full shadow-lg"
          style="width:64px;height:64px"
        >
          {/* gradient background matching app colors */}
          <div class="absolute inset-0 rounded-full bg-green-950 " />
          <div class="relative z-10 text-green-500 flex items-center justify-center">
            <Recycle class="w-7 h-7" />
          </div>
          {/* count badge */}
          <div class="absolute -bottom-2 right-0 bg-white text-sm font-semibold text-primary px-2 py-0.5 rounded-full shadow-md">
            {props.cluster.properties.point_count_abbreviated}
          </div>
        </div>
      </div>
    </AdvancedMarker>
  )
}

function FeatureMarker(props: {
  feature: Supercluster.PointFeature<POIBasic>
  onClick?: () => void
}) {
  const position = () => {
    const [lng, lat] = props.feature.geometry.coordinates
    return { lat, lng }
  }
  return (
    <AdvancedMarker position={position()} onClick={props.onClick}>
      <div class="flex items-center justify-center">
        <div
          class="relative rounded-full shadow-md flex items-center justify-center"
          style="width:40px;height:40px"
        >
          <div class="absolute inset-0 rounded-full bg-green-900" />
          <div class="relative z-10 text-green-400 flex items-center justify-center">
            <Leaf class="w-5 h-5" />
          </div>
        </div>
      </div>
      {/* <InfoWindow
        open={open()}
        onOpenChange={setOpen}
        maxWidth={220}
        headerContent={
          <span class="font-semibold">
            {props.feature.properties.slug ?? props.feature.id}
          </span>
        }
      >
        <div class="text-sm">
          {props.feature.properties.slug ?? props.feature.id}
        </div>
      </InfoWindow> */}
    </AdvancedMarker>
  )
}
