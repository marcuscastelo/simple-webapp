/**
 * Small helper to consistently parse JSON from the incoming Request object.
 *
 * Some dev runtimes pass a Request-like object that does not implement
 * request.json(), so this helper first attempts to use request.json() when
 * available, and otherwise falls back to request.text() + JSON.parse.
 *
 * This centralizes the compatibility logic so route handlers stay simple.
 */
export async function parseJsonRequest(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r: any = request
  if (typeof r.json === 'function') {
    // prefer native json() when present
    return await r.json()
  }
  // fallback to reading text and parsing
  const txt = await request.text()
  if (!txt) return {}
  return JSON.parse(txt)
}
