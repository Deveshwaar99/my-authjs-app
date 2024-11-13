// Only use if React.cache is supported in your version
import { cache } from 'react'
import { useSession } from 'next-auth/react'

const getCurrentUser = cache(() => {
  const { data } = useSession()
  return data?.user
})

export default function useCurrentUser() {
  return getCurrentUser()
}
