export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return new Response(
    JSON.stringify({
      positions: [
        { lat: 37.7749, lng: -122.4194 },
        { lat: 34.0522, lng: -118.2437 },
        { lat: 40.7128, lng: -74.006 },
      ].map((pos) => ({
        lat: pos.lat + (Math.random() - 0.5) * 0.01,
        lng: pos.lng + (Math.random() - 0.5) * 0.01,
      })),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  )
}
