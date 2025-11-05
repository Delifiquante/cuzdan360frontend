import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { investments } from "@/lib/data";
import { cn } from "@/lib/utils";

export function InvestmentsTable() {
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
            <TableHead>Yatırım</TableHead>
            <TableHead>Sembol</TableHead>
            <TableHead className="text-right">Değer</TableHead>
            <TableHead className="text-right">24s Değişim</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments.map((investment) => (
            <TableRow key={investment.id}>
              <TableCell className="font-medium">{investment.name}</TableCell>
              <TableCell className="text-muted-foreground">{investment.ticker}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(investment.value)}
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={cn(
                    "flex items-center justify-end font-medium",
                    investment.change >= 0 ? "text-primary" : "text-destructive"
                  )}
                >
                  {investment.change >= 0 ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  )}
                  %{investment.change.toFixed(1)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
