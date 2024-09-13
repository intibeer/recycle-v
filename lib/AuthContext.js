// lib/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const session = supabase.auth.session()
    setSession(session)

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={session}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
