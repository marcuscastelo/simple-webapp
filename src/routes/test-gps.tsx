import { createEffect, createSignal, For, onMount } from 'solid-js'

export default function TestGPS() {
  const [gpsPositions, setGpsPositions] = createSignal<
    { lat: number; lng: number }[]
  >([])

  const [tick, setTick] = createSignal(0)

  createEffect(() => {
    let backendUrl = 'http://localhost:3000/api/test-gps'
    if (import.meta.env.PROD) {
      backendUrl = 'https://your-production-backend.com/api/test-gps'
    }

    tick()

    fetch(backendUrl)
      .then((response) => response.json())
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        setGpsPositions(data.positions)
      })
      .catch((error) => {
        console.error('Error fetching GPS positions:', error)
      })
  })

  onMount(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1)
    }, 5000)

    return () => clearInterval(interval)
  })

  return (
    <div class="min-h-screen py-12">
      <div class="container mx-auto px-4">
        <div class="mb-12 text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Test GPS Positions
          </h1>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
            Displaying fetched GPS positions from the backend
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-semibold mb-4">Fetched GPS Positions:</h2>
          <ul class="list-disc list-inside">
            <For each={gpsPositions()}>
              {(position) => (
                <li>
                  Latitude: {position.lat}, Longitude: {position.lng}
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
    </div>
  )
}
