"use client";

import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CurrencyRate } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export function CurrencyTicker({
    initialData,
    isLoading
}: {
    initialData: CurrencyRate[],
    isLoading: boolean
}) {

    // 1. Yükleniyorsa veya veri yoksa iskelet göster
    if (isLoading) {
        return (
            <div className="relative w-full overflow-hidden bg-card border border-border p-2 rounded-lg">
                <div className="whitespace-nowrap flex">
                    <Skeleton className="h-5 w-full" />
                </div>
            </div>
        );
    }

    // 2. Veri yüklendi ama boşsa (API hatası vb.)
    if (initialData.length === 0) {
        return (
            <div className="relative w-full overflow-hidden bg-card border border-border p-2 rounded-lg">
                <div className="whitespace-nowrap flex justify-center">
                    <span className="text-sm text-muted-foreground">Kur verileri yüklenemedi</span>
                </div>
            </div>
        );
    }

    // 3. Veri başarıyla yüklendi
    const duplicatedRates = [...initialData, ...initialData];

    const getChangeIcon = (change: number) => {
        if (change > 0) return <ArrowUp className="h-3 w-3 mr-1" />;
        if (change < 0) return <ArrowDown className="h-3 w-3 mr-1" />;
        return <Minus className="h-3 w-3 mr-1" />;
    };

    const getChangeColor = (change: number) => {
        if (change > 0) return "text-primary";
        if (change < 0) return "text-destructive";
        return "text-muted-foreground";
    };

    return (
        <div className="relative w-full overflow-hidden bg-card border border-border p-2 rounded-lg">
            <div className="animate-marquee whitespace-nowrap flex">
                {duplicatedRates.map((rate, index) => (
                    <div key={index} className="flex items-center mx-4">
                        <span className="text-sm font-semibold">{rate.pair}</span>
                        <span className="text-sm mx-2">{rate.rate.toFixed(2)}</span>
                        <span
                            className={cn(
                                "text-xs flex items-center",
                                getChangeColor(rate.change)
                            )}
                        >
                            {getChangeIcon(rate.change)}
                            {rate.change.toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}