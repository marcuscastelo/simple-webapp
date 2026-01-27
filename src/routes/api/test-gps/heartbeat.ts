import { parseJsonRequest } from './parseBody'
import { heartbeat } from './store'

export async function POST({ request }: any) {
  // Expect JSON body: { id: string }
  let body: any
  try {
    body = await parseJsonRequest(request)
  } catch (err) {
    return new Response(JSON.stringify({ error: 'invalid json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  if (!body || typeof body.id !== 'string') {
    return new Response(JSON.stringify({ error: 'missing id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const ok = heartbeat(body.id)
  if (!ok) {
    return new Response(JSON.stringify({ error: 'not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
