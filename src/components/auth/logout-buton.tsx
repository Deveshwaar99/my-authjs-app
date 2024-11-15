'use client'

import { logoutAction } from '@/actions/logout-action'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import type { PropsWithChildren } from 'react'

function LogoutButton({ children }: PropsWithChildren) {
  const router = useRouter()
  const handleClick = async () => {
    await logoutAction()
    router.push('/')
  }

  return (
    <Button onClick={handleClick} variant="destructive" className="w-full cursor-pointer">
      {children}
    </Button>
  )
}

export default LogoutButton
