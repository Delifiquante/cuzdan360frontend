// Dosya: src/components/transactions/transactions-table.tsx

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
// import { transactions } from "@/lib/data"; // 👈 Statik veriyi kaldır
import { Transaction } from "@/lib/types"; // 👈 Türü import et
import { cn } from "@/lib/utils";

// 👈 Prop olarak 'transactions' al
interface TransactionsTableProps {
    transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        }).format(value);

    // 👈 Eğer hiç işlem yoksa bir mesaj göster
    if (transactions.length === 0) {
        return <p className="text-center text-muted-foreground">Henüz bir işlem eklenmemiş.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Açıklama</TableHead>
                        <TableHead>Tarih</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead className="text-right">Tutar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* 👈 Prop'tan gelen 'transactions' verisini kullan */}
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell className="font-medium">{transaction.description}</TableCell>
                            <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{transaction.category}</Badge>
                            </TableCell>
                            <TableCell
                                className={cn(
                                    "text-right font-medium",
                                    transaction.type === "income" ? "text-primary" : "text-white"
                                )}
                            >
                                {transaction.type === 'income' ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}