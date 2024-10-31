import { z } from 'zod'

export const LoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required.' })
    .email('Please enter a valid email address.'),
  password: z.string({ required_error: 'Password is required.' }).min(1, 'Password is required.'),
})

export const RegisterSchemaFrontend = z
  .object({
    email: z
      .string({ required_error: 'Email is required.' })
      .email('Please enter a valid email address.'),
    password: z
      .string({ required_error: 'Password is required.' })
      .min(6, 'Password must be at least 6 characters long.'),
    confirmPassword: z
      .string({ required_error: 'Please confirm your password.' })
      .min(6, 'Confirm password must be at least 6 characters long.'),
    name: z.string({ required_error: 'Name is required.' }).min(1, 'Name is required.'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export const RegisterSchemaBackend = z.object({
  email: z
    .string({ required_error: 'Email is required.' })
    .email('Please enter a valid email address.'),
  password: z
    .string({ required_error: 'Password is required.' })
    .min(6, 'Password must be at least 6 characters long.'),
  name: z.string({ required_error: 'Name is required.' }).min(1, 'Name is required.'),
})
