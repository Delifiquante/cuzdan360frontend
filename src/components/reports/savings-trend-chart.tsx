"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface SavingsTrendChartProps {
    data: { month: string; savings: number }[];
}

const chartConfig = {
    savings: {
        label: "Tasarruf",
        color: "hsl(var(--chart-3))",
    },
};

export function SavingsTrendChart({ data }: SavingsTrendChartProps) {
    return (
        <div className="h-full w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
                <LineChart
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
                        vertical={false}
                        opacity={0.3}
                    />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => `${value} ₺`}
                    />
                    <ChartTooltip
                        cursor={{ stroke: 'hsl(var(--chart-3))', strokeWidth: 2, strokeDasharray: '5 5' }}
                        content={<ChartTooltipContent
                            indicator="line"
                            labelFormatter={(value) => `Ay: ${value}`}
                        />}
                    />
                    <ReferenceLine
                        y={0}
                        stroke="hsl(var(--muted-foreground))"
                        strokeDasharray="3 3"
                        opacity={0.5}
                    />
                    <Line
                        dataKey="savings"
                        type="monotone"
                        stroke="var(--color-savings)"
                        strokeWidth={3}
                        dot={{
                            fill: "var(--color-savings)",
                            r: 4,
                        }}
                        activeDot={{
                            r: 6,
                        }}
                        isAnimationActive={true}
                        animationDuration={1000}
                        animationEasing="ease-in-out"
                    />
                </LineChart>
            </ChartContainer>
        </div>
    );
}
