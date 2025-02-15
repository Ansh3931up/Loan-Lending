'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Brain,  Shield, CheckCircle2 } from "lucide-react"
import { BarChart } from "lucide-react"

export default function AnalysisPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const analysisSteps = [
    {
      title: "Processing Application",
      description: "Verifying your personal and financial information",
      icon: Shield,
      duration: 3000,
    },
    {
      title: "AI Risk Assessment",
      description: "Analyzing your financial behavior and risk profile",
      icon: Brain,
      duration: 4000,
    },
    {
      title: "Generating Offers",
      description: "Calculating personalized loan terms and interest rates",
      icon: BarChart,
      duration: 3000,
    },
    {
      title: "Finalizing Results",
      description: "Preparing your customized loan offers",
      icon: CheckCircle2,
      duration: 2000,
    }
  ]

  useEffect(() => {
    // const totalDuration = analysisSteps.reduce((acc, step) => acc + step.duration, 0)
    // const incrementSize = 100 / totalDuration

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          router.push('/apply/offers')
          return 100
        }
        return prev + 0.5
      })
    }, 50)

    analysisSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index)
      }, analysisSteps.slice(0, index).reduce((acc, s) => acc + s.duration, 0))
    })

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-slate-700 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-white dark:bg-[#1e2533] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Analyzing Your Application
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Our AI is processing your information to provide the best loan offers
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#3cc7e5]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="mt-2 text-right text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progress)}%
            </div>
          </div>

          {/* Analysis Steps */}
          <div className="space-y-6">
            {analysisSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: currentStep >= index ? 1 : 0.5,
                  y: 0 
                }}
                className={`flex items-start gap-4 p-4 rounded-lg border
                  ${currentStep === index 
                    ? 'border-[#3cc7e5] bg-[#3cc7e5]/5' 
                    : 'border-gray-200 dark:border-gray-700'}`}
              >
                <div className={`p-2 rounded-full
                  ${currentStep >= index 
                    ? 'bg-[#3cc7e5]/10 text-[#3cc7e5]' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}
                >
                  <step.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className={`font-medium mb-1
                    ${currentStep >= index 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
                {currentStep === index && (
                  <motion.div
                    className="ml-auto"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[#3cc7e5]" />
                  </motion.div>
                )}
                {currentStep > index && (
                  <div className="ml-auto text-[#3cc7e5]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Info Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-center text-gray-500 dark:text-gray-400 mt-8"
          >
            This usually takes about 30 seconds. Please do not close this window.
          </motion.p>
        </div>
      </div>
    </div>
  )
}
