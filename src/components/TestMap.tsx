import { Key } from '@solid-primitives/keyed'
import { Leaf, Recycle } from 'lucide-solid'
import { AdvancedMarker, APIProvider, Map } from 'solid-google-maps'
import { Show } from 'solid-js'
import Supercluster from 'supercluster'

import { useFeatures } from '~/hooks/useFeatures'
import { DEFAULT_MAP_PROPS, useMapRefSignals } from '~/hooks/useMapRefSignals'
import { POIBasic } from '~/hooks/usePOI'
import { useSupercluster } from '~/hooks/useSupercluster'
import { env } from '~/utils/env'

export function TestMap(props: { search?: string | null }) {
  const [features] = useFeatures()
  const { mapRef, setMapRef, bounds, zoom } = useMapRefSignals()

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

  const zoomToCluster = (
    cluster: Supercluster.ClusterFeature<Supercluster.ClusterProperties>,
  ) => {
    const expansionZoom = getClusterExpansionZoom(cluster.id as number)
    const [lng, lat] = cluster.geometry.coordinates
    mapRef()?.setZoom(expansionZoom + 1)
    mapRef()?.panTo({ lat, lng })
  }

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
          {(featureOrCluster) => (
            <DynamicFeatureClusterMarker
              featureOrCluster={featureOrCluster()}
              zoomToCluster={zoomToCluster}
            />
          )}
        </Key>
      </Map>
    </APIProvider>
  )
}

function DynamicFeatureClusterMarker(props: {
  featureOrCluster:
    | Supercluster.PointFeature<POIBasic>
    | Supercluster.ClusterFeature<Supercluster.ClusterProperties>
  zoomToCluster?: (
    featureOrCluster: Supercluster.ClusterFeature<Supercluster.ClusterProperties>,
  ) => void
}) {
  const isCluster = () =>
    (props.featureOrCluster.properties as Record<string, unknown>).cluster
  return (
    <>
      <Show when={isCluster()}>
        <ClusterMarker
          cluster={
            props.featureOrCluster as Supercluster.ClusterFeature<Supercluster.ClusterProperties>
          }
          onClick={() => {
            if (isCluster()) {
              props.zoomToCluster?.(
                props.featureOrCluster as Supercluster.ClusterFeature<Supercluster.ClusterProperties>,
              )
            }
          }}
        />
      </Show>
      <Show when={!isCluster()}>
        <FeatureMarker
          feature={
            props.featureOrCluster as Supercluster.PointFeature<POIBasic>
          }
        />
      </Show>
    </>
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
    >
      <div class="flex items-center justify-center">
        <div
          class="relative flex items-center justify-center rounded-full shadow-lg"
          style="width:64px;height:64px"
        >
          <div class="absolute inset-0 rounded-full bg-green-950 " />
          <div class="relative z-10 text-green-500 flex items-center justify-center">
            <Recycle class="w-7 h-7" />
          </div>
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
    </AdvancedMarker>
  )
}
