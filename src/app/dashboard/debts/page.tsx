
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { DebtsTable } from "@/components/debts/debts-table";
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { AddDebtForm } from "@/components/debts/add-debt-form";
import { getTransactions, deleteTransaction } from '@/lib/services/transactionService';
import { useToast } from "@/hooks/use-toast";
import type { Transaction } from "@/lib/types";

export default function DebtsPage() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const allTransactions = await getTransactions();
      // Filter strictly for Debts (TransactionType = 1)
      const debtTransactions = allTransactions.filter(t => t.transactionType === 1);
      setTransactions(debtTransactions);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Borç listesi yüklenemedi.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm("Bu borcu silmek istediğinize emin misiniz?")) return;

    try {
      await deleteTransaction(id);
      toast({
        title: "Başarılı",
        description: "Borç silindi.",
      });
      fetchTransactions(); // Refresh list
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Borç silinirken bir hata oluştu.",
      });
    }
  };

  return (
    <>
      <PageHeader title="Borç Yönetimi" />
      <main className="p-4 md:p-6">
        <div className="space-y-6">
          <AddDebtForm onDebtAdded={fetchTransactions} />
          <BackgroundGradient className="rounded-lg" animate={false}>
            <Card>
              <CardHeader>
                <CardTitle>Tüm Borçlar</CardTitle>
              </CardHeader>
              <CardContent>
                <DebtsTable transactions={transactions} onDelete={handleDeleteTransaction} />
              </CardContent>
            </Card>
          </BackgroundGradient>
        </div>
      </main>
    </>
  );
}
