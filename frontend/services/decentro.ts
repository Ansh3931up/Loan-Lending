import axios from 'axios';

const BASE_URL = 'https://in.staging.decentro.tech/v2';
const headers = {
  'client-id': process.env.NEXT_PUBLIC_DECENTRO_CLIENT_ID!,
  'client-secret': process.env.NEXT_PUBLIC_DECENTRO_CLIENT_SECRET!,
  'module-secret': process.env.NEXT_PUBLIC_DECENTRO_MODULE_SECRET!,
  'Content-Type': 'application/json'
};

export const verifyKYC = async (params: {
  reference_id: string;
  document_type: string;
  id_number: string;
  consent: string;
  consent_purpose: string;
}) => {
  const response = await axios.post('/api/kyc', params);
  return response.data;
};

export const createVirtualAccount = async (formData: {
  name: string;
  customerId: string;
  pan: string;
  email: string;
  mobile: string;
}) => {
  console.log('Calling createVirtualAccount API...');
  
  const payload = {
    bank_codes: ["ICIC"], // Using ICICI Bank
    name: formData.name,
    pan: formData.pan,
    email: formData.email,
    mobile: formData.mobile,
    kyc_verified: 1,
    kyc_check_decentro: 0,
    customer_id: formData.customerId,
    virtual_account_balance_settlement: "enabled",
    generate_static_qr: 1
  };

  console.log('Request Payload:', payload);

  try {
    const response = await axios.post('/api/banking/virtual-account', payload);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

export const getTransactionHistory = async (accountId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/banking/account/transactions?account_id=${accountId}`);
    
    return response.data.data.map((transaction: any) => ({
      id: transaction.transactionId,
      amount: transaction.amount,
      status: transaction.status,
      next_emi: transaction.valueDate
    }));
  } catch (error) {
    console.error('Transaction History Error:', error);
    throw error;
  }
};

export const initiatePayment = async (
  amount: number, 
  beneficiaryAccount: string,
  purpose: string
) => {
  try {
    const response = await axios.post(`${BASE_URL}/payments/upi/link`, {
      amount: amount.toString(),
      payee_account: beneficiaryAccount,
      purpose_message: purpose,
      expiry_time: "30", // 30 minutes
      generate_qr: 1
    });
    
    return response.data;
  } catch (error) {
    console.error('Payment Initiation Error:', error);
    throw error;
  }
}; 