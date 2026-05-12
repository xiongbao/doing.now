import type { DoingEntry } from '@/lib/kv'

interface EntryCardProps {
  entry: DoingEntry
}

export function EntryCard({ entry }: EntryCardProps) {
  const date = new Date(entry.createdAt)
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  return (
    <article className="p-4 border border-border rounded-lg space-y-3">
      <header className="flex items-center justify-between">
        <h3 className="font-medium">{entry.title}</h3>
        <time className="text-xs text-muted-foreground">{formattedDate}</time>
      </header>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="space-y-1">
          <span className="text-muted-foreground text-xs">WiFi</span>
          <p className="truncate">{entry.wifi || '-'}</p>
        </div>
        <div className="space-y-1">
          <span className="text-muted-foreground text-xs">App</span>
          <p className="truncate">{entry.app || '-'}</p>
        </div>
      </div>
      
      {entry.location && (
        <div className="space-y-1">
          <span className="text-muted-foreground text-xs">Location</span>
          <p className="text-sm truncate">{entry.location}</p>
        </div>
      )}
      
      {entry.photo && (
        <div className="space-y-1">
          <span className="text-muted-foreground text-xs">Photo</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={entry.photo} 
            alt="Latest photo" 
            className="w-auto h-80 object-cover rounded-md"
          />
        </div>
      )}
    </article>
  )
}
