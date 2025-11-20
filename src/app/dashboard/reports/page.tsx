
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { NetWorthChart } from "@/components/reports/net-worth-chart";
import { BackgroundGradient } from '@/components/ui/background-gradient';

export default function ReportsPage() {

  return (
    <>
      <PageHeader title="Finansal Raporlar" />
      <main className="p-4 md:p-6 space-y-6">
        <div className="space-y-6">
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
        </div>
      </main>
    </>
  );
}
