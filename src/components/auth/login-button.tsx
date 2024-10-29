'use client'

import { useRouter } from 'next/navigation'
import type { PropsWithChildren } from 'react'

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
    <button type="button" onClick={onClick} className="cursor-pointer">
      {children}
    </button>
  )
}
