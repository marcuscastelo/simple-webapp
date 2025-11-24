import './app.css'

import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { APIProvider } from 'solid-google-maps'
import { onMount, Suspense } from 'solid-js'

import { Navbar } from '~/modules/common/sections/Navbar'
import { env, validateEnvVars } from '~/utils/env'

export default function App() {
  onMount(() => {
    validateEnvVars()
  })

  return (
    <Router
      root={(props) => (
        <>
          <APIProvider
            apiKey={env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={['places']}
          >
            <Navbar />
            <Suspense>{props.children}</Suspense>
          </APIProvider>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
