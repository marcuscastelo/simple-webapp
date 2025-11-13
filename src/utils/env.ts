/**
 * Google Maps API key loaded from environment variables.
 * @throws {Error} If VITE_GOOGLE_MAPS_API_KEY is not defined
 */
export const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

/**
 * Google Maps Map ID loaded from environment variables.
 * @throws {Error} If VITE_GOOGLE_MAPS_MAP_ID is not defined
 */
export const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID

if (!API_KEY) {
  throw new Error(
    'VITE_GOOGLE_MAPS_API_KEY is not defined in environment variables',
  )
}

if (!MAP_ID) {
  throw new Error(
    'VITE_GOOGLE_MAPS_MAP_ID is not defined in environment variables',
  )
}
