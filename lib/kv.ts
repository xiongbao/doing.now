// KV interface for Cloudflare Pages
// In production, this will use Cloudflare KV bindings
// For local development, we use an in-memory store

export interface DoingEntry {
  id: string
  title: string // date
  wifi: string // network name
  app: string // current app
  location: string // geolocation or map URL
  photo: string // latest photo URL
  createdAt: number
}

// In-memory store for development
const memoryStore = new Map<string, string>()

// For Cloudflare Pages, you would access KV via platform.env
// This is a mock implementation for local development
export async function getKV(): Promise<{
  get: (key: string) => Promise<string | null>
  put: (key: string, value: string) => Promise<void>
  list: (options?: { prefix?: string; limit?: number }) => Promise<{ keys: { name: string }[] }>
}> {
  // In production on Cloudflare Pages, you would use:
  // const { env } = getRequestContext()
  // return env.DOING_KV
  
  return {
    async get(key: string) {
      return memoryStore.get(key) ?? null
    },
    async put(key: string, value: string) {
      memoryStore.set(key, value)
    },
    async list(options?: { prefix?: string; limit?: number }) {
      const prefix = options?.prefix ?? ''
      const limit = options?.limit ?? 100
      const keys = Array.from(memoryStore.keys())
        .filter(k => k.startsWith(prefix))
        .slice(0, limit)
        .map(name => ({ name }))
      return { keys }
    }
  }
}

export async function saveEntry(entry: Omit<DoingEntry, 'id' | 'createdAt'>): Promise<DoingEntry> {
  const kv = await getKV()
  const id = `entry:${Date.now()}`
  const fullEntry: DoingEntry = {
    ...entry,
    id,
    createdAt: Date.now()
  }
  await kv.put(id, JSON.stringify(fullEntry))
  return fullEntry
}

export async function getLatestEntries(limit = 5): Promise<DoingEntry[]> {
  const kv = await getKV()
  const { keys } = await kv.list({ prefix: 'entry:', limit: 100 })
  
  const entries: DoingEntry[] = []
  for (const { name } of keys) {
    const data = await kv.get(name)
    if (data) {
      entries.push(JSON.parse(data))
    }
  }
  
  // Sort by createdAt descending and take the latest
  return entries
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit)
}

// Image storage functions
export async function saveImage(imageId: string, base64Data: string, contentType: string): Promise<void> {
  const kv = await getKV()
  await kv.put(`image:${imageId}`, JSON.stringify({ data: base64Data, contentType, expirationTtl: 604800 }))
}

export async function getImage(imageId: string): Promise<{ data: string; contentType: string } | null> {
  const kv = await getKV()
  const result = await kv.get(`image:${imageId}`)
  if (!result) return null
  return JSON.parse(result)
}
