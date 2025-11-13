import { Marker, MarkerClusterer } from '@googlemaps/markerclusterer'
import { useMap } from 'solid-google-maps'
import {
  Component,
  createDeferred,
  createEffect,
  createMemo,
  createSignal,
  JSX,
} from 'solid-js'

export const ClusteredMarkers: Component<{
  children: (
    addToCluster: (marker: Marker | null, key: string) => void,
  ) => JSX.Element
  ref?: (markers: { [key: string]: Marker }) => void
}> = (props) => {
  const [markers, setMarkers] = createSignal<{ [key: string]: Marker }>({})

  createDeferred(() => {
    props.ref?.(markers())
  })

  // create the markerClusterer once the map is available and update it when
  // the markers are changed
  const map = useMap()
  const clusterer = createMemo(() => {
    if (!map()) return null

    return new MarkerClusterer({ map: map() })
  })

  createEffect(() => {
    if (!clusterer()) return

    clusterer()!.clearMarkers()
    clusterer()!.addMarkers(Object.values(markers()))
  })

  // this callback will effectively get passed as ref to the markers to keep
  // tracks of markers currently on the map
  const setMarkerRef = (marker: Marker | null, key: string) => {
    setMarkers((markers) => {
      if ((marker && markers[key]) || (!marker && !markers[key])) return markers

      if (marker) {
        return { ...markers, [key]: marker }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...newMarkers } = markers

        return newMarkers
      }
    })
  }

  // eslint-disable-next-line solid/reactivity
  return props.children(setMarkerRef)
}
