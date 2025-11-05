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
import { Transaction, TransactionType } from "@/lib/types"; // 👈 TransactionType import edildi
import { cn } from "@/lib/utils";

interface TransactionsTableProps {
    transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY', // 👈 TODO: Bunu dinamik hale getirebilirsin (transaction.assetType.code)
        }).format(value);

    // 👈 Tarih formatlama fonksiyonu eklendi
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        // 👈 Tablonun etrafına bir kenarlık ekliyoruz
        <div className="overflow-x-auto rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Açıklama / Kaynak</TableHead>
                        <TableHead>Tarih</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead className="text-right">Tutar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* ✅ Kontrolü tablonun içine taşıdık */}
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <TableRow key={transaction.transactionId}>
                                {/* 👈 Backend verisine göre güncellendi */}
                                <TableCell className="font-medium">
                                    {/* 👈 'title' kullanıldı */}
                                    <div>{transaction.title || "İsimsiz İşlem"}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {/* 👈 İlişkili verilerin (nested) null olup olmadığını kontrol et */}
                                        {transaction.source?.sourceName} ({transaction.assetType?.code})
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {formatDate(transaction.transactionDate)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{transaction.category?.name}</Badge>
                                </TableCell>
                                <TableCell
                                    className={cn(
                                        "text-right font-medium",
                                        // 👈 'transactionType' enum'u kullanıldı
                                        transaction.transactionType === TransactionType.Income
                                            ? "text-primary"
                                            : "text-white"
                                    )}
                                >
                                    {transaction.transactionType === TransactionType.Income ? '+' : '-'}
                                    {formatCurrency(transaction.amount)}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        // ✅ Veri yoksa gösterilecek özel tablo satırı
                        <TableRow>
                            <TableCell
                                colSpan={4} // 4 kolonumuz var, tamamını kapsasın
                                className="h-24 text-center text-muted-foreground"
                            >
                                Henüz bir işlem eklenmemiş.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}