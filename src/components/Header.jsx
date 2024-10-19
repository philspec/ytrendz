import { Button } from "@/components/ui/button"
import { logout } from '@/components/AuthForms/Logout'
import { Youtube } from 'lucide-react'

export default function Header() {
return (<div className="flex flex-row items-center justify-between w-full">
    {/* First div with logo and icon */}
    <div className="flex items-center m-2">
      <Youtube className="w-8 h-8 mx-2 mt-2 text-purple-400" />
      <span className="text-2xl font-bold text-purple-400">ytrendz</span>
    </div>
  
    {/* Second div with logout button */}
    <div className="m-2">
      <Button className="bg-purple-600 hover:bg-purple-700" onClick={logout}>
        Logout
      </Button>
    </div>
  </div>)
  }