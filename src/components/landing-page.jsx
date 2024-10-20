import { useState} from 'react'
import { useRef } from 'react'
import { Button } from "@/components/ui/button"
import ExportGoogleLogo from '@/components/ui/googleicon'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Youtube, MessageCircle, FileText, Zap } from 'lucide-react'
import SignUp from '@/components/AuthForms/SignUp'
import SignIn from '@/components/AuthForms/SignIn'
import { supabase } from '@/lib/supabase';

function LandingPageJsx() {
  const [email, setEmail] = useState('abc@gmail.com')
  const [password, setPassword] = useState('123456')

  const onGoogleSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleemailinput = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordinput = (e) => {
    setPassword(e.target.value)
  }
  const loginFormRef = useRef(null)

  const scrollToLoginForm = () => {
    loginFormRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen text-gray-100 bg-gray-900">
      <header className="container flex items-center justify-between px-4 py-6 mx-auto">
        <div className="flex items-center space-x-2">
          <Youtube className="w-8 h-8 mt-2 text-purple-400" />
          <span className="text-2xl font-bold text-purple-400">ytrendz</span>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#features" className="text-gray-300 hover:text-purple-400">Features</a></li>
            <li><a href="#" className="text-gray-300 hover:text-purple-400">Pricing</a></li>
            <li><a href="#" className="text-gray-300 hover:text-purple-400">About</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <section
          className="container flex flex-col items-center px-4 py-16 mx-auto lg:flex-row">
          <div className="flex flex-col items-center mb-10 lg:w-1/2 lg:mb-0">
            <h1 className="mb-6 text-4xl font-bold text-center text-gray-100 lg:text-5xl">
              Unlock YouTube Insights with AI
            </h1>
            <p className="mb-8 text-xl text-center text-gray-300">
              Analyze comments, summarize transcripts, and gain valuable insights from YouTube videos in minutes.
            </p>
          </div>
          <div className="lg:w-1/2 lg:pl-16" ref={loginFormRef}>
            <Card className="flex flex-col bg-gray-800 border-gray-700">
              <CardHeader>
                <CardDescription className="m-auto text-gray-400">Start analyzing YouTube content today</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="signup">
                  <TabsList className="grid w-3/4 grid-cols-2 m-auto bg-gray-700">
                    <TabsTrigger value="signup" className="data-[state=active]:bg-gray-500 data-[state=active]:text-gray-100 text-gray-400">Sign up</TabsTrigger>
                    <TabsTrigger value="login" className="data-[state=active]:bg-gray-500 data-[state=active]:text-gray-100 text-gray-400">Login</TabsTrigger>
                  </TabsList>
                  <TabsContent value="signup">
                    <form className="flex flex-col items-center space-y-4">
                      <Input
                        type="email"
                        placeholder="Email"
                        className="text-gray-100 bg-gray-700 border-gray-600" 
                        value={email}/>
                      <Input
                        type="password"
                        placeholder="Password"
                        className="text-gray-100 bg-gray-700 border-gray-600"
                        value={password}/>
                      <SignUp  email={email} password={password}/>
                    </form>
                  </TabsContent>
                  <TabsContent value="login">
                    <form className="flex flex-col items-center space-y-4">
                      <Input
                        onChange={handleemailinput}
                        type="email"
                        placeholder="Email"
                        className="text-gray-100 bg-gray-700 border-gray-600" 
                        value={email}/>
                      <Input
                        onChange={handlePasswordinput}
                        type="password"
                        placeholder="Password"
                        className="text-gray-100 bg-gray-700 border-gray-600" 
                        value={password}/>
                      <SignIn email={email} password={password}/>                    
                      </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <Button onClick={onGoogleSignIn} className="p-2 m-auto my-2 text-center text-gray-300 bg-transparent border-2 border-gray-200 w-fit h-fit rounded-xl">
          <ExportGoogleLogo className="w-4 h-4" /> Sign in with Google
        </Button>
            </Card>
          </div>
        </section>

        <section id="features" className="py-16 bg-gray-800">
          <div className="container px-4 mx-auto">
            <h2 className="mb-12 text-3xl font-bold text-center text-gray-100">Key Features</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<MessageCircle className="w-12 h-12 text-purple-400" />}
                title="Comment Analysis"
                description="Gain insights into viewer thoughts and opinions through AI-powered comment analysis." />
              <FeatureCard
                icon={<FileText className="w-12 h-12 text-purple-400" />}
                title="Transcript Summaries"
                description="Get concise summaries of video transcripts to quickly understand content without watching." />
              <FeatureCard
                icon={<Zap className="w-12 h-12 text-purple-400" />}
                title="Custom Prompts"
                description="Tailor your analysis with custom prompts for personalized insights and summaries." />
            </div>
          </div>
        </section>

        <section className="container px-4 py-16 mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-100">Ready to Revolutionize Your YouTube Analysis?</h2>
          <p className="mb-8 text-xl text-gray-300">
            Join thousands of content creators and marketers who are already using ytrendz to gain deeper insights.
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={scrollToLoginForm}>Start Your Free Trial</Button>
        </section>
      </main>
      <footer className="py-8 bg-gray-800 border-t border-gray-700">
        <div className="container px-4 mx-auto text-center text-gray-400">
          <p>&copy; 2023 ytrendz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    (<Card className="flex flex-col items-center bg-gray-700 border-gray-600">
      <CardHeader className="flex items-center justify-center">
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-gray-100 ">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <p className="text-center text-gray-300">{description}</p>
      </CardContent>
    </Card>)
  );
}

export default LandingPageJsx