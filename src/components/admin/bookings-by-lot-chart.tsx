"use client"

import { Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface BookingsByLotChartProps {
  bookings: { id: string; lotId: string; lotName: string; price: number }[];
  lots: { id: string; name: string; availableSlots: number; totalSlots: number }[];
}

const chartConfig = {
  bookings: {
    label: "Bookings",
  },
} satisfies ChartConfig

export function BookingsByLotChart({ bookings, lots }: BookingsByLotChartProps) {
  if (!bookings || !lots || bookings.length === 0 || lots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
        <p>No booking data available.</p>
      </div>
    );
  }

  // Count bookings by lot
  const bookingsByLot: Record<string, { count: number; lotName: string }> = {};
  
  bookings.forEach(booking => {
    if (!bookingsByLot[booking.lotId]) {
      bookingsByLot[booking.lotId] = { count: 0, lotName: booking.lotName };
    }
    bookingsByLot[booking.lotId].count += 1;
  });

  // Transform data for pie chart
  const chartData = Object.entries(bookingsByLot).map(([lotId, data], index) => {
    // Generate a color based on index
    const hue = (index * 137.508) % 360; // Golden angle approximation
    return {
      name: data.lotName,
      bookings: data.count,
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
          dataKey="bookings"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        />
      </PieChart>
    </ChartContainer>
  )
}
