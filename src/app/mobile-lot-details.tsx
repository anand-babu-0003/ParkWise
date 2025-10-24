'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Zap, Clock, Car, AlertTriangle, Phone, Navigation, ParkingSquare, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import placeholderImages from '@/lib/placeholder-images.json';
import Link from 'next/link';
import { useDoc } from '@/lib/mongodb';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

type ParkingLot = {
  id: string;
  name: string;
  location: string;
  availableSlots: number;
  totalSlots: number;
  pricePerHour: number;
  imageId: string;
  operatingHours: string;
  contact?: string;
};

export default function MobileLotDetails({ lotId }: { lotId: string }) {
  const { user, isUserLoading } = useAuth();
  const router = useRouter();
  const { data: parkingLot, isLoading, error } = useDoc<ParkingLot>(`/api/parking-lots/${lotId}`);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setBookingDate(today);
  }, []);

  // Refresh data periodically to get updated slot availability
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    // Reset refreshing state after a short delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Use a separate hook instance with refresh key to force re-fetching
  const { data: refreshedParkingLot } = useDoc<ParkingLot>(refreshKey > 0 ? `/api/parking-lots/${lotId}?t=${refreshKey}` : `/api/parking-lots/${lotId}`);

  const currentParkingLot = refreshedParkingLot || parkingLot;
  const img = currentParkingLot ? placeholderImages.placeholderImages.find(img => img.id === currentParkingLot.imageId) : null;
  const totalCost = currentParkingLot ? currentParkingLot.pricePerHour * duration : 0;

  // Check if user is authenticated, if not redirect to login
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push(`/login?redirect=/lot/${lotId}`);
    }
  }, [user, isUserLoading, router, lotId]);

  if (isUserLoading) {
    return (
      <div className="flex flex-col min-h-screen p-4 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4">Checking authentication...</p>
      </div>
    );
  }

  if (!user && !isUserLoading) {
    return null; // Will redirect to login
  }

  if (isLoading && !currentParkingLot) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="relative h-48 w-full">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex justify-between pt-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-10 w-full mt-6" />
          <Skeleton className="h-24 w-full mt-6" />
        </div>
      </div>
    );
  }

  if (error || !currentParkingLot) {
    return (
      <div className="flex flex-col min-h-screen p-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error ? 'There was an issue loading the parking lot data.' : 'Parking lot not found.'} Please try again.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild className="w-full">
            <Link href="/">Find Other Lots</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Lot Image */}
      <div className="relative h-48 w-full">
        {img ? (
          <Image 
            src={img.imageUrl} 
            alt={img.description} 
            fill 
            className="object-cover" 
            data-ai-hint={img.imageHint} 
          />
        ) : (
          <div className="bg-muted w-full h-full flex items-center justify-center">
            <ParkingSquare className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Badge variant={currentParkingLot.availableSlots > 5 ? 'secondary' : 'destructive'}>
            {currentParkingLot.availableSlots > 0 ? `${currentParkingLot.availableSlots} slots` : 'Full'}
          </Badge>
        </div>
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Lot Details */}
      <div className="p-4 flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-headline">{currentParkingLot.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <MapPin className="w-4 h-4" />
            <span>{currentParkingLot.location}</span>
          </div>
        </div>

        {/* Key Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-xl font-bold text-primary">₹{currentParkingLot.pricePerHour.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/hr</span></p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-xl font-bold">{currentParkingLot.availableSlots}<span className="text-sm font-normal text-muted-foreground">/{currentParkingLot.totalSlots}</span></p>
            </CardContent>
          </Card>
        </div>

        {/* Operating Hours */}
        <Card className="mb-6">
          <CardHeader className="p-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Operating Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-muted-foreground">{currentParkingLot.operatingHours}</p>
          </CardContent>
        </Card>

        {/* Booking Section */}
        <Card className="mb-6">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Book This Spot</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Date</label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2">Time</label>
              <input
                type="time"
                className="w-full p-3 border rounded-lg"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2">Duration (hours)</label>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setDuration(Math.max(1, duration - 1))}
                  disabled={duration <= 1}
                >
                  -
                </Button>
                <span className="text-lg font-medium flex-1 text-center">{duration} hour{duration > 1 ? 's' : ''}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setDuration(Math.min(12, duration + 1))}
                  disabled={duration >= 12}
                >
                  +
                </Button>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Cost:</span>
                <span className="text-xl font-bold text-primary">₹{totalCost.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t bg-background">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Call
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            Navigate
          </Button>
        </div>
        <Button 
          className="w-full mt-3 py-6 text-lg" 
          disabled={currentParkingLot.availableSlots === 0}
          onClick={async () => {
            // Create booking when button is clicked
            if (currentParkingLot.availableSlots > 0 && user) {
              try {
                // Process dummy payment before creating booking
                const paymentSuccess = await processDummyPayment(totalCost);
                
                if (paymentSuccess) {
                  const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userId: user.id, // Use actual user ID from auth context
                      lotId: currentParkingLot.id,
                      lotName: currentParkingLot.name,
                      date: bookingDate,
                      time: bookingTime,
                      status: 'Confirmed',
                      price: totalCost,
                    }),
                  });
                  
                  if (response.ok) {
                    // Refresh the data to show updated slot count
                    handleRefresh();
                    alert('Booking confirmed successfully!');
                  } else {
                    const errorData = await response.json();
                    alert(`Booking failed: ${errorData.error}`);
                  }
                } else {
                  alert('Payment failed. Please try again.');
                }
              } catch (error) {
                console.error('Booking error:', error);
                alert('An error occurred while processing your booking.');
              }
            }
          }}
        >
          <Zap className="w-5 h-5 mr-2" />
          {currentParkingLot.availableSlots === 0 ? 'Lot Full' : 'Confirm Booking'}
        </Button>
      </div>
    </div>
  );
}

// Dummy payment processing function
async function processDummyPayment(amount: number): Promise<boolean> {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Randomly succeed or fail (90% success rate for demo purposes)
  return Math.random() > 0.1;
}