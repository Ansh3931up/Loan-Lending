import axios from 'axios';

const DECENTRO_BASE_URL = 'https://in.staging.decentro.tech/v2';
const CLIENT_ID = process.env.NEXT_PUBLIC_DECENTRO_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_DECENTRO_CLIENT_SECRET;
const PROVIDER_SECRET = process.env.NEXT_PUBLIC_DECENTRO_PROVIDER_SECRET;
const MODULE_SECRET = process.env.NEXT_PUBLIC_DECENTRO_MODULE_SECRET;

const decentroApi = axios.create({
  baseURL: DECENTRO_BASE_URL,
  headers: {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'module_secret': MODULE_SECRET,
    'provider_secret': PROVIDER_SECRET,
  }
});

export const verifyKYC = async (pan: string, aadhaar: string) => {
  try {
    const response = await decentroApi.post('/kyc/pan_verification', {
      pan_number: pan,
      consent: 'Y',
      consent_purpose: 'For loan verification'
    });
    
    return response.data;
  } catch (error) {
    console.error('KYC Verification Error:', error);
    throw error;
  }
};

export const createVirtualAccount = async (customerId: string, name: string) => {
  try {
    const response = await decentroApi.post('/banking/account/virtual', {
      customer_id: customerId,
      name: name,
      bank_code: "ICIC", // ICICI Bank
      account_type: "CURRENT"
    });
    
    return response.data;
  } catch (error) {
    console.error('Virtual Account Creation Error:', error);
    throw error;
  }
};

export const getTransactionHistory = async (accountId: string) => {
  try {
    const response = await decentroApi.get(`/banking/account/transactions?account_id=${accountId}`);
    
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
    const response = await decentroApi.post('/payments/upi/link', {
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