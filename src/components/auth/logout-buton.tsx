'use client'

import { logoutAction } from '@/actions/logout-action'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import type { PropsWithChildren } from 'react'

function LogoutButton({ children }: PropsWithChildren) {
  const handleClick = async () => {
    await logoutAction()
  }

  return (
    <Button onClick={handleClick} variant="destructive" className="w-full cursor-pointer">
      {children}
    </Button>
  )
}

export default LogoutButton
