import axios from 'axios';

const BASE_URL = 'https://in.staging.decentro.tech/v2/kyc/digilocker';
console.log(process.env.NEXT_PUBLIC_DECENTRO_CLIENT_ID);
const headers = {
  'client-id': process.env.NEXT_PUBLIC_DECENTRO_CLIENT_ID!,
  'client-secret': process.env.NEXT_PUBLIC_DECENTRO_CLIENT_SECRET!,
  'module-secret': process.env.NEXT_PUBLIC_DECENTRO_MODULE_SECRET!,
  'Content-Type': 'application/json'
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers,
  withCredentials: false
});

export const digilockerService = {
  // Initialize Digilocker session
  async initiateSession() {
    try {
      console.log('Initiating Digilocker session...');
      
      const response = await axios.post('/api/digilocker', {
        endpoint: 'initiate_session'
      });
      
      console.log('Session Response:', response.data);
      
      if (response.data.status === 'SUCCESS') {
        // Store transaction ID for future use
        localStorage.setItem('decentroTxnId', response.data.decentroTxnId);
        
        // Redirect to Digilocker
        window.location.href = response.data.data.authorizationUrl;
      } else {
        throw new Error(response.data.message || 'Failed to initiate session');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Digilocker Error:', error);
      throw error;
    }
  },

  // Get issued files
  async getIssuedFiles(transactionId: string) {
    const response = await axios.post('/api/digilocker', {
      endpoint: 'issued_files',
      decentro_txn_id: transactionId
    });
    return response.data;
  },

  // Get eAadhaar data
  async getEAadhaar(transactionId: string) {
    const response = await axios.post('/api/digilocker', {
      endpoint: 'eaadhaar',
      decentro_txn_id: transactionId
    });
    return response.data;
  },

  // Download file
  async downloadFile(transactionId: string, fileUri: string) {
    const response = await axios.post(`${BASE_URL}/file/data`, {
      decentro_txn_id: transactionId,
      uri: fileUri,
      format: "pdf"
    }, { 
      headers,
      responseType: 'blob'
    });
    return response.data;
  }
}; 