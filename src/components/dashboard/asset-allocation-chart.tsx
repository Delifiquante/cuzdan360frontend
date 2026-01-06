"use client";

import { Pie, PieChart, Cell } from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig
} from "@/components/ui/chart";
import type { ChartDataPoint } from "@/lib/types";

import { useRouter } from "next/navigation";

interface AssetAllocationChartProps {
    data: ChartDataPoint[];
}

export function AssetAllocationChart({ data }: AssetAllocationChartProps) {
    const router = useRouter();

    // Generate colors dynamically if not present, or use css vars
    const chartData = data?.map((d, index) => ({
        ...d,
        fill: d.fill || `hsl(var(--chart-${(index % 5) + 1}))`
    })) || [];

    const chartConfig = {
        value: {
            label: "Value",
        },
        ...Object.fromEntries(chartData.map(d => [d.label.toLowerCase(), { label: d.label }])),
    } satisfies ChartConfig;

    if (chartData.length === 0) {
        return <div className="flex items-center justify-center h-[350px] text-muted-foreground">Veri yok.</div>;
    }

    return (
        <ChartContainer
            config={chartConfig}
            className="h-[350px] w-full cursor-pointer hover:opacity-90 transition-all duration-200 hover:scale-[1.01]"
            onClick={() => router.push('/dashboard/reports')}
        >
            <PieChart className="cursor-pointer">
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={50}
                    strokeWidth={5}
                    className="cursor-pointer"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} className="cursor-pointer hover:opacity-80" />
                    ))}
                </Pie>
            </PieChart>
        </ChartContainer>
    );
}