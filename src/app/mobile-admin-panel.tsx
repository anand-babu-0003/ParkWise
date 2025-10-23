'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  BrainCircuit, 
  Car, 
  DollarSign, 
  Users, 
  AlertTriangle,
  Menu,
  X,
  TrendingUp,
  MapPin,
  Calendar,
  BookMarked
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCollection } from '@/lib/mongodb';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

type Booking = {
  id: string;
  lotId: string;
  lotName: string;
  price: number;
  createdAt: string;
};

type ParkingLot = {
  id: string;
  name: string;
  availableSlots: number;
  totalSlots: number;
  location: string;
};

type Payment = {
  id: string;
  amount: number;
  createdAt: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function MobileAdminPanel() {
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useCollection<Booking>('/api/bookings');
  const { data: lots, isLoading: lotsLoading, error: lotsError } = useCollection<ParkingLot>('/api/parking-lots');
  const { data: payments, isLoading: paymentsLoading, error: paymentsError } = useCollection<Payment>('/api/payments');
  const { data: users, isLoading: usersLoading, error: usersError } = useCollection<User>('/api/users');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const recentBookings = bookings?.slice(0, 5) || [];

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
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 p-3 flex items-center justify-center">
          <Alert variant="destructive" className="max-w-xs">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-sm">Error Loading Data</AlertTitle>
            <AlertDescription className="text-xs">
              Please check your connection and try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen max-w-full">
      {/* Main Header - Only one header now */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="flex h-12 items-center justify-between px-2">
          <h1 className="text-base font-bold text-foreground">Admin Panel</h1>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] p-3">
              <SheetTitle className="sr-only">Admin Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-2 border-b">
                  <h2 className="text-sm font-bold">Admin Menu</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} className="h-6 w-6">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <nav className="flex-1 py-3">
                  <ul className="space-y-1">
                    <li>
                      <Link 
                        href="/admin/dashboard" 
                        className="flex items-center gap-2 text-sm font-medium p-2 rounded-lg bg-primary/10 text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <BarChart3 className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/admin/predict" 
                        className="flex items-center gap-2 text-sm font-medium p-2 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <BrainCircuit className="h-4 w-4" />
                        Predict Demand
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/admin/users" 
                        className="flex items-center gap-2 text-sm font-medium p-2 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Users className="h-4 w-4" />
                        User Management
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/admin/lots" 
                        className="flex items-center gap-2 text-sm font-medium p-2 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <MapPin className="h-4 w-4" />
                        Parking Lots
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/admin/bookings" 
                        className="flex items-center gap-2 text-sm font-medium p-2 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <BookMarked className="h-4 w-4" />
                        Bookings
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      
      {/* Dashboard Content */}
      <main className="flex-1 p-2 pb-14 overflow-y-auto">
        {/* Welcome Section */}
        <div className="mb-3">
          <h2 className="text-lg font-bold tracking-tight mb-0.5">Dashboard Overview</h2>
          <p className="text-muted-foreground text-[10px]">
            Monitor your parking system performance
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Card className="p-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-1">
              <CardTitle className="text-[10px] font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <Skeleton className="h-4 w-3/4" />
              ) : (
                <div className="text-sm font-bold">₹{totalRevenue.toFixed(2)}</div>
              )}
              <p className="text-[9px] text-muted-foreground mt-0.5">All time</p>
            </CardContent>
          </Card>
          
          <Card className="p-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-1">
              <CardTitle className="text-[10px] font-medium">Total Users</CardTitle>
              <Users className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <Skeleton className="h-4 w-1/2" />
              ) : (
                <div className="text-sm font-bold">{totalUsers}</div>
              )}
              <p className="text-[9px] text-muted-foreground mt-0.5">Registered</p>
            </CardContent>
          </Card>
          
          <Card className="p-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-1">
              <CardTitle className="text-[10px] font-medium">Total Bookings</CardTitle>
              <Car className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <Skeleton className="h-4 w-1/2" />
              ) : (
                <div className="text-sm font-bold">{totalBookings}</div>
              )}
              <p className="text-[9px] text-muted-foreground mt-0.5">All time</p>
            </CardContent>
          </Card>
          
          <Card className="p-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-1">
              <CardTitle className="text-[10px] font-medium">Active Lots</CardTitle>
              <MapPin className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <Skeleton className="h-4 w-1/3" />
              ) : (
                <div className="text-sm font-bold">{activeLots}</div>
              )}
              <p className="text-[9px] text-muted-foreground mt-0.5">Managed</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Revenue Trend - Simple List */}
        <Card className="p-2 mb-3">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-3 w-3" />
              Revenue Trend
            </CardTitle>
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
        <Card className="p-2 mb-3">
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
        
        {/* Recent Bookings */}
        <Card className="p-2">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="h-3 w-3" />
              Recent Bookings
            </CardTitle>
            <CardDescription className="text-[9px]">Latest parking reservations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full" />
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <p className="text-muted-foreground text-center py-2 text-[10px]">
                No recent bookings
              </p>
            ) : (
              <div className="space-y-1 max-h-28 overflow-y-auto">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-1.5 border rounded">
                    <div className="min-w-0">
                      <div className="font-medium text-xs truncate">{booking.lotName}</div>
                      <div className="text-[9px] text-muted-foreground truncate">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-medium text-xs">₹{booking.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-30">
        <div className="grid grid-cols-4 gap-0.5 p-1">
          <Button 
            variant="ghost" 
            className="flex flex-col gap-0.5 h-11 rounded-lg text-[10px]"
            asChild
          >
            <Link href="/admin/dashboard">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col gap-0.5 h-11 rounded-lg text-[10px]"
            asChild
          >
            <Link href="/admin/predict">
              <BrainCircuit className="h-3.5 w-3.5" />
              <span>Predict</span>
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col gap-0.5 h-11 rounded-lg text-[10px]"
            asChild
          >
            <Link href="/admin/lots">
              <MapPin className="h-3.5 w-3.5" />
              <span>Lots</span>
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col gap-0.5 h-11 rounded-lg text-[10px]"
            asChild
          >
            <Link href="/admin/users">
              <Users className="h-3.5 w-3.5" />
              <span>Users</span>
            </Link>
          </Button>
        </div>
      </nav>
    </div>
  );
}