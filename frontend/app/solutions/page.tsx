'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  generateAadhaarOTP,
  verifyAadhaarOTP,
  verifyPAN,
  verifyBankAccount
} from '@/services/decentro';

interface KYCFormData {
  aadhaar: {
    number: string;
    otp: string;
  };
  pan: {
    number: string;
  };
  bank: {
    accountNumber: string;
    ifsc: string;
  };
}

export default function KYCVerificationFlow() {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState<KYCFormData>({
    aadhaar: { number: '', otp: '' },
    pan: { number: '' },
    bank: { accountNumber: '', ifsc: '' }
  });

  // Aadhaar OTP Generation
  const handleGenerateOTP = async () => {
    try {
      setLoading(true);
      const result = await generateAadhaarOTP(formData.aadhaar.number);
      
      if (result.status === 'success') {
        setOtpSent(true);
        toast.success('OTP sent successfully', {
          description: 'Please check your registered mobile number'
        });
      }
    } catch (error: any) {
      toast.error('Failed to send OTP', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Aadhaar OTP Verification
  const handleVerifyAadhaar = async () => {
    try {
      setLoading(true);
      const result = await verifyAadhaarOTP(
        formData.aadhaar.number,
        formData.aadhaar.otp
      );
      
      if (result.status === 'verified') {
        toast.success('Aadhaar Verified Successfully', {
          description: `Verified: ${result.name}`
        });
        localStorage.setItem('kycStatus', 'verified');
        localStorage.setItem('kycMethod', 'aadhaar');
      }
    } catch (error: any) {
      toast.error('Aadhaar Verification Failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // PAN Verification
  const handleVerifyPAN = async () => {
    try {
      setLoading(true);
      const result = await verifyPAN(formData.pan.number);
      
      if (result.status === 'verified') {
        toast.success('PAN Verified Successfully', {
          description: `Verified: ${result.name}`
        });
        localStorage.setItem('kycStatus', 'verified');
        localStorage.setItem('kycMethod', 'pan');
      }
    } catch (error: any) {
      toast.error('PAN Verification Failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Bank Account Verification
  const handleVerifyBank = async () => {
    try {
      setLoading(true);
      const result = await verifyBankAccount(
        formData.bank.accountNumber,
        formData.bank.ifsc
      );
      
      if (result.status === 'verified') {
        toast.success('Bank Account Verified Successfully', {
          description: `Verified: ${result.account_holder_name}`
        });
        localStorage.setItem('kycStatus', 'verified');
        localStorage.setItem('kycMethod', 'bank');
      }
    } catch (error: any) {
      toast.error('Bank Verification Failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>KYC Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="aadhaar">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="aadhaar">Aadhaar</TabsTrigger>
            <TabsTrigger value="pan">PAN</TabsTrigger>
            <TabsTrigger value="bank">Bank Account</TabsTrigger>
          </TabsList>

          {/* Aadhaar Verification Tab */}
          <TabsContent value="aadhaar">
            <div className="space-y-4">
              <div>
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <Input
                  id="aadhaar"
                  value={formData.aadhaar.number}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    aadhaar: { ...prev.aadhaar, number: e.target.value }
                  }))}
                  placeholder="Enter 12-digit Aadhaar number"
                  maxLength={12}
                />
              </div>

              {otpSent && (
                <div>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    value={formData.aadhaar.otp}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      aadhaar: { ...prev.aadhaar, otp: e.target.value }
                    }))}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                  />
                </div>
              )}

              <Button
                onClick={otpSent ? handleVerifyAadhaar : handleGenerateOTP}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : otpSent ? (
                  'Verify OTP'
                ) : (
                  'Generate OTP'
                )}
              </Button>
            </div>
          </TabsContent>

          {/* PAN Verification Tab */}
          <TabsContent value="pan">
            <div className="space-y-4">
              <div>
                <Label htmlFor="pan">PAN Number</Label>
                <Input
                  id="pan"
                  value={formData.pan.number}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pan: { number: e.target.value.toUpperCase() }
                  }))}
                  placeholder="Enter 10-digit PAN number"
                  className="uppercase"
                  maxLength={10}
                />
              </div>

              <Button
                onClick={handleVerifyPAN}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Verify PAN'
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Bank Account Verification Tab */}
          <TabsContent value="bank">
            <div className="space-y-4">
              <div>
                <Label htmlFor="account">Account Number</Label>
                <Input
                  id="account"
                  value={formData.bank.accountNumber}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    bank: { ...prev.bank, accountNumber: e.target.value }
                  }))}
                  placeholder="Enter bank account number"
                />
              </div>

              <div>
                <Label htmlFor="ifsc">IFSC Code</Label>
                <Input
                  id="ifsc"
                  value={formData.bank.ifsc}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    bank: { ...prev.bank, ifsc: e.target.value.toUpperCase() }
                  }))}
                  placeholder="Enter IFSC code"
                  className="uppercase"
                />
              </div>

              <Button
                onClick={handleVerifyBank}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Verify Account'
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
