import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import useStore from '@/store';

const SignIn = ({ email, password }) => {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevent form from submitting in default way
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setUser(data.user);
      navigate('/dashboard');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Button type="submit" onClick={handleSignIn} className="w-1/2 bg-purple-600 hover:bg-purple-700">
      Login
    </Button>
  );
};

export default SignIn;
