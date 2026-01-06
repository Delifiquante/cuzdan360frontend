"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { NetWorthChart } from "@/components/reports/net-worth-chart";
import { IncomeExpenseChart } from "@/components/reports/income-expense-chart";
import { SavingsTrendChart } from "@/components/reports/savings-trend-chart";
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { useReportData } from '@/hooks/use-report-data';
import { Skeleton } from '@/components/ui/skeleton';
import { AiRecommendationsSection } from "@/components/reports/ai/ai-recommendations-section";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportsPage() {
  const { isLoading, monthlyData, netWorthHistory } = useReportData();
  const [currentIndex, setCurrentIndex] = useState(0);

  const charts = [
    {
      title: "Zaman İçinde Net Değer",
      description: "Geçtiğimiz aylardaki net değer artışınızın görsel bir temsili.",
      component: isLoading ? <Skeleton className="h-full w-full" /> : <NetWorthChart data={netWorthHistory} />
    },
    {
      title: "Gelir ve Gider Dengesi",
      description: "Aylık gelir ve gider karşılaştırması.",
      component: isLoading ? <Skeleton className="h-full w-full" /> : <IncomeExpenseChart data={monthlyData} />
    },
    {
      title: "Aylık Tasarruf Trendi",
      description: "Düzenli tasarruf alışkanlığınızın analizi.",
      component: isLoading ? <Skeleton className="h-full w-full" /> : <SavingsTrendChart data={monthlyData} />
    }
  ];

  const nextChart = () => {
    setCurrentIndex((prev) => (prev + 1) % charts.length);
  };

  const prevChart = () => {
    setCurrentIndex((prev) => (prev - 1 + charts.length) % charts.length);
  };

  return (
    <>
      <PageHeader title="Finansal Raporlar" />
      <main className="p-4 md:p-6 h-[calc(100vh-80px)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">

          {/* Sol: Grafikler Slider */}
          <section className="h-full min-h-0">
            <BackgroundGradient className="rounded-xl h-full" animate={false}>
              <Card className="h-full flex flex-col border-none shadow-none relative">
                <CardHeader className="pb-2 shrink-0 border-b border-border/40">
                  {/* Header content updates with slide, but we keep the main container static for stability */}
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Finansal Grafikler</CardTitle>
                      <CardDescription>
                        {currentIndex + 1} / {charts.length} - {charts[currentIndex].title}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 min-h-0 p-6 relative flex flex-col justify-center">
                  <div className="flex-1 flex items-center justify-center w-full">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full flex flex-col"
                      >
                        <div className="flex-1 min-h-0 w-full">
                          {/* Chart Title repeated inside for context if needed, or rely on header */}
                          <h3 className="text-lg font-semibold mb-2 sr-only">{charts[currentIndex].title}</h3>
                          {charts[currentIndex].component}
                        </div>
                        <p className="text-sm text-muted-foreground text-center mt-4">
                          {charts[currentIndex].description}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </CardContent>

                {/* Navigation Buttons - Bottom Right */}
                <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevChart}
                    className="bg-background/80 hover:bg-background backdrop-blur-sm rounded-full w-10 h-10 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextChart}
                    className="bg-background/80 hover:bg-background backdrop-blur-sm rounded-full w-10 h-10 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            </BackgroundGradient>
          </section>

          {/* Sağ: Yapay Zeka (Sabit) */}
          <section className="h-full min-h-0">
            <AiRecommendationsSection />
          </section>

        </div>
      </main>
    </>
  );
}
