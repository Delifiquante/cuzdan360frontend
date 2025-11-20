
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { InvestmentsTable } from "@/components/investments/investments-table";
import { BackgroundGradient } from '@/components/ui/background-gradient';

export default function InvestmentsPage() {
  return (
    <>
      <PageHeader title="Yatırımlar" />
      <main className="p-4 md:p-6">
        <div className="space-y-6">
          <BackgroundGradient className="rounded-lg" animate={false}>
           <Card>
             <CardHeader>
               <CardTitle>Yatırım Portföyü</CardTitle>
             </CardHeader>
             <CardContent>
               <InvestmentsTable />
             </CardContent>
           </Card>
           </BackgroundGradient>
        </div>
      </main>
    </>
  );
}
