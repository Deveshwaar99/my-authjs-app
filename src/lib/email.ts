import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const CONFIRMATION_LINK = `http://localhost:3000/auth/new-verification?token=${token}`

  const { error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: [email],
    subject: 'Confirm your email',
    html: `<p>Click <a href='${CONFIRMATION_LINK}'>here </a> to confirm email</p>`,
  })

  if (error) {
    console.error('[SEND_VERIFICATION_EMAIL_ERROR]', error)
  }
}
export async function sendPasswordResetEmail({ email, token }: { email: string; token: string }) {
  const RESET_LINK = `http://localhost:3000/auth/new-password?token=${token}`

  const { error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: [email],
    subject: 'Reset your password',
    html: `<p>Click <a href='${RESET_LINK}'>here </a> to reset password</p>`,
  })

  if (error) {
    console.error('[SEND_VERIFICATION_EMAIL_ERROR]', error)
  }
}
