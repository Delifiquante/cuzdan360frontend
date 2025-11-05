"use client";

import { Pie, PieChart, Cell } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { assetAllocation as chartData } from "@/lib/data";

const chartConfig = {
  value: {
    label: "Value",
  },
  ...Object.fromEntries(chartData.map(d => [d.name.toLowerCase(), { label: d.name }])),
};

export function AssetAllocationChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[420] w-[420]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          strokeWidth={5}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
