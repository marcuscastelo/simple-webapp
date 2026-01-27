import { parseJsonRequest } from './parseBody'
import { updateEntry } from './store'

export async function POST({ request }: any) {
  // Expect JSON body: { id: string, lat: number, lng: number }
  let body: any
  try {
    body = await parseJsonRequest(request)
  } catch (err) {
    return new Response(JSON.stringify({ error: 'invalid json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  if (
    !body ||
    typeof body.id !== 'string' ||
    typeof body.lat !== 'number' ||
    typeof body.lng !== 'number'
  ) {
    return new Response(JSON.stringify({ error: 'missing id, lat or lng' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const entry = updateEntry(body.id, body.lat, body.lng)
  if (!entry) {
    return new Response(JSON.stringify({ error: 'not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return new Response(JSON.stringify({ ok: true, entry }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
