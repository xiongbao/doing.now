import { isAuthenticated } from '@/lib/auth'
import { LoginForm } from '@/components/login-form'
import { Dashboard } from '@/components/dashboard'

export default async function HomePage() {
  const authenticated = await isAuthenticated()
  
  if (authenticated) {
    return <Dashboard />
  }
  
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-12">
        {/* Landing */}
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-light tracking-tight">doing.now</h1>
          <p className="text-muted-foreground text-sm">
            Track what you&apos;re doing, right now.
          </p>
        </div>
        
        {/* Login Form */}
        <LoginForm />
      </div>
    </main>
  )
}
