import { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import LandingPage from './components/landing-page'
import SignIn from './components/AuthForms/SignIn'
import SignUp from './components/AuthForms/SignUp'
import Dashboard from './components/Dashboard'
import VideoDetails from './components/VideoDetails' // Import the new VideoDetails component
import { supabase } from './lib/supabase'
import useStore from './store'

function App() {
  const user = useStore((state) => state.user)
  const setUser = useStore((state) => state.setUser)

  useEffect(() => {
    // Check for an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/signin" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/signin" />}
        />
        <Route path="/video/:videoId" element={user ? <VideoDetails /> : <SignIn />} /> {/* New route for video details */}
      </Routes>
    </Router>
  )
}

export default App
