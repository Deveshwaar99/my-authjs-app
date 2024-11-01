'use client'

import { DEFAULT_LOGIN_REDIRECT } from '@/middleware'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useTransition } from 'react'
import { Button } from '../ui/button'
import { loginWithProvider } from '@/actions/login-action'

const githubLogo = '/github.svg'
const googleLogo = '/google.svg'

function Social() {
  const [isPending, startTransition] = useTransition()
  const onClick = (provider: 'google' | 'github') => {
    startTransition(async () => {
      // signIn(provider, { redirectTo: DEFAULT_LOGIN_REDIRECT })
      await loginWithProvider(provider)
    })
  }
  return (
    <div className="flex w-full items-center justify-center gap-x-4">
      <Button
        onClick={() => onClick('google')}
        disabled={isPending}
        variant="outline"
        className="inline-flex w-1/2 items-center justify-center"
      >
        <span className="relative size-5">
          <Image fill src={googleLogo} alt="google_logo" />
        </span>
      </Button>
      <Button
        onClick={() => onClick('github')}
        disabled={isPending}
        variant="outline"
        className="inline-flex w-1/2 items-center justify-center"
      >
        <span className="relative size-5">
          <Image fill src={githubLogo} alt="github_logo" className="object-cover" />
        </span>
      </Button>
    </div>
  )
}

export { Social }
