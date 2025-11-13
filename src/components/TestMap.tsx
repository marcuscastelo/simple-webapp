import { APIProvider, Map } from 'solid-google-maps'
import { Component } from 'solid-js'

import { API_KEY } from '~/utils/env'

export const TestMap: Component = () => {
  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        style={{ width: '100vw', height: '100vh' }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={3}
        mapId={'40527d464f34e7febe80350b'}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      />
    </APIProvider>
  )
}
