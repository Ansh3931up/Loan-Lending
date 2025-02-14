'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { upiService } from '@/services/upi.service'
import { toast } from 'sonner'
import { 
  UserPlus, 
  ShieldCheck, 
  Wallet, 
  Send, 
  ArrowLeftRight, 
  History,
  ChevronRight
} from "lucide-react"

type StepStatus = 'pending' | 'current' | 'completed'

interface Step {
  id: number
  name: string
  status: StepStatus
  icon: React.ReactNode
}

export default function UPIFeatures() {
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentData, setPaymentData] = useState({
    amount: '',
    upiId: '',
    purpose: '',
    accountNumber: '',
    ifsc: '',
    fullName: '',
    phone: '',
    email: ''
  })

  const steps: Step[] = [
    {
      id: 1,
      name: "Create Virtual Account",
      status: currentStep === 1 ? 'current' : currentStep > 1 ? 'completed' : 'pending',
      icon: <UserPlus className="h-6 w-6" />
    },
    {
      id: 2,
      name: "KYC Verification",
      status: currentStep === 2 ? 'current' : currentStep > 2 ? 'completed' : 'pending',
      icon: <ShieldCheck className="h-6 w-6" />
    },
    {
      id: 3,
      name: "Add Bank Account",
      status: currentStep === 3 ? 'current' : currentStep > 3 ? 'completed' : 'pending',
      icon: <Wallet className="h-6 w-6" />
    }
  ]

  const handleCreateVirtualAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // API call to create virtual account
      toast.success('Virtual account created successfully')
      setCurrentStep(2)
    } catch (error) {
      toast.error('Failed to create virtual account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full 
                  ${step.status === 'completed' ? 'bg-green-500' : 
                    step.status === 'current' ? 'bg-blue-500' : 'bg-gray-200'} 
                  text-white`}>
                  {step.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{`Step ${step.id}`}</p>
                  <p className="text-lg font-semibold text-gray-900">{step.name}</p>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="mx-4 h-6 w-6 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Create Virtual Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateVirtualAccount} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={paymentData.fullName}
                      onChange={(e) => setPaymentData({
                        ...paymentData,
                        fullName: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input
                      value={paymentData.phone}
                      onChange={(e) => setPaymentData({
                        ...paymentData,
                        phone: e.target.value
                      })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={paymentData.email}
                    onChange={(e) => setPaymentData({
                      ...paymentData,
                      email: e.target.value
                    })}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Creating Account...' : 'Create Virtual Account'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* UPI Features Grid - Shown after setup */}
        {currentStep > 3 && (
          <div className="grid grid-cols-3 gap-6">
            {/* Send Money */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send Money
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Send Money Form */}
              </CardContent>
            </Card>

            {/* Request Money */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="h-5 w-5" />
                  Request Money
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Request Money Form */}
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Transaction List */}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 