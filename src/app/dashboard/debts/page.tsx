
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { DebtsTable } from "@/components/debts/debts-table";
import { BackgroundGradient } from '@/components/ui/background-gradient';

export default function DebtsPage() {
  return (
    <>
      <PageHeader title="Borç Yönetimi" />
      <main className="p-4 md:p-6">
        <div className="space-y-6">
          <BackgroundGradient className="rounded-lg" animate={false}>
            <Card>
              <CardHeader>
                <CardTitle>Tüm Borçlar</CardTitle>
              </CardHeader>
              <CardContent>
                <DebtsTable />
              </CardContent>
            </Card>
          </BackgroundGradient>
        </div>
      </main>
    </>
  );
}
