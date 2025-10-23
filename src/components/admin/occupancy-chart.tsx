"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { time: "06:00", occupancy: 35 },
  { time: "08:00", occupancy: 62 },
  { time: "10:00", occupancy: 78 },
  { time: "12:00", occupancy: 85 },
  { time: "14:00", occupancy: 80 },
  { time: "16:00", occupancy: 70 },
  { time: "18:00", occupancy: 55 },
  { time: "20:00", occupancy: 40 },
]

const chartConfig = {
  occupancy: {
    label: "Occupancy",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

export function OccupancyChart() {
  return (
     <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height={350}>
            <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
                left: 0,
                right: 20,
                top: 20,
                bottom: 5,
            }}
            >
            <CartesianGrid vertical={false} />
            <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value}
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
            <Area
                dataKey="occupancy"
                type="natural"
                fill="var(--color-occupancy)"
                fillOpacity={0.4}
                stroke="var(--color-occupancy)"
                stackId="a"
                unit="%"
            />
            </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
  )
}
