import axios from "axios";

const DECENTRO_BASE_URL = "https://in.staging.decentro.tech";

const decentroApi = axios.create({
  baseURL: DECENTRO_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "client_id": "Loainfy_7_sop",
    "client_secret": "6089f860bb6740c1aa0234f611f06910",
    "module_secret": "157b0493ded94d79941bd1974bd30488",
  },
});

// For development, use mock data
import { mockTransactions } from "./mockData";

export const verifyBankAccount = async (accountNumber: string, ifsc: string) => {
  try {
    const response = await decentroApi.post("/v2/banking/verify-account", {
      account_number: accountNumber,
      ifsc_code: ifsc,
      module_secret: process.env.NEXT_PUBLIC_DECENTRO_CORE_BANKING_SECRET,
    });

    return response.data;
  } catch (error) {
    console.error("Error verifying bank account:", error);
    throw error;
  }
};

export const disburseLoan = async (
  userId: string, 
  amount: number, 
  accountNumber: string, 
  ifsc: string
) => {
  try {
    const response = await decentroApi.post("/v2/payments/upi/link", {
      user_id: userId,
      amount: amount,
      account_number: accountNumber,
      ifsc_code: ifsc,
      module_secret: process.env.NEXT_PUBLIC_DECENTRO_PAYMENTS_SECRET,
    });

    return response.data;
  } catch (error) {
    console.error("Error processing loan payment:", error);
    throw error;
  }
};

export const getTransactionHistory = async (userId: string) => {
  // For development, return mock data
  return mockTransactions;

  // When ready for production, uncomment this:
  /*
  try {
    const response = await decentroApi.get("/v2/payments/transaction", {
      params: { 
        user_id: userId,
        module_secret: process.env.NEXT_PUBLIC_DECENTRO_PAYMENTS_SECRET 
      },
    });

    return response.data.transactions;
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    throw error;
  }
  */
};

export default decentroApi; 