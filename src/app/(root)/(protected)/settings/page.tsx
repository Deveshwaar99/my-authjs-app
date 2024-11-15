'use client'

import { updateUserInfo } from '@/actions/settings'
import type { FormStatusProps } from '@/components/form-status'
import FormStatus from '@/components/form-status'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import useCurrentUser from '@/hooks/use-current-user'
import { SettingsSchema } from '@/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { SelectContent, SelectValue } from '@radix-ui/react-select'
import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

function SettingsPage() {
  const [settingsFormStatus, setSettingsFormStatus] = useState<FormStatusProps | undefined>()
  const [passwordChangeSwitch, setPasswordChangeSwitch] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()

  const user = useCurrentUser()

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      role: user?.role || 'USER',
      isTwoFactorEnabled: user?.isTwoFactorEnabled || false,
      currentPassword: undefined,
      newPassword: undefined,
      confirmPassword: undefined,
    },
  })

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(async () => {
      const response = await updateUserInfo(values)
      setSettingsFormStatus(response)
    })
  }

  const resetForm = () => {
    form.reset({ ...user })
  }

  useEffect(() => {
    if (user) {
      form.reset({ ...user })
    }
  }, [form, user])

  if (!user) return null

  return (
    <Card className="mx-auto flex h-[80vh] w-full max-w-lg flex-col px-4 py-6 md:max-w-xl md:px-8 md:py-8 lg:max-w-2xl lg:py-10 xl:max-w-3xl">
      <CardHeader>
        <p className="text-center text-xl font-semibold md:text-2xl">🛠️ Settings</p>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-800">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@email.com"
                        {...field}
                        type="text"
                        disabled={isPending}
                      />
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
                        // disabled={isPending || user.isOAuth} //OAuth users cannot change email
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-800">Role</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-96 border bg-white">
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="USER">User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {user.isOAuth === false ? (
                <>
                  <FormField
                    control={form.control}
                    name="isTwoFactorEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start justify-between rounded-lg border p-3 shadow-sm md:flex-row md:items-center">
                        <div className="mb-2 md:mb-0">
                          <FormLabel className="space-y-0.5">Two Factor Authentication</FormLabel>
                          <FormDescription>
                            Enable two factor authentication for your account
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            disabled={isPending}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col items-start justify-between rounded-lg border p-3 shadow-sm md:flex-row md:items-center">
                    <div className="mb-2 md:mb-0">
                      <p className="space-y-0.5 text-sm">Change Password</p>
                      <p className="text-sm text-muted-foreground">
                        Toggle this switch to change your password
                      </p>
                    </div>
                    <Switch
                      disabled={isPending}
                      checked={passwordChangeSwitch}
                      onCheckedChange={setPasswordChangeSwitch}
                    />
                  </div>
                </>
              ) : null}

              {user.isOAuth === false && passwordChangeSwitch ? (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-800">Current Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="******"
                            {...field}
                            type="password"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-800">New password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="******"
                            {...field}
                            type="password"
                            disabled={isPending}
                          />
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
                          <Input
                            placeholder="******"
                            {...field}
                            type="password"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : null}
            </div>

            <FormStatus formStatusProps={settingsFormStatus} />
            <div className="mt-4 flex flex-col gap-y-2 md:flex-row md:gap-x-2 md:gap-y-0">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-green-600 text-white hover:bg-green-700 md:w-auto"
              >
                Save
              </Button>
              <Button
                onMouseDown={() => resetForm()}
                disabled={isPending}
                variant="secondary"
                className="w-full bg-gray-300 text-gray-800 hover:bg-gray-400 md:w-auto"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SettingsPage
