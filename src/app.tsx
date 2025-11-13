import './app.css'

import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { onMount, Suspense } from 'solid-js'

import { validateEnvVars } from '~/utils/env'

export default function App() {
  onMount(() => {
    validateEnvVars()
  })

  return (
    <Router
      root={(props) => (
        <>
          <Suspense>{props.children}</Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
