import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { transactions } from "@/lib/data";
import { cn } from "@/lib/utils";
import { TransactionType } from "@/lib/types";

export function RecentTransactions() {
  const recentTransactions = transactions.slice(0, 5);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(value);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Açıklama</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead className="text-right">Tutar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentTransactions.map((transaction) => (
          <TableRow key={transaction.transactionId} className="h-16">
            <TableCell>
              <div className="font-medium">{transaction.title || 'İşlem'}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(transaction.transactionDate).toLocaleDateString('tr-TR')}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{transaction.category.name}</Badge>
            </TableCell>
            <TableCell
              className={cn(
                "text-right font-medium",
                transaction.transactionType === TransactionType.Income
                  ? "text-primary"
                  : "text-white"
              )}
            >
              {transaction.transactionType === TransactionType.Income ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
