'use client'

import { verifyEmailUsingVerificationToken } from '@/actions/email-verification-action'
import { CardWrapper } from '@/components/auth/card-wrapper'
import FormStatus, { type FormStatusProps } from '@/components/form-status'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'

function NewVerificationFormComponent() {
  const [verificationStatus, setVerificationStatus] = useState<FormStatusProps>()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setVerificationStatus({ status: 'error', message: 'Missing token!' })
      return
    }

    // if (process.env.NODE_ENV === 'development' && verificationStatus) return

    verifyEmailUsingVerificationToken(token)
      .then(res => setVerificationStatus({ ...res }))
      .catch(() => {
        setVerificationStatus({ status: 'error', message: 'Something went wrong!' })
      })
  }, [token])

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full justify-center">
        {verificationStatus ? <FormStatus formStatusProps={verificationStatus} /> : <BeatLoader />}
      </div>
    </CardWrapper>
  )
}

export function NewVerificationForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewVerificationFormComponent />
    </Suspense>
  )
}
