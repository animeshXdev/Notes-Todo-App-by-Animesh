'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function DashboardToggle() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex justify-center gap-4 mb-6">
      <Button
        variant={pathname.includes('/notes') ? 'default' : 'outline'}
        onClick={() => router.push('/dashboard/notes')}
      >
        📝 Notes
      </Button>
      <Button
        variant={pathname.includes('/todos') ? 'default' : 'outline'}
        onClick={() => router.push('/dashboard/todos')}
      >
        ✅ ToDos
      </Button>
    </div>
  )
}
