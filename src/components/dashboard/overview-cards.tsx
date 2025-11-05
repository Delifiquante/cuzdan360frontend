
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
import { netWorth, cashFlow, totalAssets, totalDebts } from '@/lib/data';
import { BackgroundGradient } from '../ui/background-gradient';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const overviewData = [
  {
    id: 'net-worth',
    title: 'Net Değer',
    value: netWorth,
    icon: Wallet,
    footer: <p className="text-xs text-muted-foreground">geçen aydan +%2.1</p>,
  },
  {
    id: 'cash-flow',
    title: 'Nakit Akışı',
    value: cashFlow,
    icon: Banknote,
    footer: <p className="text-xs text-muted-foreground">Bu ay</p>,
  },
  {
    id: 'total-assets',
    title: 'Toplam Varlıklar',
    value: totalAssets,
    icon: CircleDollarSign,
    footer: (
      <div className="flex items-center text-xs text-muted-foreground">
        <ArrowUp className="h-3 w-3 text-primary" />
        <span className="text-primary ml-1">%5.2</span>
        <span>&nbsp;bu çeyrek</span>
      </div>
    ),
  },
  {
    id: 'total-debts',
    title: 'Toplam Borçlar',
    value: totalDebts,
    icon: CreditCard,
    footer: (
      <div className="flex items-center text-xs text-muted-foreground">
        <ArrowDown className="h-3 w-3 text-destructive" />
        <span className="text-destructive ml-1">%1.8</span>
        <span>&nbsp;bu çeyrek</span>
      </div>
    ),
  },
];

export function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {overviewData.map((item) => (
        <BackgroundGradient key={item.id} className="rounded-lg" animate={false}>
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
      ))}
    </div>
  );
}
