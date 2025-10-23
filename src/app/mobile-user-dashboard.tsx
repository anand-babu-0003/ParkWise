'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Car, 
  MapPin, 
  DollarSign, 
  Calendar,
  Clock,
  CreditCard,
  QrCode
} from 'lucide-react';
import Link from 'next/link';

type Booking = {
  id: string;
  lotId: string;
  lotName: string;
  startTime: string;
  endTime: string;
  price: number;
  status: 'active' | 'completed' | 'cancelled';
};

type Payment = {
  id: string;
  amount: number;
  date: string;
  bookingId: string;
};

export default function MobileUserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch user bookings
        const bookingsResponse = await fetch(`/api/user/bookings?userId=${user.id}`);
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData);
        }
        
        // Fetch user payments
        const paymentsResponse = await fetch(`/api/user/payments?userId=${user.id}`);
        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json();
          setPayments(paymentsData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const totalSpent = payments.reduce((acc, payment) => acc + payment.amount, 0);
  const activeBookings = bookings.filter(booking => booking.status === 'active').length;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-foreground">User Dashboard</h1>
          <Button size="sm" asChild>
            <Link href="/bookings">
              <Car className="mr-2 h-4 w-4" />
              Book
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight mb-1">Welcome back, {user?.name}</h2>
          <p className="text-muted-foreground text-sm">
            Manage your bookings and parking history
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button asChild className="h-20 flex flex-col gap-2">
            <Link href="/bookings">
              <Car className="h-6 w-6" />
              <span>Book Parking</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex flex-col gap-2">
            <Link href="/user/qr-scanner">
              <QrCode className="h-6 w-6" />
              <span>Scan QR</span>
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-5 w-1/2" />
              ) : (
                <div className="text-lg font-bold">₹{totalSpent.toFixed(2)}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Active Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-5 w-1/2" />
              ) : (
                <div className="text-lg font-bold">{activeBookings}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Total Bookings</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-5 w-1/2" />
              ) : (
                <div className="text-lg font-bold">{bookings.length}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Payment Methods</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-5 w-1/2" />
              ) : (
                <div className="text-lg font-bold">2</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Recent Bookings</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/bookings">View All</Link>
            </Button>
          </div>
          
          {isLoading ? (
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-3 w-10 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : bookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Car className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-semibold mb-1">No bookings yet</h3>
                <p className="text-muted-foreground mb-3 text-center text-sm">
                  Book your first parking spot to get started
                </p>
                <Button size="sm" asChild>
                  <Link href="/bookings">
                    <Car className="mr-2 h-4 w-4" />
                    Book Parking
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your recent reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{booking.lotName}</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.lotId.substring(0, 6)}...
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(booking.startTime).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">₹{booking.price.toFixed(2)}</div>
                        <Badge 
                          variant={
                            booking.status === 'active' ? 'default' : 
                            booking.status === 'completed' ? 'secondary' : 'destructive'
                          }
                          className="mt-1 text-xs"
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Payments */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Payment History</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile">View All</Link>
            </Button>
          </div>
          
          {isLoading ? (
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-14" />
                      </div>
                      <Skeleton className="h-4 w-10" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : payments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-semibold mb-1">No payment history</h3>
                <p className="text-muted-foreground text-center text-sm">
                  Your payment history will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Your recent payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payments.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">Parking Payment</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(payment.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="font-medium text-sm">₹{payment.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}