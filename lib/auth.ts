import { cookies } from 'next/headers'

const AUTH_COOKIE = 'doing_auth'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export async function verifyPassword(password: string): Promise<boolean> {
  const correctPassword = process.env.AUTH_PASSWORD
  if (!correctPassword) {
    console.error('AUTH_PASSWORD environment variable not set')
    return false
  }
  return password === correctPassword
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies()
  const expires = new Date(Date.now() + SESSION_DURATION)
  
  // Simple token - in production use a proper session management
  const token = Buffer.from(`session:${Date.now()}`).toString('base64')
  
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires
  })
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE)
  return !!token?.value
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
}
