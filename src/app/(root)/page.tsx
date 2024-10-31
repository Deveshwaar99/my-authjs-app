import { LoginButton } from '@/components/auth/login-button'
import { cn } from '@/lib/utils'
import { Poppins } from 'next/font/google'

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
})
export default function Home() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center bg-purple-500">
      <div className="space-y-6 text-center">
        <h1 className={cn('text-6xl font-semibold text-white drop-shadow-md', font.className)}>
          🔐 My Auth
        </h1>
        <p>Custom implementation of authentication service</p>
        <div>
          <LoginButton mode="redirect" asChild>
            SignIn
          </LoginButton>
        </div>
      </div>
    </main>
  )
}
