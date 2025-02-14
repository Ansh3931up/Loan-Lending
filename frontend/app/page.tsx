'use client'

import { motion } from "framer-motion"
import { ArrowRight, Shield, Zap, LineChart, Clock, Users, DollarSign, BadgeCheck, FileText, Brain, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const features = [
    {
      icon: Shield,
      title: "Secure Process",
      description: "Bank-grade security for your loan application"
    },
    {
      icon: Zap,
      title: "Instant Approval",
      description: "Get loan decisions in minutes, not days"
    },
    {
      icon: LineChart,
      title: "Flexible Terms",
      description: "Customized loan terms to fit your needs"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance for borrowers"
    }
  ]

  const stats = [
    { icon: Users, value: "10,000+", label: "Active Users" },
    { icon: DollarSign, value: "₹500Cr+", label: "Loans Disbursed" },
    { icon: BadgeCheck, value: "98%", label: "Approval Rate" }
  ]

  const steps = [
    {
      icon: FileText,
      title: "Quick Application",
      description: "Fill in basic details and connect your financial accounts securely",
      delay: 0
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our AI analyzes your spending patterns and financial behavior",
      delay: 0.2
    },
    {
      icon: CheckCircle,
      title: "Instant Decision",
      description: "Get your loan offer with personalized interest rates",
      delay: 0.4
    }
  ]

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-slate-700">
      {/* Stats Banner */}
      <div className="bg-white dark:bg-[#1e2533] shadow-md shadow-gray-200 dark:shadow-gray-600 rounded-md p-2 border-b border-gray-200 dark:border-gray-800 ">
        <div className="container mx-auto max-w-7xl py-4 px-4">
          <div className="flex justify-center gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <stat.icon className="h-5 w-5 text-primary dark:text-[#3cc7e5]" />
                <div className="">
                  <div className="font-semibold  text-gray-900 dark:text-gray-100">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-10 px-4 ">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white dark:bg-[#1e2533] rounded-2xl shadow-sm border dark:shadow-gray-600 border-gray-200 dark:border-gray-800 p-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
                  Smart Lending
                  <span className="text-primary dark:text-[#3cc7e5] block">Made Simple</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Get instant loan approvals with our AI-powered lending platform.
                  Better rates, faster decisions, and transparent terms.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-[#3cc7e5] hover:bg-[#3cc7e5]/90 text-white group">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                  </Button>
                  <Button size="lg" variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                    Check Rates
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#3cc7e5]/30 to-purple-500/30 rounded-3xl blur-2xl" />
                <div className="relative bg-white dark:bg-[#242b3d] rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-800">
                  <div className="space-y-6">
                    <div className="h-2 w-24 bg-[#3cc7e5] rounded" />
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                      <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white dark:bg-[#1e2533] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
            <div className="text-center mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
              >
                How It Works
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              >
                Get your loan approved in three simple steps with our AI-powered platform
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: step.delay }}
                  className="relative"
                >
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/4 right-0 w-full h-[2px] bg-gradient-to-r from-[#3cc7e5] to-transparent transform translate-y-4" />
                  )}
                  
                  <div className="relative p-6 bg-white dark:bg-[#242b3d] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-[#3cc7e5]/10 rounded-full flex items-center justify-center mb-4">
                        <step.icon className="h-8 w-8 text-[#3cc7e5]" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <Button size="lg" className="bg-[#3cc7e5] hover:bg-[#3cc7e5]/90 text-white group">
                Start Application
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-white dark:bg-[#1e2533] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800"
              >
                <feature.icon className="h-12 w-12 text-primary dark:text-[#3cc7e5] mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
