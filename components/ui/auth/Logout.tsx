// components/Logout.tsx
import { supabase } from '@/lib/supabase-client'
import { useRouter } from 'next/router'

export default function Logout() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return <button onClick={handleLogout}>Logout</button>
}
