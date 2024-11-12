import type { Role } from '@/db/schema'
import useCurrentUser from '@/hooks/use-current-user'
import type { PropsWithChildren } from 'react'
import FormStatus from '../form-status'

type RoleGateProps = PropsWithChildren & {
  allowedRole: Role
}
function RoleGate({ children, allowedRole }: RoleGateProps) {
  const userRole = useCurrentUser()?.role as Role

  if (userRole !== allowedRole) {
    return (
      <FormStatus
        formStatusProps={{
          status: 'error',
          message: 'You do not have permission to view this content! ',
        }}
      />
    )
  }

  return <>{children}</>
}

export default RoleGate
