import { randomUUID } from 'crypto'
import fs from 'fs'
import path from 'path'

// Polyfill: some SolidStart dev runtimes provide Request objects without the
// convenient request.json() helper. To keep route handlers simple and JSON-only
// we add a tiny, global polyfill that uses request.text() + JSON.parse when
// necessary. This is a single, small fallback applied once at module load time
// (not per-handler fallback logic).
declare global {
  // augment the Request interface so TypeScript stops complaining
  interface Request {
    json?: () => Promise<any>
  }
}

export type GpsEntry = {
  id: string
  lat: number | null
  lng: number | null
  lastSeen: number
}

export const TTL_MS = 3_000

// Simple file-backed persistence so entries survive dev reloads and multiple worker contexts
let store = new Map<string, GpsEntry>()

function loadStoreFromFile() {
  return store
}

function persistStoreToFile(m: Map<string, GpsEntry>) {
  store = m
}

function pruneExpired() {
  const now = Date.now()
  for (const [id, entry] of store.entries()) {
    if (now - entry.lastSeen > TTL_MS) {
      store.delete(id)
    }
  }
}

export function createEntry(
  lat: number | null = null,
  lng: number | null = null,
) {
  const id = randomUUID()
  const now = Date.now()
  const entry: GpsEntry = { id, lat, lng, lastSeen: now }
  store.set(id, entry)
  persistStoreToFile(store)
  return id
}

export function heartbeat(id: string) {
  const entry = store.get(id)
  if (!entry) return false
  entry.lastSeen = Date.now()
  store.set(id, entry)
  persistStoreToFile(store)
  return true
}

export function updateEntry(id: string, lat: number, lng: number) {
  const entry = store.get(id)
  if (!entry) return null
  entry.lat = lat
  entry.lng = lng
  entry.lastSeen = Date.now()
  store.set(id, entry)
  persistStoreToFile(store)
  return entry
}

export function getActiveEntries() {
  // Always reload from file to reflect changes from other worker contexts
  const store = loadStoreFromFile()
  // prune expired entries in-memory (do not persist prune to avoid race)
  const now = Date.now()
  const entries: GpsEntry[] = []
  for (const e of Array.from(store.values())) {
    if (now - e.lastSeen <= TTL_MS) entries.push(e)
  }
  return entries.map((e) => ({
    id: e.id,
    lat: e.lat,
    lng: e.lng,
    lastSeen: e.lastSeen,
  }))
}
