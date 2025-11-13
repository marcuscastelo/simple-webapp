export const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

if (!API_KEY) {
  throw new Error(
    'VITE_GOOGLE_MAPS_API_KEY is not defined in environment variables',
  )
}
