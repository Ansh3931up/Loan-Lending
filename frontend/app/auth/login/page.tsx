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

export default function AuthPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Image src="/logo.svg" alt="Logo" width={48} height={48} className="mx-auto mb-4" />
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome to DevFlow</h2>
            <p className="mt-2 text-gray-600">Your complete development workflow solution</p>
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
                    <label className="text-sm font-medium text-gray-700" htmlFor="login-email">
                      Email
                    </label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700" htmlFor="login-password">
                      Password
                    </label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input type="checkbox" id="remember" className="rounded border-gray-300" />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>

                <div className="space-y-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                  <Button type="button" variant="outline" className="w-full">
                    <FaGithub className="mr-2 h-4 w-4" />
                    Continue with GitHub
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700" htmlFor="signup-name">
                      Full Name
                    </label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signupData.fullname}
                      onChange={(e) => setSignupData({ ...signupData, fullname: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700" htmlFor="signup-email">
                      Email
                    </label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700" htmlFor="signup-password">
                      Password
                    </label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700" htmlFor="signup-address">
                      Address
                    </label>
                    <Input
                      id="signup-address"
                      type="text"
                      placeholder="Enter your address"
                      value={signupData.address}
                      onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700" htmlFor="signup-state">
                      State
                    </label>
                    <Input
                      id="signup-state"
                      type="text"
                      placeholder="Enter your state"
                      value={signupData.State}
                      onChange={(e) => setSignupData({ ...signupData, State: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700" htmlFor="signup-pincode">
                      Pincode
                    </label>
                    <Input
                      id="signup-pincode"
                      type="number"
                      placeholder="Enter your pincode"
                      value={signupData.Pincode}
                      onChange={(e) => setSignupData({ ...signupData, Pincode: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700" htmlFor="signup-avatar">
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
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create account"}
                  </Button>
                  <Button type="button" variant="outline" className="w-full">
                    <FaGithub className="mr-2 h-4 w-4" />
                    Sign up with GitHub
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Image and Features */}
      <div className="hidden lg:block lg:w-[55%] bg-gray-50 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50" />
        <div className="relative h-full flex items-center justify-center p-8">
          <div className="max-w-2xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="/images/platform-preview.png"
                alt="Platform preview"
                width={800}
                height={600}
                className="rounded-xl shadow-2xl"
                priority
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
                <div className="text-sm text-gray-600">Active Developers</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">1M+</div>
                <div className="text-sm text-gray-600">Projects Completed</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

