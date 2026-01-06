"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface NetWorthChartProps {
  data: { date: string; netWorth: number }[];
}

const chartConfig = {
  netWorth: {
    label: "Net Değer",
    color: "hsl(var(--chart-1))",
  },
};

export function NetWorthChart({ data }: NetWorthChartProps) {
  return (
    <div className="h-full w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12,
            top: 12,
            bottom: 12,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={true}
            horizontal={true}
            opacity={0.3}
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${Number(value) / 1000}k ₺`}
          />
          <ChartTooltip
            cursor={{ stroke: 'hsl(var(--chart-1))', strokeWidth: 2, strokeDasharray: '5 5' }}
            content={<ChartTooltipContent
              indicator="dot"
              labelFormatter={(value) => `Tarih: ${value}`}
            />}
          />
          <defs>
            <linearGradient id="fillNetWorth" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-netWorth)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-netWorth)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="netWorth"
            type="monotone"
            fill="url(#fillNetWorth)"
            fillOpacity={0.4}
            stroke="var(--color-netWorth)"
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
