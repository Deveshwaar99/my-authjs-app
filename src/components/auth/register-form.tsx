'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { CardWrapper } from './card-wrapper'

import { registerAction } from '@/actions/register-action'
import FormStatus from '@/components/form-status'
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
import { RegisterSchemaFrontend } from '@/schema'
import { useState, useTransition } from 'react'

export function RegisterForm() {
  const [formStatus, setFormStatus] = useState<
    { status: 'error' | 'success'; message: string } | undefined
  >()
  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof RegisterSchemaFrontend>>({
    resolver: zodResolver(RegisterSchemaFrontend),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof RegisterSchemaFrontend>) {
    setFormStatus(undefined)
    startTransition(async () => {
      const response = await registerAction(values)
      setFormStatus(response)
    })
  }

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-800">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} type="text" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          <FormStatus status={formStatus?.status} message={formStatus?.message} />
          <Button type="submit" disabled={isPending} className="w-full">
            Create an account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
