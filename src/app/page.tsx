'use client';

import { Header } from '@/components/header';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Zap, ParkingSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import placeholderImages from '@/lib/placeholder-images.json';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

// Define the type for a parking lot based on your Firestore structure
type ParkingLot = {
  id: string;
  name: string;
  location: string;
  availableSlots: number;
  totalSlots: number;
  pricePerHour: number;
  imageId: string;
};

export default function Home() {
  const firestore = useFirestore();

  const parkingLotsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'parking_lots');
  }, [firestore]);

  const { data: parkingLots, isLoading } = useCollection<ParkingLot>(parkingLotsQuery);

  const getImage = (id: string) => placeholderImages.placeholderImages.find(img => img.id === id);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20 bg-card border-b">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground mb-4 font-headline">
              Find Your Perfect Parking Spot
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              ParkWise offers real-time availability and seamless booking. Your parking problems, solved.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-10 font-headline">Available Parking Lots</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {isLoading && Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="flex flex-col">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}

              {!isLoading && parkingLots && parkingLots.map((lot) => {
                const img = getImage(lot.imageId);
                return (
                  <Card key={lot.id} className="flex flex-col overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 shadow-lg hover:shadow-xl">
                    <Link href={`/lot/${lot.id}`} className="flex flex-col h-full">
                      <div className="relative h-48 w-full">
                        {img && <Image src={img.imageUrl} alt={img.description} fill className="object-cover" data-ai-hint={img.imageHint} />}
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl">{lot.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 pt-1">
                          <MapPin className="w-4 h-4" />
                          {lot.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="flex justify-between items-center text-sm">
                          <Badge variant={lot.availableSlots > 10 ? 'secondary' : 'destructive'}>
                            {lot.availableSlots > 0 ? `${lot.availableSlots} slots available` : 'Full'}
                          </Badge>
                          <p className="font-semibold text-lg text-foreground">${lot.pricePerHour.toFixed(2)}<span className="text-xs font-normal text-muted-foreground">/hr</span></p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" disabled={lot.availableSlots === 0}>
                            <Zap className="w-4 h-4 mr-2" />
                            Book Now
                        </Button>
                      </CardFooter>
                    </Link>
                  </Card>
                );
              })}

              {!isLoading && (!parkingLots || parkingLots.length === 0) && (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                  <ParkingSquare className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">No Parking Lots Available</h3>
                  <p>Check back later for available parking locations.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ParkWise. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
