import { NextRequest, NextResponse } from 'next/server'
import { getImage } from '@/lib/kv'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }
    
    const image = await getImage(id)
    
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }
    
    // Decode base64 and return as image
    const buffer = Buffer.from(image.data, 'base64')
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': image.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })
  } catch (error) {
    console.error('Image fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
  }
}
