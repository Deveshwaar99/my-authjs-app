'use client'

import { useRouter } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import { Button } from '../ui/button'

type LoginButtonProps = PropsWithChildren & {
  mode: 'modal' | 'redirect'
  asChild: boolean
}

export function LoginButton({ children, mode = 'redirect', asChild }: LoginButtonProps) {
  const router = useRouter()
  const onClick = () => {
    router.push('/auth/login')
  }

  if (mode === 'modal') return <span>Modal Implementation</span>

  return (
    <Button type="button" onClick={onClick} className="cursor-pointer">
      {children}
    </Button>
  )
}
