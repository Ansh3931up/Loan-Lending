'use client'

import { useState } from "react"
import { LogIn, LogOut, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AuthButtons() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoginDialog, setIsLoginDialog] = useState(true)

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggedIn(true)
    // Add your authentication logic here
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    // Add your logout logic here
  }

  return (
    <div className="flex items-center gap-2">
      {!isLoggedIn ? (
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2 dark:border-gray-700 dark:text-gray-300"
                onClick={() => setIsLoginDialog(true)}
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:bg-[#1e2533] dark:border-gray-800">
              <DialogHeader>
                <DialogTitle className="dark:text-white">
                  {isLoginDialog ? 'Sign In' : 'Sign Up'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAuth} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    className="dark:bg-[#242b3d] dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="dark:text-gray-300">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    className="dark:bg-[#242b3d] dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex justify-between items-center mt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => setIsLoginDialog(!isLoginDialog)}
                  >
                    {isLoginDialog ? 'Need an account?' : 'Already have an account?'}
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-[#3cc7e5] hover:bg-[#3cc7e5]/90 text-white"
                  >
                    {isLoginDialog ? 'Sign In' : 'Sign Up'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="gap-2 bg-[#3cc7e5] hover:bg-[#3cc7e5]/90 text-white"
                onClick={() => setIsLoginDialog(false)}
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:bg-[#1e2533] dark:border-gray-800">
              {/* Same content as login dialog but with isLoginDialog false */}
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Button 
          variant="outline" 
          className="gap-2 dark:border-gray-700 dark:text-gray-300"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      )}
    </div>
  )
} 