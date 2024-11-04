import { cn } from '@/lib/utils'
import { CheckCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'

export type FormStatusProps =
  | {
      status: 'error' | 'success'
      message: string
    }
  | undefined

function FormStatus({ formStatusProps }: { formStatusProps: FormStatusProps }) {
  if (!formStatusProps) return null
  const { status, message } = formStatusProps

  return (
    <div
      className={cn(
        'flex items-center gap-x-2 rounded-md p-3 text-sm',
        status === 'error' && 'bg-destructive/15 text-destructive',
        status === 'success' && 'bg-emerald-500/15 text-emerald-500',
      )}
    >
      {status === 'error' && <ExclamationTriangleIcon className="size-5" />}
      {status === 'success' && <CheckCircledIcon className="size-5" />}
      <p>{message}</p>
    </div>
  )
}

export default FormStatus
