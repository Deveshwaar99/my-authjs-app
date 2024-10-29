'use client'

import Image from 'next/image'

const githubLogo = '/github.svg'
const googleLogo = '/google.svg'

function Social() {
  return (
    <div className="flex w-full items-center justify-center gap-x-4">
      <a href="a" className="relative size-5">
        <Image fill src={googleLogo} alt="google_logo" />
      </a>

      <a href="s" className="relative size-5">
        <Image fill src={githubLogo} alt="github_logo" className="object-cover" />
      </a>
    </div>
  )
}

export { Social }
