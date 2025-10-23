'use client';

import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, QrCode, ParkingSquare, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Booking = {
  id: string;
  lotName: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  price: number;
};

export default function MyBookingsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'bookings'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: bookings, isLoading: isLoadingBookings, error } = useCollection<Booking>(bookingsQuery);
  const isLoading = isUserLoading || isLoadingBookings;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-8 font-headline">
            My Bookings
          </h1>

          {isLoading && (
            <div className="space-y-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="space-y-2">
                       <Skeleton className="h-4 w-full" />
                       <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="flex items-start justify-start md:justify-end">
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row justify-between items-center">
                    <Skeleton className="h-8 w-24" />
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-10 w-36" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Could not load your bookings. Please try again later.
                </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && bookings && (
             <div className="space-y-6">
                {bookings.map((booking) => (
                <Card key={booking.id}>
                    <CardHeader className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <CardTitle>{booking.lotName}</CardTitle>
                        <CardDescription>{booking.id}</CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <p><strong>Date:</strong> {booking.date}</p>
                        <p><strong>Time:</strong> {booking.time}</p>
                    </div>
                    <div className="flex items-start justify-start md:justify-end">
                        <Badge variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}>{booking.status}</Badge>
                    </div>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-2xl font-bold text-primary">${booking.price.toFixed(2)}</p>
                        <div className="flex gap-2 mt-4 md:mt-0">
                            <Button variant="outline" asChild>
                                <Link href={`/bookings/${booking.id}`}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Details
                                </Link>
                            </Button>
                            {booking.status === 'Confirmed' && (
                                <Button asChild>
                                    <Link href={`/bookings/${booking.id}`}>
                                        <QrCode className="mr-2 h-4 w-4" />
                                        Show QR Code
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
                ))}
            </div>
          )}

           {!isLoading && !error && (!bookings || bookings.length === 0) && (
              <div className="text-center py-20 rounded-lg bg-card border border-dashed">
                  <ParkingSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-2xl font-semibold">No bookings yet!</h2>
                  <p className="text-muted-foreground mt-2">Find a parking spot to get started.</p>
                  <Button asChild className="mt-6">
                      <Link href="/">Find Parking</Link>
                  </Button>
              </div>
          )}
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ParkWise. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
