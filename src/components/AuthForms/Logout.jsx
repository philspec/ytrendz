import { supabase } from '@/lib/supabase'
import useStore from '@/store'

export const logout = async () => {
  const setUser = useStore.getState().setUser
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
  } catch (error) {
    console.error('Error logging out:', error.message)
  }
}