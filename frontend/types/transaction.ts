export type TransactionStatus = "APPROVED" | "PENDING" | "REJECTED";

export interface Transaction {
  id: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  next_emi?: string;
  emi?: number;
} 