'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DoingEntry } from '@/lib/kv'
import { EntryCard } from './entry-card'

export function Dashboard() {
  const [entries, setEntries] = useState<DoingEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    fetchEntries()
  }, [])
  
  async function fetchEntries() {
    try {
      const res = await fetch('/api/entries')
      if (res.ok) {
        const data = await res.json()
        setEntries(data.entries)
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error)
    } finally {
      setLoading(false)
    }
  }
  
  async function handleSendEmail() {
    setSending(true)
    try {
      const res = await fetch('/api/send-email', { method: 'POST' })
      if (res.ok) {
        alert('Email sent! Shortcut will be triggered soon.')
      } else {
        alert('Failed to send email')
      }
    } catch {
      alert('Failed to send email')
    } finally {
      setSending(false)
    }
  }
  
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.refresh()
  }
  
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-light tracking-tight">doing.now</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Logout
          </button>
        </header>
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSendEmail}
            disabled={sending}
            className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {sending ? 'Sending...' : 'Send Email'}
          </button>
          <button
            onClick={fetchEntries}
            className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-secondary transition-colors"
          >
            Refresh
          </button>
        </div>
        
        {/* Entries */}
        <section className="space-y-4">
          <h2 className="text-sm text-muted-foreground">Latest Activities</h2>
          
          {loading ? (
            <p className="text-muted-foreground text-sm py-8 text-center">Loading...</p>
          ) : entries.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">
              No entries yet. Send an email to trigger your iOS Shortcut.
            </p>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
