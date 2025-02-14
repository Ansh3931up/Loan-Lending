'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Check, Clock, Calendar, DollarSign, Percent, ArrowRight, Shield, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OffersPage() {
  const router = useRouter()
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null)

  const offers = [
    {
      id: 1,
      amount: "1,50,000",
      interestRate: "10.5",
      tenure: 24,
      emi: "6,943",
      processingFee: "1,500",
      totalInterest: "16,632",
      tag: "Best Value"
    },
    {
      id: 2,
      amount: "2,00,000",
      interestRate: "11.5",
      tenure: 36,
      emi: "6,587",
      processingFee: "2,000",
      totalInterest: "37,132",
      tag: "Most Popular"
    },
    {
      id: 3,
      amount: "1,00,000",
      interestRate: "9.5",
      tenure: 12,
      emi: "8,738",
      processingFee: "1,000",
      totalInterest: "4,856",
      tag: "Quick Approval"
    }
  ]

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-slate-700 py-12">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your Personalized Loan Offers
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Based on your profile, we've customized these offers just for you
            </p>
          </motion.div>
        </div>

        {/* AI Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-[#1e2533] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#3cc7e5]/10 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-[#3cc7e5]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your AI Credit Score
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Based on your financial behavior
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#3cc7e5]">85/100</div>
              <span className="text-sm text-green-500">Excellent</span>
            </div>
          </div>
        </motion.div>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className={`relative bg-white dark:bg-[#1e2533] rounded-xl shadow-sm border-2 transition-all
                ${selectedOffer === offer.id 
                  ? 'border-[#3cc7e5]' 
                  : 'border-gray-200 dark:border-gray-800'}`}
            >
              {/* Tag */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#3cc7e5] text-white text-sm px-3 py-1 rounded-full">
                  {offer.tag}
                </span>
              </div>

              <div className="p-6">
                {/* Loan Amount */}
                <div className="text-center mb-6">
                  <span className="text-gray-600 dark:text-gray-400">Loan Amount</span>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    ₹{offer.amount}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Interest Rate</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{offer.interestRate}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Tenure</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{offer.tenure} months</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Monthly EMI</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">₹{offer.emi}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Processing Fee</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">₹{offer.processingFee}</span>
                  </div>
                </div>

                {/* Select Button */}
                <Button
                  className={`w-full mt-6 ${
                    selectedOffer === offer.id
                      ? 'bg-[#3cc7e5] hover:bg-[#3cc7e5]/90'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedOffer(offer.id)}
                >
                  {selectedOffer === offer.id ? (
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4" /> Selected
                    </span>
                  ) : (
                    'Select Offer'
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-center justify-center gap-2 mb-8 text-gray-600 dark:text-gray-400"
        >
          <Shield className="h-4 w-4" />
          <span className="text-sm">Your information is protected with bank-grade security</span>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center"
        >
          <Button
            size="lg"
            className="bg-[#3cc7e5] hover:bg-[#3cc7e5]/90 text-white px-8"
            disabled={!selectedOffer}
            onClick={() => router.push('/apply/confirm')}
          >
            Continue with Selected Offer
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
