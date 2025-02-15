import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { verifyKYC, createVirtualAccount } from '@/services/decentro';

export default function KYCVerification({ onComplete }: { onComplete: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    documentType: '',
    idNumber: '',
    name: '',
    dob: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      documentType: value
    });
  };

  const handleKYCVerification = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const kycResult = await verifyKYC({
        reference_id: `REF-${Date.now()}`,
        document_type: formData.documentType,
        id_number: formData.idNumber,
        consent: "Y",
        consent_purpose: "For loan verification"
      });
      
      if (kycResult.error) {
        if (kycResult.details === 'Account configuration pending') {
          setError('Our verification service is currently being configured. Please try again in a few hours.');
        } else {
          setError(kycResult.error);
        }
        return;
      }

      // 2. Create Virtual Account
      const accountResult = await createVirtualAccount(
        `CUST_${formData.idNumber}`,
        formData.name
      );

      // 3. Store account details
      localStorage.setItem('virtualAccountId', accountResult.data.account_id);
      localStorage.setItem('customerName', formData.name);
      localStorage.setItem('kycCompleted', 'true');
      
      // 4. Proceed to form
      onComplete();
      
    } catch (err: any) {
      if (err.response?.status === 503) {
        setError('Our verification service is currently being configured. Please try again in a few hours.');
      } else {
        setError(err.message || 'KYC verification failed');
      }
      console.error('KYC Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-lg shadow">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Complete Your KYC
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Please provide your details for verification
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="documentType">Document Type</Label>
          <Select onValueChange={handleSelectChange} value={formData.documentType}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PAN">PAN Card</SelectItem>
              <SelectItem value="AADHAAR">Aadhaar</SelectItem>
              <SelectItem value="DRIVING_LICENSE">Driving License</SelectItem>
              <SelectItem value="VOTER_ID">Voter ID</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="idNumber">ID Number</Label>
          <Input
            id="idNumber"
            value={formData.idNumber}
            onChange={handleInputChange}
            placeholder="Enter ID number"
            className="uppercase"
          />
        </div>

        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter full name as per documents"
          />
        </div>

        <div>
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={formData.dob}
            onChange={handleInputChange}
          />
        </div>

        <Button
          onClick={handleKYCVerification}
          disabled={loading || !formData.documentType || !formData.idNumber || !formData.name || !formData.dob}
          className="w-full"
        >
          {loading ? 'Verifying...' : 'Verify KYC'}
        </Button>
      </div>
    </div>
  );
} 