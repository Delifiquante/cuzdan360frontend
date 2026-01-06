import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/lib/types";

interface DebtsTableProps {
  transactions: Transaction[];
  onDelete?: (id: number) => void;
}

export function DebtsTable({ transactions, onDelete }: DebtsTableProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(value);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Alacaklı / Açıklama</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Tarih</TableHead>
            <TableHead className="text-right">Borç Miktarı</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                Henüz borç eklenmemiş.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((debt) => (
              <TableRow key={debt.transactionId}>
                <TableCell className="font-medium">{debt.title || debt.assetType?.name}</TableCell>
                <TableCell className="text-muted-foreground">{debt.category?.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(debt.transactionDate).toLocaleDateString('tr-TR')}
                </TableCell>
                <TableCell className="text-right font-medium text-destructive">
                  {formatCurrency(debt.amount)}
                </TableCell>
                <TableCell>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(debt.transactionId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )))}
        </TableBody>
      </Table>
    </div>
  );
}
