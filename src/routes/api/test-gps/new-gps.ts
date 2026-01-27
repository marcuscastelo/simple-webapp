import { parseJsonRequest } from './parseBody'
import { createEntry } from './store'

export async function POST({ request }: any) {
  // Expect optional JSON body: { lat?: number, lng?: number }
  let body: any
  try {
    body = await parseJsonRequest(request)
  } catch (err) {
    return new Response(JSON.stringify({ error: 'invalid json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const lat = body && typeof body.lat === 'number' ? body.lat : null
  const lng = body && typeof body.lng === 'number' ? body.lng : null
  const id = createEntry(lat, lng)
  return new Response(JSON.stringify({ id }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}
