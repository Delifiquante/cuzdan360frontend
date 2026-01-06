
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { InvestmentsTable } from "@/components/investments/investments-table";
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { AddAssetForm } from "@/components/investments/add-asset-form";
import { getTransactions, deleteTransaction } from '@/lib/services/transactionService';
import { useToast } from "@/hooks/use-toast";
import type { Transaction } from "@/lib/types";

export default function InvestmentsPage() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const allTransactions = await getTransactions();
      // Filter strictly for Assets (TransactionType = 0) which we defined as 'Income'/'Asset Addition' in the form
      // In a real app we might have a specific 'Asset' type or checking AssetTypeId
      // For now, based on AddAssetForm, we save them as Type 0.
      const assetTransactions = allTransactions.filter(t => t.transactionType === 0);
      setTransactions(assetTransactions);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Varlık listesi yüklenemedi.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm("Bu varlığı silmek istediğinize emin misiniz?")) return;

    try {
      await deleteTransaction(id);
      toast({
        title: "Başarılı",
        description: "Varlık silindi.",
      });
      fetchTransactions(); // Refresh list
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Varlık silinirken bir hata oluştu.",
      });
    }
  };

  return (
    <>
      <PageHeader title="Varlıklarım" />
      <main className="p-4 md:p-6">
        <div className="space-y-6">
          <AddAssetForm onAssetAdded={fetchTransactions} />
          <BackgroundGradient className="rounded-lg" animate={false}>
            <Card>
              <CardHeader>
                <CardTitle>Varlıklarım</CardTitle>
              </CardHeader>
              <CardContent>
                <InvestmentsTable transactions={transactions} onDelete={handleDeleteTransaction} />
              </CardContent>
            </Card>
          </BackgroundGradient>
        </div>
      </main>
    </>
  );
}
