import decentroApi from "@/utils/decentro";

interface UPIPaymentRequest {
  amount: number;
  payeeAccount: string;
  payeeIfsc?: string;
  purpose?: string;
  expiryTime?: string;
}

export const upiService = {
  // Generate UPI Payment Link
  async generatePaymentLink(data: UPIPaymentRequest) {
    try {
      const response = await decentroApi.post("/v2/payments/upi/link", {
        reference_id: `PAY${Date.now()}`,
        payee_account: data.payeeAccount,
        amount: data.amount,
        purpose_message: data.purpose || "Payment",
        expiry_time: data.expiryTime || "30", // minutes
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check UPI ID/VPA
  async validateUpiId(upiId: string) {
    try {
      const response = await decentroApi.post("/v2/payments/vpa/validate", {
        reference_id: `VAL${Date.now()}`,
        vpa: upiId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check Transaction Status
  async checkTransactionStatus(transactionId: string) {
    try {
      const response = await decentroApi.get(`/v2/payments/transaction/${transactionId}/status`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get Balance
  async checkBalance(accountNumber: string, ifsc: string) {
    try {
      const response = await decentroApi.post("/v2/banking/account/balance", {
        reference_id: `BAL${Date.now()}`,
        account_number: accountNumber,
        ifsc_code: ifsc,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get Transaction History
  async getTransactionHistory(accountNumber: string, ifsc: string) {
    try {
      const response = await decentroApi.post("/v2/banking/account/transactions", {
        reference_id: `TXN${Date.now()}`,
        account_number: accountNumber,
        ifsc_code: ifsc,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Issue UPI Collect Request
  async issueCollectRequest(upiId: string, amount: number, purpose: string) {
    try {
      const response = await decentroApi.post("/v2/payments/upi/collect", {
        reference_id: `COL${Date.now()}`,
        payer_vpa: upiId,
        amount: amount,
        purpose_message: purpose,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Bank Account to UPI Transfer
  async bankToUpiTransfer(data: {
    fromAccount: string,
    fromIfsc: string,
    toUpiId: string,
    amount: number
  }) {
    try {
      const response = await decentroApi.post("/v2/payments/upi/transfer", {
        reference_id: `TRF${Date.now()}`,
        source_account: data.fromAccount,
        source_ifsc: data.fromIfsc,
        target_vpa: data.toUpiId,
        amount: data.amount,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 