import decentroApi from "@/utils/decentro";

interface BankAccountDetails {
  accountNumber: string;
  ifsc: string;
  name: string;
}

interface CreditReport {
  score: number;
  history: any[];
}

export const bankingService = {
  // Verify Bank Account
  async verifyAccount(accountNumber: string, ifsc: string) {
    try {
      const response = await decentroApi.post("/v2/banking/verify-account", {
        account_number: accountNumber,
        ifsc_code: ifsc,
        module_secret: process.env.NEXT_PUBLIC_DECENTRO_CORE_BANKING_SECRET,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generate Credit Report
  async generateCreditReport(customerId: string): Promise<CreditReport> {
    try {
      const response = await decentroApi.post("/v2/banking/generate_credit_report", {
        customer_id: customerId,
        module_secret: process.env.NEXT_PUBLIC_DECENTRO_CORE_BANKING_SECRET,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // KYC Verification using UIStreams
  async initiateKYC(userId: string, redirectUrl: string) {
    try {
      const response = await decentroApi.post("/v2/kyc/uistreams/init", {
        reference_id: userId,
        redirect_url: redirectUrl,
        module_secret: process.env.NEXT_PUBLIC_DECENTRO_CORE_BANKING_SECRET,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Pull Customer Data
  async getCustomerData(customerId: string) {
    try {
      const response = await decentroApi.post("/v2/customer/pull", {
        customer_id: customerId,
        module_secret: process.env.NEXT_PUBLIC_DECENTRO_CORE_BANKING_SECRET,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add Bank Account
  async addBankAccount(accountDetails: BankAccountDetails) {
    try {
      const response = await decentroApi.post("/v2/banking/accounts/add", {
        ...accountDetails,
        module_secret: process.env.NEXT_PUBLIC_DECENTRO_CORE_BANKING_SECRET,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 