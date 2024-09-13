'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Github, Mail } from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Listen for auth state change and redirect after login
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard')
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth, router])

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,  // Redirects to /dashboard after login
      },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Check your email for the login link!' })
    }

    setLoading(false)
  }

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,  // Redirects to /dashboard after OAuth login
      },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center pt-20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Set up or login into your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full text-white font-extrabold tracking-tighter" disabled={loading}>
              {loading ? 'Loading...' : 'Send Magic Link'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              <AlertTitle>{message.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
