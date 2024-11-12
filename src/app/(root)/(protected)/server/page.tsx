import UserInfo from '@/components/user-info'
import { currentUser } from '@/lib/auth'

async function ServerPage() {
  const user = await currentUser()

  if (!user) return null
  return <UserInfo label="Server Component" user={user} />
}

export default ServerPage
