import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { upcomingPayments } from "@/lib/data";

export function UpcomingPayments() {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(value);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Açıklama</TableHead>
          <TableHead>Vade Tarihi</TableHead>
          <TableHead className="text-right">Tutar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {upcomingPayments
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(payment.dueDate)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(payment.amount)}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
