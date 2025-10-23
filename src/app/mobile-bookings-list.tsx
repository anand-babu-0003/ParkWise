'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Zap, Clock, Calendar, QrCode, FileText, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useCollection } from '@/lib/mongodb';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Booking = {
  id: string;
  lotId: string;
  lotName: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  price: number;
};

export default function MobileBookingsList() {
  const { data: bookings, isLoading, error } = useCollection<Booking>('/api/bookings');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredBookings = bookings ? bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'active') return booking.status === 'Confirmed';
    if (filter === 'completed') return booking.status === 'Completed';
    return true;
  }) : [];

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen p-4">
        <Skeleton className="h-8 w-3/4 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-1" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen p-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an issue loading your bookings. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold font-headline">My Bookings</h1>
        <p className="text-muted-foreground">View and manage your parking reservations</p>
      </div>

      {/* Filters */}
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'active' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button 
            variant={filter === 'completed' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="flex-1 p-4 overflow-y-auto">
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Bookings Found</h2>
            <p className="text-muted-foreground mb-6">
              {filter === 'all' 
                ? "You haven't made any bookings yet." 
                : filter === 'active' 
                  ? "You don't have any active bookings." 
                  : "You don't have any completed bookings."}
            </p>
            <Button asChild>
              <Link href="/">Find Parking</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{booking.lotName}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-xs pt-1">
                        <MapPin className="w-3 h-3" />
                        <span>Lot #{booking.lotId.substring(0, 8)}</span>
                      </CardDescription>
                    </div>
                    <Badge variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{booking.time}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-bold text-lg">₹{booking.price.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/bookings/${booking.id}`}>
                        <FileText className="w-4 h-4 mr-2" />
                        Details
                      </Link>
                    </Button>
                    {booking.status === 'Confirmed' && (
                      <Button size="sm" asChild>
                        <Link href={`/bookings/${booking.id}/qr`}>
                          <QrCode className="w-4 h-4 mr-2" />
                          QR Code
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}