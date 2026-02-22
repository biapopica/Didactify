import { authClient } from '@/lib/auth-client'

export function useLogout() {
  const { data: session } = authClient.useSession()

  const logout = async () => {
    await authClient.signOut()
  }

  return { logout, session }
}
