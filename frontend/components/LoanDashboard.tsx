import { useEffect, useState } from "react";
import { getTransactionHistory } from "@/utils/decentro";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  amount: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  next_emi?: string;
}

export default function LoanDashboard({ userId }: { userId: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const history = await getTransactionHistory(userId);
        setTransactions(history);
      } catch (err) {
        setError('Failed to fetch loan history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  const getStatusBadge = (status: Transaction['status']) => {
    const variants = {
      APPROVED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REJECTED: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={variants[status]}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  if (loading) {
    return <div>Loading loan history...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loan ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next EMI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>#{loan.id}</TableCell>
                <TableCell>₹{loan.amount.toLocaleString('en-IN')}</TableCell>
                <TableCell>{getStatusBadge(loan.status)}</TableCell>
                <TableCell>{loan.next_emi || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 