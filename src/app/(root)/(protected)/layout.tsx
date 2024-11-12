import type { PropsWithChildren } from 'react'
import Navbar from './_components/navbar'
import { SessionProvider } from 'next-auth/react'

function ProtectedLayout({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <div className="flex size-full flex-col items-center justify-center gap-y-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800">
        <Navbar />
        {children}
      </div>
    </SessionProvider>
  )
}

export default ProtectedLayout
