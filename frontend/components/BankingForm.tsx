'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { bankingService } from '@/services/banking.service'
import { toast } from 'sonner'

export default function BankingForm() {
  const [loading, setLoading] = useState(false)
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: '',
    ifsc: '',
    name: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // First verify account
      await bankingService.verifyAccount(
        accountDetails.accountNumber, 
        accountDetails.ifsc
      )

      // Then add account
      await bankingService.addBankAccount(accountDetails)
      
      toast.success('Bank account added successfully')
    } catch (error) {
      toast.error('Failed to add bank account')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Account Holder Name</label>
        <Input
          value={accountDetails.name}
          onChange={(e) => setAccountDetails({
            ...accountDetails,
            name: e.target.value
          })}
          required
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Account Number</label>
        <Input
          value={accountDetails.accountNumber}
          onChange={(e) => setAccountDetails({
            ...accountDetails,
            accountNumber: e.target.value
          })}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">IFSC Code</label>
        <Input
          value={accountDetails.ifsc}
          onChange={(e) => setAccountDetails({
            ...accountDetails,
            ifsc: e.target.value
          })}
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Adding Account...' : 'Add Bank Account'}
      </Button>
    </form>
  )
} 