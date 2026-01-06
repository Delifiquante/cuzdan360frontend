import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface InvestmentsTableProps {
  transactions: Transaction[];
  onDelete?: (id: number) => void;
}

export function InvestmentsTable({ transactions, onDelete }: InvestmentsTableProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(value);

  // Group transactions by Asset Type logic could go here if we wanted to show portfolio summary
  // For now, let's list them as individual asset entries as requested.

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Varlık İsmi</TableHead>
            <TableHead>Sembol / Tip</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className="text-right">Değer (Giriş)</TableHead>
            {/* Change column not applicable for individual transactions yet unless we fetch live data */}
            {/* We can re-add it later with live price integration */}
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                Henüz varlık eklenmemiş.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.transactionId}>
                <TableCell className="font-medium">
                  {transaction.title || transaction.assetType?.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {transaction.assetType?.code || transaction.assetType?.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {transaction.category?.name}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(transaction.transactionId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
