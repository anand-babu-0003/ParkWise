'use client';

import { BarChart3, BrainCircuit, Car, DollarSign, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RevenueChart } from '@/components/admin/revenue-chart';
import { OccupancyChart } from '@/components/admin/occupancy-chart';
import { BookingsByLotChart } from '@/components/admin/bookings-by-lot-chart';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

export default function AdminDashboard() {
  const firestore = useFirestore();

  const bookingsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'bookings')) : null, [firestore]);
  const lotsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'parking_lots')) : null, [firestore]);
  const paymentsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'payments')) : null, [firestore]);
  const usersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'users')) : null, [firestore]);

  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useCollection<Booking>(bookingsQuery);
  const { data: lots, isLoading: lotsLoading, error: lotsError } = useCollection<ParkingLot>(lotsQuery);
  const { data: payments, isLoading: paymentsLoading, error: paymentsError } = useCollection<Payment>(paymentsQuery);
  const { data: users, isLoading: usersLoading, error: usersError } = useCollection<User>(usersQuery);

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

  if (error) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Dashboard Data</AlertTitle>
            <AlertDescription>
                There was a problem fetching data from Firestore. Please check your connection and security rules.
            </AlertDescription>
        </Alert>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <Button asChild>
          <Link href="/admin/predict">
            <BrainCircuit className="mr-2 h-4 w-4" />
            Predict Demand
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-2/3" /> : <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>}
            {isLoading ? <Skeleton className="h-4 w-1/2 mt-1" /> : <p className="text-xs text-muted-foreground">From all bookings</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{totalUsers}</div>}
             {isLoading ? <Skeleton className="h-4 w-1/2 mt-1" /> : <p className="text-xs text-muted-foreground">Registered users</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{totalBookings}</div>}
            {isLoading ? <Skeleton className="h-4 w-1/2 mt-1" /> : <p className="text-xs text-muted-foreground">Across all lots</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lots</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{activeLots}</div>}
             {isLoading ? <Skeleton className="h-4 w-1/2 mt-1" /> : <p className="text-xs text-muted-foreground">Managed parking locations</p>}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Last 6 months (mock data)</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[350px] w-full" /> : <RevenueChart />}
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Current Occupancy</CardTitle>
             <CardDescription>Live occupancy across all lots</CardDescription>
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-[350px] w-full" /> : <OccupancyChart data={occupancyData} />}
          </CardContent>
        </Card>
      </div>
      <Card>
          <CardHeader>
            <CardTitle>Bookings by Lot</CardTitle>
            <CardDescription>Live distribution of bookings per parking lot.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {isLoading ? <Skeleton className="h-[300px] w-[300px] rounded-full" /> : <BookingsByLotChart bookings={bookings || []} lots={lots || []} />}
          </CardContent>
        </Card>
    </main>
  );
}
