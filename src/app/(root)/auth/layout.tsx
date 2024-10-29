import type { PropsWithChildren } from 'react'

function AuthLayout({ children }: PropsWithChildren) {
  return <div className="flex h-full items-center justify-center bg-purple-500/40">{children}</div>
}

export default AuthLayout
