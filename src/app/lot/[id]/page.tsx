'use client';

import { Header } from '@/components/header';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Zap, Clock, Car, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import placeholderImages from '@/lib/placeholder-images.json';
import Link from 'next/link';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ParkingLot = {
  id: string;
  name: string;
  location: string;
  availableSlots: number;
  totalSlots: number;
  pricePerHour: number;
  imageId: string;
  operatingHours: string;
};


export default function ParkingLotDetailsPage({ params }: { params: { id:string } }) {
  const firestore = useFirestore();
  const lotRef = useMemoFirebase(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'parking_lots', params.id);
  }, [firestore, params.id]);

  const { data: parkingLot, isLoading, error } = useDoc<ParkingLot>(lotRef);
  const img = parkingLot ? placeholderImages.placeholderImages.find(img => img.id === parkingLot.imageId) : null;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !parkingLot) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4 md:px-6 py-12 flex items-center justify-center">
                 <Alert variant="destructive" className="max-w-lg">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                       {error ? 'There was an issue loading the parking lot data.' : 'Parking lot not found.'} Please try again or return to the home page.
                       <div className="mt-4">
                           <Button asChild>
                               <Link href="/">Go Home</Link>
                           </Button>
                       </div>
                    </AlertDescription>
                </Alert>
            </main>
        </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative h-96 w-full rounded-lg overflow-hidden">
            {img ? (
                <Image src={img.imageUrl} alt={img.description} fill className="object-cover" data-ai-hint={img.imageHint} />
            ) : (
                <div className="bg-muted w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Image not available</p>
                </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold font-headline">{parkingLot.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-2">
                  <MapPin className="w-4 h-4" />
                  {parkingLot.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Price</span>
                  <p className="font-bold text-2xl text-primary">${parkingLot.pricePerHour.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/hr</span></p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        <span>{parkingLot.totalSlots} total slots</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{parkingLot.operatingHours}</span>
                    </div>
                </div>
                <div>
                  <Badge variant={parkingLot.availableSlots > 10 ? 'secondary' : 'destructive'} className="text-base">
                    {parkingLot.availableSlots > 0 ? `${parkingLot.availableSlots} slots available` : 'Full'}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full text-lg py-6" disabled={parkingLot.availableSlots === 0} asChild>
                  <Link href={`/book/${params.id}`}>
                    <Zap className="w-5 h-5 mr-2" />
                    Book Now
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        <div className="mt-12">
            <h3 className="text-2xl font-bold mb-4 font-headline">Location</h3>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Map integration placeholder</p>
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

function LoadingSkeleton() {
    return (
         <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    <Skeleton className="h-96 w-full rounded-lg" />
                    <div className="flex flex-col justify-center space-y-4">
                       <Skeleton className="h-10 w-3/4" />
                       <Skeleton className="h-6 w-1/2" />
                       <div className="space-y-4 pt-4">
                           <div className="flex justify-between">
                               <Skeleton className="h-8 w-24" />
                               <Skeleton className="h-8 w-20" />
                           </div>
                           <Skeleton className="h-6 w-full" />
                           <Skeleton className="h-8 w-32" />
                       </div>
                       <div className="pt-4">
                            <Skeleton className="h-12 w-full" />
                       </div>
                    </div>
                </div>
                 <div className="mt-12">
                    <Skeleton className="h-8 w-48 mb-4" />
                    <Skeleton className="aspect-video w-full rounded-lg" />
                </div>
            </main>
        </div>
    )
}
