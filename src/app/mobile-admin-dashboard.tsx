'use client';

import React from 'react';
import { BarChart3, BrainCircuit, Car, DollarSign, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCollection } from '@/lib/mongodb';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

type Booking = {
  id: string;
  lotId: string;
  lotName: string;
  price: number;
};

type ParkingLot = {
  id: string;
  name: string;
  availableSlots: number;
  totalSlots: number;
};

type Payment = {
    id: string;
    amount: number;
};

type User = {
    id: string;
};

export default function MobileAdminDashboard() {
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useCollection<Booking>('/api/bookings');
  const { data: lots, isLoading: lotsLoading, error: lotsError } = useCollection<ParkingLot>('/api/parking-lots');
  const { data: payments, isLoading: paymentsLoading, error: paymentsError } = useCollection<Payment>('/api/payments');
  const { data: users, isLoading: usersLoading, error: usersError } = useCollection<User>('/api/users');

  const isLoading = bookingsLoading || lotsLoading || paymentsLoading || usersLoading;
  const error = bookingsError || lotsError || paymentsError || usersError;

  const totalRevenue = payments?.reduce((acc, payment) => acc + payment.amount, 0) || 0;
  const totalUsers = users?.length || 0;
  const totalBookings = bookings?.length || 0;
  const activeLots = lots?.length || 0;
  
  const occupancyData = lots 
    ? lots.map(lot => ({
        name: lot.name,
        occupancy: lot.totalSlots > 0 ? ((lot.totalSlots - lot.availableSlots) / lot.totalSlots) * 100 : 0
      })) 
    : [];

  // Calculate revenue data by month
  const revenueData = React.useMemo(() => {
    if (!payments) return [];
    
    // Group payments by month
    const monthlyRevenue: Record<string, number> = {};
    
    payments.forEach(payment => {
      const date = new Date(payment.createdAt);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!monthlyRevenue[monthYear]) {
        monthlyRevenue[monthYear] = 0;
      }
      
      monthlyRevenue[monthYear] += payment.amount;
    });
    
    // Convert to array format for chart
    return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue: Math.round(revenue)
    }));
  }, [payments]);

  if (error) {
    return (
      <div className="flex flex-col min-h-screen p-2">
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-sm">Error Loading Data</AlertTitle>
            <AlertDescription className="text-xs">
                Please check your connection and try again.
            </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen max-w-full">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="flex h-12 items-center justify-between px-2">
          <h1 className="text-base font-bold text-foreground">Admin Dashboard</h1>
          <Button asChild size="sm" className="h-7 text-xs px-2">
            <Link href="/admin/predict">
              <BrainCircuit className="mr-1 h-3 w-3" />
              Predict
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Card className="p-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-1">
                <CardTitle className="text-[10px] font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? <Skeleton className="h-4 w-2/3" /> : <div className="text-sm font-bold">₹{totalRevenue.toFixed(2)}</div>}
                {isLoading ? <Skeleton className="h-2 w-1/2 mt-0.5" /> : <p className="text-[9px] text-muted-foreground">From all bookings</p>}
              </CardContent>
            </Card>
            <Card className="p-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-1">
                <CardTitle className="text-[10px] font-medium">Total Users</CardTitle>
                <Users className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? <Skeleton className="h-4 w-1/2" /> : <div className="text-sm font-bold">{totalUsers}</div>}
                 {isLoading ? <Skeleton className="h-2 w-1/2 mt-0.5" /> : <p className="text-[9px] text-muted-foreground">Registered users</p>}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Card className="p-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-1">
                <CardTitle className="text-[10px] font-medium">Total Bookings</CardTitle>
                <Car className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? <Skeleton className="h-4 w-1/2" /> : <div className="text-sm font-bold">{totalBookings}</div>}
                {isLoading ? <Skeleton className="h-2 w-1/2 mt-0.5" /> : <p className="text-[9px] text-muted-foreground">Across all lots</p>}
              </CardContent>
            </Card>
            <Card className="p-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-1">
                <CardTitle className="text-[10px] font-medium">Active Lots</CardTitle>
                <BarChart3 className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0">
                 {isLoading ? <Skeleton className="h-4 w-1/4" /> : <div className="text-sm font-bold">{activeLots}</div>}
                 {isLoading ? <Skeleton className="h-2 w-1/2 mt-0.5" /> : <p className="text-[9px] text-muted-foreground">Managed locations</p>}
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend - Simple List */}
          <Card className="p-2">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-sm">Revenue Trend</CardTitle>
              <CardDescription className="text-[9px]">Last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-5 w-full" />
                  ))}
                </div>
              ) : revenueData.length === 0 ? (
                <p className="text-muted-foreground text-center py-2 text-[10px]">
                  No revenue data available
                </p>
              ) : (
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {revenueData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-1.5 bg-secondary rounded">
                      <span className="text-xs">{item.month}</span>
                      <span className="font-medium text-xs">₹{item.revenue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Occupancy Data - Simple List */}
          <Card className="p-2">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-sm">Parking Lot Occupancy</CardTitle>
              <CardDescription className="text-[9px]">Current occupancy rates</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-5 w-full" />
                  ))}
                </div>
              ) : occupancyData.length === 0 ? (
                <p className="text-muted-foreground text-center py-2 text-[10px]">
                  No occupancy data available
                </p>
              ) : (
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {occupancyData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-1.5 border rounded">
                      <span className="text-xs truncate">{item.name}</span>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5">{Math.round(item.occupancy)}%</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}