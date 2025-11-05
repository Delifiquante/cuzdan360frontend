"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { netWorthHistory as chartData } from "@/lib/data";

const chartConfig = {
  netWorth: {
    label: "Net Değer",
    color: "hsl(var(--chart-1))",
  },
};

export function NetWorthChart() {
  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
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
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
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
            type="natural"
            fill="url(#fillNetWorth)"
            fillOpacity={0.4}
            stroke="var(--color-netWorth)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
