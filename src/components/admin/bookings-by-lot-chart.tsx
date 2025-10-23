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

type Booking = {
  lotId: string;
};

type ParkingLot = {
  id: string;
  name: string;
};

interface BookingsByLotChartProps {
  bookings: Booking[];
  lots: ParkingLot[];
}

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export function BookingsByLotChart({ bookings, lots }: BookingsByLotChartProps) {
  const bookingsByLot = React.useMemo(() => {
    const lotMap = new Map(lots.map(lot => [lot.id, lot.name]));
    const counts = bookings.reduce((acc, booking) => {
      const lotName = lotMap.get(booking.lotId) || 'Unknown Lot';
      acc[lotName] = (acc[lotName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([lotName, count]) => ({
      lot: lotName,
      bookings: count,
    }));
  }, [bookings, lots]);

  const chartData = React.useMemo(() => {
    return bookingsByLot.map((item, index) => ({
      ...item,
      fill: COLORS[index % COLORS.length]
    }));
  }, [bookingsByLot]);

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      bookings: {
        label: "Bookings",
      },
    };
    chartData.forEach((item, index) => {
      config[item.lot] = {
        label: item.lot,
        color: COLORS[index % COLORS.length],
      }
    });
    return config;
  }, [chartData]);

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
        <p>No booking data available.</p>
      </div>
    );
  }

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
