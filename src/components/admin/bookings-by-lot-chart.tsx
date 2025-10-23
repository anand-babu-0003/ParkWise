"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"

const chartData = [
  { lot: "Downtown", bookings: 275, fill: "var(--color-downtown)" },
  { lot: "Uptown", bookings: 200, fill: "var(--color-uptown)" },
  { lot: "Riverside", bookings: 187, fill: "var(--color-riverside)" },
  { lot: "Airport", bookings: 173, fill: "var(--color-airport)" },
]

const chartConfig = {
  bookings: {
    label: "Bookings",
  },
  downtown: {
    label: "Downtown",
    color: "hsl(var(--chart-1))",
  },
  uptown: {
    label: "Uptown",
    color: "hsl(var(--chart-2))",
  },
  riverside: {
    label: "Riverside",
    color: "hsl(var(--chart-3))",
  },
  airport: {
    label: "Airport",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function BookingsByLotChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[350px]"
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
            />
            <Pie
                data={chartData}
                dataKey="bookings"
                nameKey="lot"
                innerRadius={60}
                strokeWidth={5}
                labelLine={false}
                label={({
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cy + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (
                        <text
                        x={x}
                        y={y}
                        fill="hsl(var(--card-foreground))"
                        textAnchor={x > cy ? "start" : "end"}
                        dominantBaseline="central"
                        className="text-xs font-bold"
                        >
                        {`${(percent * 100).toFixed(0)}%`}
                        </text>
                    );
                }}
            >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="lot" />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
