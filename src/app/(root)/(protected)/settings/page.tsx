import { logoutAction } from '@/actions/logout-action'
import { auth, signOut } from '@/auth'
import UserButton from '@/components/auth/user-button'
import { Button } from '@/components/ui/button'

async function SettingsPage() {
  const session = await auth()
  return <div className="rounded-xl bg-white p-10">{JSON.stringify(session)}</div>
}

export default SettingsPage
