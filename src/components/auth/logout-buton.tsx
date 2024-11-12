'use client'

import { logoutAction } from '@/actions/logout-action'
import { Button } from '@/components/ui/button'
import type { PropsWithChildren } from 'react'

function LogoutButton({ children }: PropsWithChildren) {
  return (
    <Button onClick={() => logoutAction()} variant="destructive" className="cursor-pointer">
      {children}
    </Button>
  )
}

export default LogoutButton
