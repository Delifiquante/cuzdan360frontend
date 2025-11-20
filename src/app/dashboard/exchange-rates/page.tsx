
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { RecommendationsForm } from "@/components/exchange-rates/recommendations-form";
import { Lightbulb } from "lucide-react";
import { BackgroundGradient } from '@/components/ui/background-gradient';

export default function ExchangeRatesPage() {

  return (
    <>
      <PageHeader title="AI Döviz Kuru Analizi" />
      <main className="p-4 md:p-6">
         <div className="space-y-6">
          <BackgroundGradient className="rounded-lg" animate={false}>
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Lightbulb className="w-6 h-6 text-primary" />
                 <span>Haber Önerileri</span>
               </CardTitle>
               <CardDescription>
                 Piyasa verilerini ve haberleri analiz etmek için yapay zekadan yararlanın, size döviz kuru fırsatları hakkında kişiselleştirilmiş makale önerileri sunar.
               </CardDescription>
             </CardHeader>
             <CardContent>
               <RecommendationsForm />
             </CardContent>
           </Card>
           </BackgroundGradient>
        </div>
      </main>
    </>
  );
}
