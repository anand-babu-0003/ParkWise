"use client"

import { Pie, PieChart } from "recharts"
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
  },
  cityCenter: {
    label: "City Center",
    color: "hsl(var(--chart-1))",
  },
  mall: {
    label: "Mall",
    color: "hsl(var(--chart-2))",
  },
  airport: {
    label: "Airport",
    color: "hsl(var(--chart-3))",
  },
  stadium: {
    label: "Stadium",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function OccupancyChart({ data }: OccupancyChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
        <p>No occupancy data available.</p>
      </div>
    );
  }

  // Transform data for pie chart
  const chartData = data.map((item, index) => {
    // Generate a color based on index
    const hue = (index * 137.508) % 360; // Golden angle approximation
    return {
      name: item.name,
      occupancy: item.occupancy,
      fill: `hsl(${hue}, 70%, 50%)`,
    };
  });

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="occupancy"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        />
      </PieChart>
    </ChartContainer>
  )
}