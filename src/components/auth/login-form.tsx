'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { CardWrapper } from './card-wrapper'

import { loginAction } from '@/actions/login-action'
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
import { LoginSchema } from '@/schema'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useTransition } from 'react'
import Link from 'next/link'

function LoginFormComponent() {
  const [loginStatus, setLoginStatus] = useState<FormStatusProps>()
  const [isTwoFactor, setIsTwoFactor] = useState(false)
  const [isPending, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? ({ status: 'error', message: 'Email already in use with different provider!' } as const)
      : undefined

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      twoFactorOtp: undefined,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof LoginSchema>) {
    setLoginStatus(undefined)
    startTransition(async () => {
      const response = await loginAction(values)
      if (response.twoFactor) {
        setIsTwoFactor(true)
        return
      }
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      setLoginStatus({ status: response.status!, message: response.message! })
    })
  }

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            {isTwoFactor ? (
              <FormField
                key="2FA"
                control={form.control}
                name="twoFactorOtp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-800">Enter 2FA Code</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} type="text" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-800">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="example@email.com"
                          {...field}
                          type="email"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-800">Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="******"
                          {...field}
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <Button size="sm" variant="link" asChild className="px-0 font-normal">
                        <Link href="/auth/reset ">Forgot password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormStatus formStatusProps={loginStatus || urlError} />
          <Button type="submit" disabled={isPending} className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export function LoginForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormComponent />
    </Suspense>
  )
}
