'use client'

import Image from 'next/image'
import { Button } from '../ui/button'

const githubLogo = '/github.svg'
const googleLogo = '/google.svg'

function Social() {
  return (
    <div className="flex w-full items-center justify-center gap-x-4">
      <Button variant="outline" className="inline-flex w-1/2 items-center justify-center">
        <a href="a" className="relative size-5">
          <Image fill src={googleLogo} alt="google_logo" />
        </a>
      </Button>
      <Button variant="outline" className="inline-flex w-1/2 items-center justify-center">
        <a href="s" className="relative size-5">
          <Image fill src={githubLogo} alt="github_logo" className="object-cover" />
        </a>
      </Button>
    </div>
  )
}

export { Social }
