import { NextRequest, NextResponse } from 'next/server'
import { saveEntry, saveImage } from '@/lib/kv'

// This endpoint receives POST data from iOS Shortcuts
// Supports both JSON and multipart/form-data (for file uploads)
export async function POST(request: NextRequest) {
  try {
    // Verify the webhook secret if set
    const webhookSecret = process.env.WEBHOOK_SECRET
    if (webhookSecret) {
      const authHeader = request.headers.get('Authorization')
      if (authHeader !== `Bearer ${webhookSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }
    
    const contentType = request.headers.get('content-type') || ''
    
    let title = ''
    let wifi = ''
    let app = ''
    let location = ''
    let photoUrl = ''
    
    if (contentType.includes('multipart/form-data')) {
      // Handle multipart form data (file upload from iOS Shortcuts)
      const formData = await request.formData()
      
      title = formData.get('title')?.toString() || ''
      wifi = formData.get('wifi')?.toString() || ''
      app = formData.get('app')?.toString() || ''
      location = formData.get('location')?.toString() || ''
      
      const photoFile = formData.get('photo')
      
      if (photoFile && photoFile instanceof File) {
        // Convert file to base64 and store in KV
        const arrayBuffer = await photoFile.arrayBuffer()
        const base64Data = Buffer.from(arrayBuffer).toString('base64')
        const imageId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        const fileType = photoFile.type || 'image/jpeg'
        
        await saveImage(imageId, base64Data, fileType)
        photoUrl = `/api/image/${imageId}`
      }
    } else {
      // Handle JSON body
      const body = await request.json()
      title = body.title || ''
      wifi = body.wifi || ''
      app = body.app || ''
      location = body.location || ''
      photoUrl = body.photo || ''
    }
    
    if (!title) {
      return NextResponse.json({ error: 'Title (date) is required' }, { status: 400 })
    }
    
    // Save to KV
    const entry = await saveEntry({
      title,
      wifi,
      app,
      location,
      photo: photoUrl
    })
    
    // Send Bark notification
    // const notificationSent = await sendBarkNotification(entry)
    
    return NextResponse.json({ 
      success: true, 
      entry,
      // notificationSent
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 })
  }
}
