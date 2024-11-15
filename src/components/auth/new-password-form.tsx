'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { CardWrapper } from './card-wrapper'

import { setNewPasswordAction } from '@/actions/reset-password-action'
import FormStatus, { type FormStatusProps } from '@/components/form-status'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { NewPasswordSchema } from '@/schema'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState, useTransition } from 'react'

function NewPasswordFormComponent() {
  const [passwordResetStatus, setPasswordResetStatus] = useState<FormStatusProps>()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const token = useSearchParams().get('token')

  useEffect(() => {
    if (!token) {
      setPasswordResetStatus({ status: 'error', message: 'Missing token!' })
    }
  }, [token])

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof NewPasswordSchema>) {
    if (!token) return
    setPasswordResetStatus(undefined)
    startTransition(async () => {
      const response = await setNewPasswordAction(values, token)
      setPasswordResetStatus(response)
      if (response.status === 'error') return

      setTimeout(() => {
        router.push('/auth/login')
      }, 2000) // 2 second delay
    })
  }

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-800">Password</FormLabel>
                  <FormControl>
                    <Input placeholder="******" {...field} type="password" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-800">Confirm password</FormLabel>
                  <FormControl>
                    <Input placeholder="******" {...field} type="password" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormStatus formStatusProps={passwordResetStatus} />
          <Button type="submit" disabled={isPending || !token} className="w-full">
            {isPending ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export function NewPasswordForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPasswordFormComponent />
    </Suspense>
  )
}
