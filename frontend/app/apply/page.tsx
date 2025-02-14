'use client'

import { motion } from "framer-motion"
import { ArrowRight, Shield, FileText, Brain, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ApplyPage() {
  const steps = [
    {
      icon: FileText,
      title: "Quick Application",
      description: "Simple 5-minute application with basic details",
      color: "text-[#3cc7e5]",
      bgColor: "bg-[#3cc7e5]/10"
    },
    {
      icon: Brain,
      title: "AI Assessment",
      description: "Our AI evaluates your profile instantly",
      color: "text-[#3cc7e5]",
      bgColor: "bg-[#3cc7e5]/10"
    },
    {
      icon: CheckCircle,
      title: "Get Your Offer",
      description: "View your personalized loan offers immediately",
      color: "text-[#3cc7e5]",
      bgColor: "bg-[#3cc7e5]/10"
    }
  ]

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-slate-700">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="bg-white dark:bg-[#1e2533] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Start Your Loan Application
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Get instant loan approval with our AI-powered platform. 
                Complete your application in minutes.
              </p>
            </motion.div>
          </div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-12"
          >
            <Shield className="h-5 w-5 text-[#3cc7e5]" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Bank-grade security with 256-bit encryption
            </span>
          </motion.div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="relative"
              >
                <div className="bg-white dark:bg-[#242b3d] rounded-xl p-6 text-center border border-gray-200 dark:border-gray-800">
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center`}>
                      <step.icon className={`h-8 w-8 ${step.color}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-full h-[2px] bg-gradient-to-r from-[#3cc7e5] to-transparent transform -translate-y-1/2 z-0" />
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center"
          >
            <Link href="/apply/form">
              <Button size="lg" className="bg-[#3cc7e5] hover:bg-[#3cc7e5]/90 text-white group px-8">
                Continue to Application
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              No credit score impact. Takes only 5 minutes.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
