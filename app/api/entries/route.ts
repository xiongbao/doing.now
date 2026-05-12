import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getLatestEntries } from '@/lib/kv'

export async function GET() {
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const entries = await getLatestEntries(5)
    return NextResponse.json({ entries })
  } catch (error) {
    console.error('Failed to fetch entries:', error)
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
  }
}
