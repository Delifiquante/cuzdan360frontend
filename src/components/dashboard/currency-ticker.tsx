
"use client";

import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { currencyRates } from '@/lib/data';
import { cn } from '@/lib/utils';

export function CurrencyTicker() {
  // Animasyon için verileri ikiye katlıyoruz
  const duplicatedRates = [...currencyRates, ...currencyRates];

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
                rate.change >= 0 ? "text-primary" : "text-destructive"
              )}
            >
              {rate.change >= 0 ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {rate.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
