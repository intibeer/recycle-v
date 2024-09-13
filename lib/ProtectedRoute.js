// lib/ProtectedRoute.js
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from './AuthContext'

export default function ProtectedRoute({ children }) {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth) {
      router.push('/login')
    }
  }, [auth])

  if (!auth) return null

  return children
}