'use server'

import { getUserById, updateCredentialsUserInfo, updateOAuthUserInfo } from '@/data/user'
import { currentUser } from '@/lib/auth'
import { SettingsSchema } from '@/schema'
import type { User } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import { areValuesIdentical, matchPassword } from '@/lib/utils'
import bcryptjs from 'bcryptjs'

export async function updateUserInfo(
  values: unknown,
): Promise<{ status: 'success' | 'error'; message: string }> {
  try {
    const user = await currentUser()
    if (!user) return notFound()

    const validatedFields = SettingsSchema.safeParse(values)
    if (!validatedFields.success) {
      return { status: 'error', message: 'Invalid input fields!' }
    }
    console.table(validatedFields.data)
    const { name, role, isTwoFactorEnabled, currentPassword, newPassword, confirmPassword } =
      validatedFields.data
    const dbUser = await getUserById(user.id)
    if (!dbUser) return { status: 'error', message: 'Unauthorized!' }

    const isIdentical = areValuesIdentical(dbUser, { name, role, isTwoFactorEnabled })

    if (user.isOAuth) {
      if (!isIdentical) {
        await updateOAuthUserInfo(user.id, { name, role, isTwoFactorEnabled })
      }
      return { status: 'success', message: 'Update Success!' }
    }

    if (currentPassword) {
      if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
        return { status: 'error', message: 'New password and Confirm password must match!' }
      }
      const isPasswordMatch = await matchPassword({
        password: currentPassword,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        hash: dbUser.password!,
      })
      if (!isPasswordMatch) return { status: 'error', message: 'Incorrect password!' }
      const isNewPasswordSameAsCurrentPassword = await matchPassword({
        password: newPassword,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        hash: dbUser.password!,
      })
      if (isNewPasswordSameAsCurrentPassword) {
        return {
          status: 'error',
          message: 'New password cannot be the same as the current password!',
        }
      }

      const hashedPassword = await bcryptjs.hash(newPassword, 10)
      await updateCredentialsUserInfo(user.id, {
        name,
        role,
        isTwoFactorEnabled,
        password: hashedPassword,
      })
    } else {
      if (!isIdentical) {
        await updateCredentialsUserInfo(user.id, { name, role, isTwoFactorEnabled })
      }
    }

    return { status: 'success', message: 'Update Success!' }
  } catch (error) {
    console.error('CHANGE USER DETAILS ERROR ', error)
    return { status: 'error', message: 'Something went wrong.' }
  }
}
