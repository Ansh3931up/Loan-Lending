'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransactionHistory, initiatePayment, createVirtualAccount } from '@/services/decentro';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  amount: number;
  status: string;
  next_emi: string;
}

interface AccountFormData {
  name: string;
  customerId: string;
  pan: string;
  email: string;
  mobile: string;
}

const generateCustomerId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${timestamp}${random}`;
};

export default function AccountDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [accountForm, setAccountForm] = useState<AccountFormData>({
    name: '',
    customerId: generateCustomerId(),
    pan: '',
    email: '',
    mobile: ''
  });
  
  const [accountDetails, setAccountDetails] = useState<{
    accountId: string | null;
    customerName: string | null;
  }>({ accountId: null, customerName: null });

  useEffect(() => {
    setAccountDetails({
      accountId: localStorage.getItem('virtualAccountId'),
      customerName: localStorage.getItem('customerName')
    });
  }, []);

  useEffect(() => {
    if (accountDetails.accountId) {
      loadTransactions();
    }
  }, [accountDetails.accountId]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const history = await getTransactionHistory(accountDetails.accountId!);
      setTransactions(history);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
      console.error('Transaction Load Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAccountForm(prev => ({
      ...prev,
      [id]: id === 'pan' ? value.toUpperCase() : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', accountForm);
    
    try {
      setLoading(true);
      const result = await createVirtualAccount(accountForm);
      console.log('Virtual Account Creation Result:', result);

      if (result.data?.error) {
        // Show error toast
        toast.error(result.data.error.message || 'Account creation failed', {
          description: 'Please try with a different mobile number',
          duration: 5000
        });
      } else if (result.data) {
        // Show success toast
        toast.success('Account created successfully!', {
          description: 'Your virtual account has been set up'
        });
        
        localStorage.setItem('virtualAccountId', result.data.account_id);
        localStorage.setItem('customerName', accountForm.name);
        window.location.reload();
      }
    } catch (err: any) {
      // Show error toast with detailed message
      toast.error('Account Creation Failed', {
        description: err.response?.data?.error?.message || err.message || 'Please try again',
        duration: 5000
      });
      console.error('Account Creation Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const result = await initiatePayment(
        1000,
        accountDetails.accountId!,
        "EMI Payment"
      );
      
      if (result.data.upi_link) {
        window.open(result.data.upi_link, '_blank');
      }
    } catch (err: any) {
      setError(err.message || 'Payment initiation failed');
      console.error('Payment Error:', err);
    }
  };

  if (!accountDetails.accountId && !showCreateAccount) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <p className="text-gray-500">
              No virtual account found. Create one to get started.
            </p>
            <Button onClick={() => setShowCreateAccount(true)}>
              Create Virtual Account
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showCreateAccount) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Virtual Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={accountForm.name}
                onChange={(e) => setAccountForm(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="pan">PAN Number</Label>
              <Input
                id="pan"
                value={accountForm.pan}
                onChange={(e) => setAccountForm(prev => ({
                  ...prev,
                  pan: e.target.value.toUpperCase()
                }))}
                placeholder="Enter PAN number"
                className="uppercase"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={accountForm.email}
                onChange={(e) => setAccountForm(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                placeholder="Enter email address"
                required
              />
            </div>

            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                value={accountForm.mobile}
                onChange={(e) => setAccountForm(prev => ({
                  ...prev,
                  mobile: e.target.value
                }))}
                placeholder="Enter mobile number"
                maxLength={10}
                required
              />
            </div>

            <div>
              <Label htmlFor="customerId">Customer ID</Label>
              <Input
                id="customerId"
                value={accountForm.customerId}
                disabled
              />
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><span className="font-semibold">Account ID:</span> {accountDetails.accountId}</p>
            <p><span className="font-semibold">Name:</span> {accountDetails.customerName}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500">Loading transactions...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : transactions.length === 0 ? (
            <p className="text-center text-gray-500">No transactions found</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div 
                  key={tx.id} 
                  className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium">₹{tx.amount}</p>
                    <p className="text-sm text-gray-500">Next EMI: {tx.next_emi}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      tx.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6">
            <Button 
              onClick={handlePayment}
              className="w-full"
            >
              Make Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}