import { Accessor, createMemo } from 'solid-js'
import Supercluster from 'supercluster'

import { POIBasic } from '~/hooks/usePOI'

export function useSupercluster(props: {
  points: Accessor<Array<POIBasic>>
  bbox: Accessor<{
    west: number
    south: number
    east: number
    north: number
  }>
  zoom: Accessor<number>
  options?: Supercluster.Options<POIBasic, Supercluster.AnyProps>
}) {
  const supercluster = createMemo(() => {
    return new Supercluster<POIBasic, Supercluster.AnyProps>(
      props.options,
    ).load(
      props.points().map((poi) => ({
        type: 'Feature',
        properties: poi,
        geometry: {
          type: 'Point',
          coordinates: [poi.longitude, poi.latitude],
        },
      })),
    )
  })

  const clusters = createMemo(() => {
    return supercluster().getClusters(
      [
        props.bbox().west,
        props.bbox().south,
        props.bbox().east,
        props.bbox().north,
      ],
      Math.round(props.zoom()),
    )
  })

  function getLeaves(clusterId: number, limit?: number, offset?: number) {
    return supercluster().getLeaves(clusterId, limit, offset)
  }

  return {
    supercluster,
    clusters,
    getLeaves,
  }
}
