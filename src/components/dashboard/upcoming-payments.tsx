import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UpcomingPaymentDto } from "@/lib/types";

interface UpcomingPaymentsProps {
  payments: UpcomingPaymentDto[];
}

export function UpcomingPayments({ payments }: UpcomingPaymentsProps) {
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

  if (!payments || payments.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">Yaklaşan ödeme yok.</div>;
  }

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
        {payments
          .sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime())
          .map((payment, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{payment.title}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(payment.nextPaymentDate)}
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
