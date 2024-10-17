import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"

const SignUp = (email,password) => {
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      alert('Check your email for the confirmation link!')
      navigate('/landing-page')
    } catch (error) {
      alert(error.message)
    }
  }

  return (
      <Button className="w-1/2 bg-purple-600 hover:bg-purple-700" type="submit" onClick={handleSignUp}>Sign Up</Button>
  )
}

export default SignUp
