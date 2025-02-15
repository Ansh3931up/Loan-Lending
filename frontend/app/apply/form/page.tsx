'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, User, Building2, Wallet, GamepadIcon } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import RiskAssessment from "@/components/RiskAssessment/RiskAssessment"
import { verifyKYC, createVirtualAccount } from '@/services/decentro'
import { digilockerService } from '@/services/digilocker'
import KYCVerification from "@/components/KYCVerification"

export default function LoanApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    pan: '',
    email: '',
    phone: '',
    employmentType: '',
    monthlyIncome: '',
    bankAccount: '',
    loanAmount: '',
    tenure: '',
    purpose: ''
  })
  const [kycCompleted, setKycCompleted] = useState(() => {
    // Check if KYC was previously completed
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kycCompleted') === 'true';
    }
    return false;
  });

  const steps = [
    { number: 1, title: "Personal Details", icon: User },
    { number: 2, title: "Financial Info", icon: Building2 },
    { number: 3, title: "Loan Details", icon: Wallet },
    { number: 4, title: "Risk Assessment", icon: GamepadIcon }
  ]

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.pan) {
        throw new Error('PAN number is required');
      }

      // Step 1: Verify KYC with proper data
      const kycResult = await verifyKYC(
        formData.pan,           // First argument: PAN number
        'For loan verification' // Second argument: purpose
      );
      
      if (kycResult.status === 'SUCCESS') {
        // Step 2: Create Virtual Account with proper data
        const accountResult = await createVirtualAccount(
          `CUST_${formData.pan}`,                          // First argument: customerId
          `${formData.firstName} ${formData.lastName}`.trim() // Second argument: name
        );

        localStorage.setItem('virtualAccountId', accountResult.data.account_id);
        nextStep();
      } else {
        throw new Error('KYC verification failed');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      // Show error to user (add toast or alert)
      alert(error.message || 'An error occurred during verification');
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  }

  const handleDigilockerVerification = async () => {
    try {
      // 1. Initiate session
      const session = await digilockerService.initiateSession();
      
      // 2. Get issued files
      const files = await digilockerService.getIssuedFiles(session.decentroTxnId);
      
      // 3. Get Aadhaar data if available
      const aadhaarFile = files.data.find(file => file.doctype === "ADHAR");
      if (aadhaarFile) {
        const aadhaarData = await digilockerService.getEAadhaar(session.decentroTxnId);
        
        // Update form with Aadhaar data
        setFormData(prev => ({
          ...prev,
          firstName: aadhaarData.data.proofOfIdentity.name.split(' ')[0],
          lastName: aadhaarData.data.proofOfIdentity.name.split(' ').slice(1).join(' ')
        }));
        
        // Download Aadhaar PDF
        const pdfBlob = await digilockerService.downloadFile(
          session.decentroTxnId,
          aadhaarFile.uri
        );
        
        // Handle the downloaded file
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'aadhaar.pdf';
        a.click();
      }
    } catch (error) {
      console.error('Digilocker verification failed:', error);
      alert('Failed to verify documents');
    }
  };

  const handleKYCComplete = () => {
    setKycCompleted(true);
    localStorage.setItem('kycCompleted', 'true');
  };

  if (!kycCompleted) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] dark:bg-slate-700 py-12">
        <div className="container mx-auto max-w-3xl px-4">
          <KYCVerification onComplete={handleKYCComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-slate-700 py-12">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex-1 relative">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2
                      ${currentStep >= step.number 
                        ? 'bg-[#3cc7e5] border-[#3cc7e5] text-white' 
                        : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'}`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className={`text-sm font-medium ${
                    currentStep >= step.number 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-[2px] 
                    ${currentStep > step.number 
                      ? 'bg-[#3cc7e5]' 
                      : 'bg-gray-300 dark:bg-gray-600'}`} 
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-[#1e2533] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Verify Your Identity</h2>
                  
                  {/* Digilocker Section */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                        <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Verification</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Verify your identity instantly using DigiLocker
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleDigilockerVerification}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="lg"
                    >
                      <User className="mr-2 h-5 w-5" />
                      Connect DigiLocker
                    </Button>
                  </div>

                  {/* Manual Entry Form */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Or enter details manually</span>
                      <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter first name" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter last name" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pan">PAN Number</Label>
                      <Input 
                        id="pan" 
                        value={formData.pan}
                        onChange={handleInputChange}
                        placeholder="Enter PAN number" 
                        className="uppercase" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Financial Information</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="employmentType">Employment Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="salaried">Salaried</SelectItem>
                          <SelectItem value="self-employed">Self Employed</SelectItem>
                          <SelectItem value="business">Business Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthlyIncome">Monthly Income</Label>
                      <Input id="monthlyIncome" type="number" placeholder="Enter monthly income" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bankAccount">Bank Account Number (Optional)</Label>
                      <Input id="bankAccount" placeholder="Enter bank account number" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Loan Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="loanAmount">Loan Amount</Label>
                      <Input id="loanAmount" type="number" placeholder="Enter desired loan amount" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tenure">Loan Tenure</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan tenure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12 Months</SelectItem>
                          <SelectItem value="24">24 Months</SelectItem>
                          <SelectItem value="36">36 Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purpose">Loan Purpose</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="personal">Personal Use</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Financial Decision Making
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Help us understand your financial preferences better by answering these questions.
                  </p>
                  <RiskAssessment 
                    onComplete={(score) => {
                      // Handle the final score and redirect
                      console.log('Risk Assessment Score:', score)
                      window.location.href = '/apply/analysis'
                    }} 
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons - Only show for steps 1-3 */}
          {currentStep < 4 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="dark:border-gray-700 dark:text-gray-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              <Button
                onClick={handleSubmit}
                className="bg-[#3cc7e5] hover:bg-[#3cc7e5]/90 text-white"
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
