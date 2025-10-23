"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function RevenueChart({ data }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
        <p>No revenue data available.</p>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{
          right: 16,
          left: 70,
        }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="month"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) => value.slice(0, 3)}
          hide={data.length > 12} // Hide Y axis labels if too many
        />
        <XAxis dataKey="revenue" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar
          dataKey="revenue"
          layout="vertical"
          fill="var(--color-revenue)"
          radius={4}
        >
          <LabelList
            dataKey="revenue"
            position="right"
            offset={8}
            className="fill-foreground"
            formatter={(value: number) => `₹${value.toLocaleString()}`}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}