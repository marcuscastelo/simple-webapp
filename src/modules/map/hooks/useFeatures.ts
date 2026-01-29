import { FeatureCollection, Point } from 'geojson'
import { createEffect, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'

import { POIBasic } from '~/modules/map/hooks/usePOI'

async function loadFeaturesDataset(): Promise<
  FeatureCollection<Point, POIBasic>
> {
  const res = await fetch('/api/location')
  if (!res.ok) throw new Error(`Failed to fetch locations: ${res.status}`)
  const data = (await res.json()) as FeatureCollection<Point, POIBasic>
  return data
}

export function useFeatures() {
  const [features, setFeatures] = createStore<
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

  onMount(() => {
    setInterval(() => {
      loadFeaturesDataset()
        .then((data) => {
          // If hashes are different, update features
          data.features.forEach((feature, index) => {
            if (
              JSON.stringify(feature) !==
              JSON.stringify(features.features[index])
            ) {
              setFeatures('features', index, feature)
            }
          })
        })
        .catch(console.error)
    }, 1000)
  })

  return [features, setFeatures] as const
}
