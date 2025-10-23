
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, QrCode } from 'lucide-react';
import Link from 'next/link';

const bookings = [
  {
    id: 'BK12345',
    lotName: 'Downtown City Garage',
    date: '2024-08-15',
    time: '10:00 AM - 12:00 PM',
    status: 'Confirmed',
    price: 7.00
  },
  {
    id: 'BK12346',
    lotName: 'Uptown Plaza Parkade',
    date: '2024-08-10',
    time: '02:00 PM - 03:00 PM',
    status: 'Completed',
    price: 2.75
  },
];

export default function MyBookingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-8 font-headline">
            My Bookings
          </h1>
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

            {bookings.length === 0 && (
                <div className="text-center py-20">
                    <h2 className="text-2xl font-semibold">No bookings yet!</h2>
                    <p className="text-muted-foreground mt-2">Find a parking spot to get started.</p>
                    <Button asChild className="mt-6">
                        <Link href="/">Find Parking</Link>
                    </Button>
                </div>
            )}
          </div>
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
