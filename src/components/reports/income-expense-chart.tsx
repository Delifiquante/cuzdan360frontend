"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { incomeVsExpenses as chartData } from "@/lib/data";

const chartConfig = {
    income: {
        label: "Gelir",
        color: "hsl(var(--chart-2))",
    },
    expenses: {
        label: "Gider",
        color: "hsl(var(--chart-5))",
    },
};

export function IncomeExpenseChart() {
    return (
        <div className="h-[280px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart
                    accessibilityLayer
                    data={chartData}
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
                        tickFormatter={(value) => `${Number(value) / 1000}k ₺`}
                    />
                    <ChartTooltip
                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                        content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: '10px' }}
                        iconType="rect"
                    />
                    <Bar
                        dataKey="income"
                        fill="var(--color-income)"
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={true}
                        animationDuration={800}
                        animationBegin={0}
                    />
                    <Bar
                        dataKey="expenses"
                        fill="var(--color-expenses)"
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={true}
                        animationDuration={800}
                        animationBegin={200}
                    />
                </BarChart>
            </ChartContainer>
        </div>
    );
}
