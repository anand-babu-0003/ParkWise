'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Car, 
  DollarSign, 
  MapPin, 
  TrendingUp, 
  Calendar,
  BarChart3
} from 'lucide-react';
import { useCollection } from '@/lib/mongodb';

interface Booking {
  id: string;
  lotId: string;
  lotName: string;
  price: number;
  createdAt: string;
}

interface ParkingLot {
  id: string;
  name: string;
  availableSlots: number;
  totalSlots: number;
}

interface Payment {
  id: string;
  amount: number;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: bookings, isLoading: bookingsLoading } = useCollection<Booking>('/api/bookings');
  const { data: lots, isLoading: lotsLoading } = useCollection<ParkingLot>('/api/parking-lots');
  const { data: payments, isLoading: paymentsLoading } = useCollection<Payment>('/api/payments');
  const { data: users, isLoading: usersLoading } = useCollection<User>('/api/users');

  const isLoading = bookingsLoading || lotsLoading || paymentsLoading || usersLoading;

  // Calculate statistics
  const stats = {
    totalRevenue: payments?.reduce((acc, payment) => acc + payment.amount, 0) || 0,
    totalUsers: users?.filter(user => user.role === 'user').length || 0,
    totalOwners: users?.filter(user => user.role === 'owner').length || 0,
    totalBookings: bookings?.length || 0,
    activeLots: lots?.length || 0
  };

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
    
    // Convert to array format
    return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue: Math.round(revenue)
    }));
  }, [payments]);

  // Calculate occupancy data
  const occupancyData = React.useMemo(() => {
    if (!lots) return [];
    
    return lots.map(lot => ({
      lot: lot.name,
      occupancy: lot.totalSlots > 0 ? ((lot.totalSlots - lot.availableSlots) / lot.totalSlots) * 100 : 0
    }));
  }, [lots]);

  // Recent bookings
  const recentBookings = React.useMemo(() => {
    if (!bookings) return [];
    return [...bookings].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 5);
  }, [bookings]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your SmartParkr admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">+8.2% from last month</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parking Owners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalOwners}</div>
                <p className="text-xs text-muted-foreground">+5.1% from last month</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">+19.3% from last month</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lots</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.activeLots}</div>
                <p className="text-xs text-muted-foreground">+2 new this month</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ) : revenueData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No revenue data available
                </div>
              ) : (
                <div className="flex items-end h-60 gap-2 mt-4">
                  {revenueData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="text-xs text-gray-500 mb-1">{item.month}</div>
                      <div 
                        className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                        style={{ height: `${(item.revenue / 25000) * 100}%` }}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        ₹{item.revenue.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Occupancy Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Parking Lot Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 overflow-y-auto">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-2 w-full bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              ) : occupancyData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No occupancy data available
                </div>
              ) : (
                <div className="space-y-4">
                  {occupancyData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.lot}</span>
                        <span className="text-sm text-gray-500">{Math.round(item.occupancy)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.occupancy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recent bookings
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{booking.lotName}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-lg font-bold">₹{booking.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 text-center">
            <Button variant="outline">View All Bookings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}