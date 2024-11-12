'use client'

import UserInfo from '@/components/user-info'
import useCurrentUser from '@/hooks/use-current-user'

function ClientPage() {
  const user = useCurrentUser()

  if (!user) return null
  return <UserInfo label="Server Component" user={user} />
}

export default ClientPage
