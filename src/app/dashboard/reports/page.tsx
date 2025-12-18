
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { NetWorthChart } from "@/components/reports/net-worth-chart";
import { IncomeExpenseChart } from "@/components/reports/income-expense-chart";
import { SavingsTrendChart } from "@/components/reports/savings-trend-chart";
import { BackgroundGradient } from '@/components/ui/background-gradient';

export default function ReportsPage() {

  return (
    <>
      <PageHeader title="Finansal Raporlar" />
      <main className="p-4 md:p-6 space-y-6">

        {/* Ana Grafik: Net Değer - Tam Genişlik */}
        <BackgroundGradient className="rounded-lg" animate={false}>
          <Card>
            <CardHeader>
              <CardTitle>Zaman İçinde Net Değer</CardTitle>
              <CardDescription>
                Geçtiğimiz aylardaki net değer artışınızın görsel bir temsili.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NetWorthChart />
            </CardContent>
          </Card>
        </BackgroundGradient>

        {/* Alt Satır: İki Küçük Grafik Yan Yana */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Sol: Gelir vs Gider */}
          <BackgroundGradient className="rounded-lg" animate={false}>
            <Card>
              <CardHeader>
                <CardTitle>Gelir vs Gider</CardTitle>
                <CardDescription>
                  Aylık gelir ve gider karşılaştırması
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IncomeExpenseChart />
              </CardContent>
            </Card>
          </BackgroundGradient>

          {/* Sağ: Tasarruf Trendi */}
          <BackgroundGradient className="rounded-lg" animate={false}>
            <Card>
              <CardHeader>
                <CardTitle>Tasarruf Trendi</CardTitle>
                <CardDescription>
                  Aylık tasarruf değişiminiz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SavingsTrendChart />
              </CardContent>
            </Card>
          </BackgroundGradient>

        </div>
      </main>
    </>
  );
}
