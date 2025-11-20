import type { Feature, FeatureCollection, Point } from 'geojson'

import * as POI from '~/poi.json'

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

type RawPOIPoint = {
  id: string | number
  latitude: string
  longitude: string
  slug?: string
  type?: string
  families_pope?: unknown
  location_types_pope?: unknown
  plainWastes?: unknown
  plainTypes?: unknown
  plainFilters?: unknown
}

type POIFile = {
  data: {
    publicGetMapInformation: {
      points: RawPOIPoint[]
    }
  }
}

export function GET() {
  try {
    // Build a GeoJSON FeatureCollection from the bundled POI sample file
    const poiFile = POI as unknown as POIFile
    const rawPoints = poiFile.data.publicGetMapInformation.points ?? []

    const features: Feature<Point, Record<string, unknown>>[] = rawPoints
      .map((poi) => {
        const latitude = parseFloat(poi.latitude as unknown as string)
        const longitude = parseFloat(poi.longitude as unknown as string)
        if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null

        const properties: Record<string, unknown> = {
          id: poi.id,
          latitude,
          longitude,
          slug: poi.slug,
          type: poi.type,
          families_pope: poi.families_pope,
          location_types_pope: poi.location_types_pope,
          plainWastes: poi.plainWastes,
          plainTypes: poi.plainTypes,
          plainFilters: poi.plainFilters,
        }

        const feature: Feature<Point, Record<string, unknown>> = {
          type: 'Feature',
          id: poi.id,
          properties,
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
        }

        return feature
      })
      .filter((f): f is Feature<Point, Record<string, unknown>> => f !== null)

    const featureCollection: FeatureCollection<
      Point,
      Record<string, unknown>
    > = {
      type: 'FeatureCollection',
      features,
    }

    return new Response(JSON.stringify(featureCollection), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
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
