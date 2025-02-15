
'use client'
import AccountDashboard from '@/components/AccountDashboard';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Features() {
  return (
    <main className="min-h-screen bg-[#FBFBFA] dark:bg-slate-900 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Account Features
        </h1>
        
        <div className="grid gap-8">
          {/* Account Dashboard Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Your Account
            </h2>
            <AccountDashboard />
          </section>
          
          {/* Other Features */}
          <section className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Loan Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Track and manage your loan applications and EMI payments
                </p>
                <Button variant="outline">View Loans</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  View your complete payment history and download statements
                </p>
                <Button variant="outline">View History</Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>

  );
}
