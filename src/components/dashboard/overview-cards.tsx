
"use client";

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowDown,
  ArrowUp,
  Banknote,
  CircleDollarSign,
  CreditCard,
  Wallet,
} from 'lucide-react';
import type { DashboardSummary } from '@/lib/types';
import Link from 'next/link';
import { BackgroundGradient } from '../ui/background-gradient';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

interface OverviewCardsProps {
  summary: DashboardSummary | null;
}

export function OverviewCards({ summary }: OverviewCardsProps) {
  // Hesaplanan değerler (API'den gelmiyorsa türetilir)
  const netWorth = summary?.totalNetWorth || 0;
  const cashFlow = (summary?.monthlyIncome || 0) - (summary?.monthlyExpense || 0);

  // Şimdilik Total Assets/Debts API'de yoksa NetWorth üzerinden tahmini veya 0 gösterelim
  // Backend'e eklemek en iyisi ama şimdilik summary'den geleni kullanacağız.
  // DashboardSummaryDto'da bu alanlar yoktu (TotalNetWorth var).
  // TotalAssets ve TotalDebts için backend güncellemesi gerekebilir ama şimdilik
  // NetWorth pozitif ise Asset kabul edelim.
  const totalAssets = netWorth > 0 ? netWorth : 0;
  const totalDebts = 0; // Backend dnerse ekleriz

  const overviewData = [
    {
      id: 'net-worth',
      title: 'Net Değer',
      value: netWorth,
      icon: Wallet,
      footer: <p className="text-xs text-muted-foreground">Güncel Bakiye</p>,
      href: '/dashboard/investments',
    },
    {
      id: 'cash-flow',
      title: 'Nakit Akışı (Bu Ay)',
      value: cashFlow,
      icon: Banknote,
      footer: <p className="text-xs text-muted-foreground">Gelir - Gider</p>,
    },
    {
      id: 'monthly-income', // Total Assets yerine Gelir koyalım daha anlamlı API verisiyle
      title: 'Bu Ay Gelir',
      value: summary?.monthlyIncome || 0,
      icon: CircleDollarSign,
      footer: (
        <div className="flex items-center text-xs text-muted-foreground">
          <ArrowUp className="h-3 w-3 text-primary" />
          <span className="text-primary ml-1">Girişler</span>
        </div>
      ),
    },
    {
      id: 'monthly-expense', // Total Debts yerine Gider koyalım
      title: 'Bu Ay Gider',
      value: summary?.monthlyExpense || 0,
      icon: CreditCard,
      footer: (
        <div className="flex items-center text-xs text-muted-foreground">
          <ArrowDown className="h-3 w-3 text-destructive" />
          <span className="text-destructive ml-1">Çıkışlar</span>
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {overviewData.map((item) => {
        const content = (
          <BackgroundGradient className="rounded-lg h-full" animate={false}>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className="h-3 w-3 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(item.value)}</div>
                {item.footer}
              </CardContent>
            </Card>
          </BackgroundGradient>
        );

        if ((item as any).href) {
          return (
            <Link href={(item as any).href} key={item.id} className="block h-full cursor-pointer hover:opacity-90 transition-opacity">
              {content}
            </Link>
          );
        }

        return <div key={item.id} className="h-full">{content}</div>;
      })}
    </div>
  );
}
