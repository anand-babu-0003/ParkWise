"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface OccupancyChartProps {
    data: { name: string; occupancy: number }[];
}

const chartConfig = {
  occupancy: {
    label: "Occupancy",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

export function OccupancyChart({ data }: OccupancyChartProps) {
  if (!data || data.length === 0) {
     return (
      <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
        <p>No occupancy data available.</p>
      </div>
    );
  }
  
  return (
     <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height={350}>
            <BarChart
            accessibilityLayer
            data={data}
            margin={{
                left: 0,
                right: 20,
                top: 20,
                bottom: 5,
            }}
            >
            <CartesianGrid vertical={false} />
            <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
            />
             <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar
                dataKey="occupancy"
                fill="var(--color-occupancy)"
                radius={4}
                unit="%"
            />
            </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
  )
}
