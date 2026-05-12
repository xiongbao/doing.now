import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { sendTriggerEmail } from '@/lib/email'

export async function POST() {
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const success = await sendTriggerEmail()
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
