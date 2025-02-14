"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { FaGithub } from "react-icons/fa"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authService } from "@/services/auth.service"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import logo from '@/public/logo.png'

export default function AuthPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { theme } = useTheme()
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  
  const [signupData, setSignupData] = useState({
    fullname: "",
    email: "",
    password: "",
    address: "",
    State: "",
    Pincode: "",
    avatar: null as File | null,
    role: "user" as "user" | "admin",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mounted) return
    setLoading(true)
    try {
      const response = await authService.login({
        email: loginData.email,
        password: loginData.password,
      })
      if (response.success) {
        toast.success("Login successful!")
        await new Promise(resolve => setTimeout(resolve, 100))
        window.location.href = "/questionnaire"
      } else {
        toast.error("Login failed")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mounted) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("fullname", signupData.fullname)
      formData.append("email", signupData.email)
      formData.append("password", signupData.password)
      formData.append("address", signupData.address)
      formData.append("State", signupData.State)
      formData.append("Pincode", signupData.Pincode)
      formData.append("role", signupData.role)
      if (signupData.avatar) {
        formData.append("avatar", signupData.avatar)
      }

      const response = await authService.signup(formData)
      if (response.success) {
        toast.success("Account created successfully!")
        await new Promise(resolve => setTimeout(resolve, 100))
        window.location.href = "/questionnaire"
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Auth Forms */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center justify-center gap-2">
              Welcome to
              <Image 
                src={logo} 
                alt="Logo" 
                width={60} 
                height={60} 
                className="inline-block" 
              /> 
              FIN-AI
            </span>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Your complete development workflow solution</p>
          </motion.div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="login-email">
                      Email
                    </label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="login-password">
                      Password
                    </label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input type="checkbox" id="remember" className="rounded border-gray-300 dark:border-gray-700 dark:bg-gray-800" />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Remember me
                    </label>
                  </div>
                  <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    Forgot password?
                  </Link>
                </div>

                <div className="space-y-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-6">
                {/* First row - Name and Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="signup-name">
                      Full Name
                    </label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signupData.fullname}
                      onChange={(e) => setSignupData({ ...signupData, fullname: e.target.value })}
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="signup-email">
                      Email
                    </label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Second row - Password and Address */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="signup-password">
                      Password
                    </label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="signup-address">
                      Address
                    </label>
                    <Input
                      id="signup-address"
                      type="text"
                      placeholder="Enter your address"
                      value={signupData.address}
                      onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Third row - State and Pincode */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="signup-state">
                      State
                    </label>
                    <Input
                      id="signup-state"
                      type="text"
                      placeholder="Enter your state"
                      value={signupData.State}
                      onChange={(e) => setSignupData({ ...signupData, State: e.target.value })}
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="signup-pincode">
                      Pincode
                    </label>
                    <Input
                      id="signup-pincode"
                      type="number"
                      placeholder="Enter your pincode"
                      value={signupData.Pincode}
                      onChange={(e) => setSignupData({ ...signupData, Pincode: e.target.value })}
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Profile Picture - Full width */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="signup-avatar">
                    Profile Picture
                  </label>
                  <Input
                    id="signup-avatar"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setSignupData({ ...signupData, avatar: file })
                      }
                    }}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create account"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Image and Features */}
      <div className="hidden lg:block lg:w-[55%] bg-gray-50 dark:bg-gray-800 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800" />
        <div className="relative h-full flex items-center justify-center p-8">
          <div className="max-w-2xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              {/* Loading-like elements */}
              <div className="space-y-6">
                <div className="w-24 h-3 bg-blue-400 rounded-full" />
                
                <div className="space-y-4">
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">₹50Cr+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Investment</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Investors</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

