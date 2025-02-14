'use client'

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Check, Calendar, DollarSign, Percent, Clock, Download, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import confetti from 'canvas-confetti'

export default function ConfirmPage() {
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Example selected offer data (in real app, get this from state management)
  const selectedOffer = {
    amount: "1,50,000",
    interestRate: "10.5",
    tenure: 24,
    emi: "6,943",
    processingFee: "1,500",
    totalInterest: "16,632",
    disbursalDate: "1 March 2024",
    firstEmiDate: "1 April 2024"
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-slate-700 py-12">
      <div className="container mx-auto max-w-3xl px-4">
        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1e2533] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Confirm Your Loan Application
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Please review your selected offer details before final submission
              </p>
            </div>

            {/* Loan Summary */}
            <div className="bg-gray-50 dark:bg-[#242b3d] rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Selected Offer Summary
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#3cc7e5]" />
                      <span className="text-gray-600 dark:text-gray-400">Loan Amount</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">₹{selectedOffer.amount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-[#3cc7e5]" />
                      <span className="text-gray-600 dark:text-gray-400">Interest Rate</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedOffer.interestRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#3cc7e5]" />
                      <span className="text-gray-600 dark:text-gray-400">Tenure</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedOffer.tenure} months</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#3cc7e5]" />
                      <span className="text-gray-600 dark:text-gray-400">Monthly EMI</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">₹{selectedOffer.emi}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#3cc7e5]" />
                      <span className="text-gray-600 dark:text-gray-400">Processing Fee</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">₹{selectedOffer.processingFee}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#3cc7e5]" />
                      <span className="text-gray-600 dark:text-gray-400">Total Interest</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">₹{selectedOffer.totalInterest}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Dates */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Important Dates</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#242b3d] rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Expected Disbursal</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedOffer.disbursalDate}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#242b3d] rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">First EMI Date</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedOffer.firstEmiDate}</span>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" id="terms" className="rounded text-[#3cc7e5]" />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                  I agree to the Terms & Conditions and authorize the bank to process my loan application
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-[#3cc7e5] hover:bg-[#3cc7e5]/90 text-white px-8"
                onClick={handleSubmit}
              >
                Submit Application
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#1e2533] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Application Submitted Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Your loan application has been received. We'll process it and get back to you shortly.
            </p>
            <div className="flex flex-col gap-4 items-center">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.print()}
              >
                <Download className="h-4 w-4" />
                Download Application Summary
              </Button>
              <Button
                className="bg-[#3cc7e5] hover:bg-[#3cc7e5]/90 text-white"
                onClick={() => router.push('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </div>
          </motion.div>
        )}

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mt-6 text-gray-600 dark:text-gray-400"
        >
          <Shield className="h-4 w-4" />
          <span className="text-sm">Your information is protected with bank-grade security</span>
        </motion.div>
      </div>
    </div>
  )
}
