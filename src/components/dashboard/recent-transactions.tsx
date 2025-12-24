import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TransactionType, type Transaction } from "@/lib/types";

// Backend DTO might return flattened fields instead of nested objects
interface TransactionDto extends Omit<Transaction, 'category' | 'source' | 'assetType'> {
  categoryName?: string;
  sourceName?: string;
  category?: { name: string }; // Compatible if mapped
}

interface RecentTransactionsProps {
  transactions: TransactionDto[] | Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(value);

  if (!transactions || transactions.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">İşlem bulunamadı.</div>;
  }

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
        {transactions.map((transaction) => (
          <TableRow key={transaction.transactionId} className="h-16">
            <TableCell>
              <div className="font-medium">{transaction.title || 'İşlem'}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(transaction.transactionDate).toLocaleDateString('tr-TR')}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{(transaction as any).category?.name || (transaction as any).categoryName || 'Diğer'}</Badge>
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
