import { FeatureCollection, Point } from 'geojson'
import { createEffect, createSignal } from 'solid-js'

import { POIBasic } from '~/hooks/usePOI'

async function loadFeaturesDataset(): Promise<
  FeatureCollection<Point, POIBasic>
> {
  const res = await fetch('/api/location')
  if (!res.ok) throw new Error(`Failed to fetch locations: ${res.status}`)
  const data = (await res.json()) as FeatureCollection<Point, POIBasic>
  return data
}

export function useFeatures() {
  const [features, setFeatures] = createSignal<
    FeatureCollection<Point, POIBasic>
  >({
    type: 'FeatureCollection',
    features: [],
  })

  // load data asynchronously
  createEffect(() => {
    loadFeaturesDataset()
      .then((data) => setFeatures(data))
      .catch(console.error)
  })

  return [features, setFeatures] as const
}
