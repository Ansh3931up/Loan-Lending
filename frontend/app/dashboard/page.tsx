'use client'
import { useEffect, useState } from "react"
import LoanDashboard from "@/components/LoanDashboard"
import { authService } from "@/services/auth.service"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { 
  DollarSign, 
  ChevronRight,
  Calendar,
  Download,
  Bell,
  FileText,
  Users,
  TrendingUp,
  Wallet,
  BadgeCheck,
  Brain,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<'borrower' | 'lender'>('borrower')
  const [userData, setUserData] = useState<any>(null);
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authService.getUser();
        if (response.success) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await authService.getUser();
        console.log(userResponse);
        if (userResponse.success && userResponse.data) {
          setUserId(userResponse.data._id)
        } else {
          toast.error("Failed to load user data")
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        toast.error("Failed to load user data")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!userId) {
    return <div>Please log in to view your dashboard</div>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return CheckCircle2
      case 'pending':
        return Clock
      case 'rejected':
        return XCircle
      default:
        return AlertCircle
    }
  }

  // Borrower's loan applications
  const loanApplications = [
    {
      id: "LA10234",
      amount: "1,50,000",
      status: "approved",
      date: "28 Feb 2024",
      emiDate: "1 April 2024",
      emi: "6,943"
    },
    {
      id: "LA10289",
      amount: "2,00,000",
      status: "pending",
      date: "1 March 2024"
    }
  ]

  // Potential borrowers for lenders
  const potentialBorrowers = [
    {
      id: "USER123",
      name: "Rahul Sharma",
      aiScore: 85,
      requiredAmount: "2,00,000",
      purpose: "Business Expansion",
      riskLevel: "low",
      creditHistory: "Excellent",
      monthlyIncome: "80,000"
    },
    {
      id: "USER124",
      name: "Priya Patel",
      aiScore: 78,
      requiredAmount: "1,50,000",
      purpose: "Education",
      riskLevel: "medium",
      creditHistory: "Good",
      monthlyIncome: "65,000"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-500 bg-green-50 dark:bg-green-500/10'
      case 'pending':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10'
      case 'rejected':
        return 'text-red-500 bg-red-50 dark:bg-red-500/10'
      default:
        return ''
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-500 bg-green-50 dark:bg-green-500/10'
      case 'medium':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10'
      case 'high':
        return 'text-red-500 bg-red-50 dark:bg-red-500/10'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-slate-700 py-12">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header with Role Switcher */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {role === 'borrower' ? 'Borrower Dashboard' : 'Lender Dashboard'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {role === 'borrower' 
                ? 'Track your loans and credit score' 
                : 'Find potential borrowers and manage investments'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={role} onValueChange={(value: 'borrower' | 'lender') => setRole(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="borrower">Borrower View</SelectItem>
                <SelectItem value="lender">Lender View</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </Button>
          </div>
        </div>

        {role === 'borrower' ? (
          // Borrower's View
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#1e2533] rounded-xl p-6 border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#3cc7e5]/10 rounded-lg">
                    <Brain className="h-6 w-6 text-[#3cc7e5]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AI Credit Score</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">85/100</h3>
                    <span className="text-sm text-green-500">Excellent</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-[#1e2533] rounded-xl p-6 border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#3cc7e5]/10 rounded-lg">
                    <Wallet className="h-6 w-6 text-[#3cc7e5]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Loan Eligibility</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">₹5,00,000</h3>
                    <span className="text-sm text-[#3cc7e5]">Pre-approved</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-[#1e2533] rounded-xl p-6 border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#3cc7e5]/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-[#3cc7e5]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Interest Rate</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">10.5%</h3>
                    <span className="text-sm text-green-500">Best Rate</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Loan Dashboard Component */}
            <div className="mb-8">
              <LoanDashboard userId={userId} />
            </div>
            {/* Risk Assessment Card */}
            {userData?.riskAssessment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 bg-white dark:bg-[#1e2533] rounded-xl p-6 border border-gray-200 dark:border-gray-800"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Loan Risk Assessment
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-lg ${
                        userData.riskAssessment.loanStatus === 'Approved' 
                          ? 'bg-green-50 dark:bg-green-500/10' 
                          : 'bg-red-50 dark:bg-red-500/10'
                      }`}>
                        {userData.riskAssessment.loanStatus === 'Approved' ? (
                          <CheckCircle2 className={`h-6 w-6 ${
                            userData.riskAssessment.loanStatus === 'Approved' 
                              ? 'text-green-500' 
                              : 'text-red-500'
                          }`} />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Loan Status</p>
                        <h3 className={`text-lg font-semibold ${
                          userData.riskAssessment.loanStatus === 'Approved' 
                            ? 'text-green-500' 
                            : 'text-red-500'
                        }`}>
                          {userData.riskAssessment.loanStatus}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Assessment Date: {new Date(userData.riskAssessment.assessmentDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Approval Probability</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {Math.round(userData.riskAssessment.probabilityApproved * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{ width: `${userData.riskAssessment.probabilityApproved * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Rejection Probability</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {Math.round(userData.riskAssessment.probabilityRejected * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-red-500 h-2.5 rounded-full" 
                          style={{ width: `${userData.riskAssessment.probabilityRejected * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Confidence Score</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {Math.round(userData.riskAssessment.confidence * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-[#3cc7e5] h-2.5 rounded-full" 
                          style={{ width: `${userData.riskAssessment.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Applications List */}
            <div className="bg-white dark:bg-[#1e2533] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Loan Applications
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {loanApplications.map((loan) => {
                  const StatusIcon = getStatusIcon(loan.status)
                  return (
                    <motion.div
                      key={loan.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 hover:bg-gray-50 dark:hover:bg-[#242b3d] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#3cc7e5]/10 rounded-full flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-[#3cc7e5]" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Application ID: {loan.id}
                            </p>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              ₹{loan.amount}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Applied on {loan.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${getStatusColor(loan.status)}`}>
                            <StatusIcon className="h-4 w-4" />
                            <span className="text-sm capitalize">{loan.status}</span>
                          </div>
                          {loan.status === 'approved' && (
                            <Button variant="outline" size="sm" className="gap-2">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          )}
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      {loan.status === 'approved' && (
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="p-3 bg-gray-50 dark:bg-[#242b3d] rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Next EMI Date</p>
                            <p className="font-medium text-gray-900 dark:text-white">{loan.emiDate}</p>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-[#242b3d] rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Monthly EMI</p>
                            <p className="font-medium text-gray-900 dark:text-white">₹{loan.emi}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Apply for New Loan */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-center"
            >
              <Button 
                size="lg"
                className="bg-[#3cc7e5] hover:bg-[#3cc7e5]/90 text-white px-8"
                onClick={() => window.location.href = '/apply'}
              >
                Apply for New Loan
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </>
        ) : (
          // Lender's View
          <>
            {/* Lender Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#1e2533] rounded-xl p-6 border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#3cc7e5]/10 rounded-lg">
                    <Users className="h-6 w-6 text-[#3cc7e5]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Potential Borrowers</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">24</h3>
                    <span className="text-sm text-green-500">High Score</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-[#1e2533] rounded-xl p-6 border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#3cc7e5]/10 rounded-lg">
                    <DollarSign className="h-6 w-6 text-[#3cc7e5]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Investment</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">₹15,00,000</h3>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-[#1e2533] rounded-xl p-6 border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#3cc7e5]/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-[#3cc7e5]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Returns</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">12.5%</h3>
                    <span className="text-sm text-green-500">Above Market</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Loan Dashboard for Lender */}
            <div className="mb-8">
              <LoanDashboard userId={userId} />
            </div>

            {/* Potential Borrowers List */}
            <div className="bg-white dark:bg-[#1e2533] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Potential Borrowers
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {potentialBorrowers.map((borrower) => (
                  <motion.div
                    key={borrower.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-[#242b3d] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#3cc7e5]/10 rounded-full flex items-center justify-center">
                          <BadgeCheck className="h-6 w-6 text-[#3cc7e5]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {borrower.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              AI Score: {borrower.aiScore}/100
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">•</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Monthly Income: ₹{borrower.monthlyIncome}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${getRiskColor(borrower.riskLevel)}`}>
                          <span className="text-sm capitalize">{borrower.riskLevel} Risk</span>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-[#242b3d] rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Required Amount</p>
                        <p className="font-medium text-gray-900 dark:text-white">₹{borrower.requiredAmount}</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-[#242b3d] rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Purpose</p>
                        <p className="font-medium text-gray-900 dark:text-white">{borrower.purpose}</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-[#242b3d] rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Credit History</p>
                        <p className="font-medium text-gray-900 dark:text-white">{borrower.creditHistory}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 