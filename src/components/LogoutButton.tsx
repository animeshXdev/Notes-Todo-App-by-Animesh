'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { toast } from 'react-hot-toast'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Logged out successfully')
    router.push('/')
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      🚪 Logout
    </Button>
  )
}
