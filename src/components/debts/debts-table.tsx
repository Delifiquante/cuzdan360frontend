import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { debts } from "@/lib/data";

export function DebtsTable() {
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
            <TableHead>Alacaklı</TableHead>
            <TableHead>Vade Tarihi</TableHead>
            <TableHead className="text-center">Faiz Oranı</TableHead>
            <TableHead className="text-right">Borç Miktarı</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {debts.map((debt) => (
            <TableRow key={debt.id}>
              <TableCell className="font-medium">{debt.creditor}</TableCell>
              <TableCell className="text-muted-foreground">{debt.dueDate}</TableCell>
              <TableCell className="text-center font-medium">
                %{debt.interestRate.toFixed(1)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(debt.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
