export async function POST(request: Request) {
  try {
    const { latitude, longitude } = (await request.json()) as {
      latitude: number
      longitude: number
    }
    // Here you would typically process the location data,
    // e.g., save it to a database or perform some calculations.
    console.log(
      `Received location: Latitude ${latitude}, Longitude ${longitude}`,
    )
    return new Response(JSON.stringify({ status: 'success' }), { status: 200 })
  } catch (error) {
    console.error('Error processing location data:', error)
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ status: 'error', message: error.message }),
        { status: 500 },
      )
    }
    return new Response(JSON.stringify({ status: 'error' }), { status: 500 })
  }
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function GET() {
  try {
    // Here you would typically fetch location data from a database or another source.
    const sampleLocation = {
      latitude: 41.544581,
      longitude: -8.427375,
    }
    return new Response(JSON.stringify([]), { status: 200 })
  } catch (error) {
    console.error('Error fetching location data:', error)
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ status: 'error', message: error.message }),
        { status: 500 },
      )
    }
    return new Response(JSON.stringify({ status: 'error' }), { status: 500 })
  }
}
