import type { DoingEntry } from './kv'

export async function sendBarkNotification(entry: DoingEntry): Promise<boolean> {
  const deviceId = process.env.BARK_DEVICE_ID
  
  if (!deviceId) {
    console.error('BARK_DEVICE_ID environment variable not set')
    return false
  }
  
  // Format the message as markdown
  const message = `# ${entry.title}

- WiFi: ${entry.wifi}
- App: ${entry.app}
- Location: ${entry.location}
`

  try {
    const response = await fetch(`https://api.day.app/${deviceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        markdown: message,
        image: entry.photo || undefined,
      })
    })
    
    return response.ok
  } catch (error) {
    console.error('Failed to send Bark notification:', error)
    return false
  }
}
