import { Header } from '@/components/header';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import placeholderImages from '@/lib/placeholder-images.json';
import Link from 'next/link';

const parkingLots = [
  {
    id: '1',
    name: 'Downtown City Garage',
    location: '123 Main St, Metropolis',
    available_slots: 15,
    total_slots: 150,
    price_per_hour: 3.5,
    imageId: 'parking-garage-1'
  },
  {
    id: '2',
    name: 'Uptown Plaza Parkade',
    location: '456 Oak Ave, Gotham',
    available_slots: 42,
    total_slots: 200,
    price_per_hour: 2.75,
    imageId: 'parking-garage-2'
  },
  {
    id: '3',
    name: 'Riverside Open Lot',
    location: '789 Pine Ln, Star City',
    available_slots: 88,
    total_slots: 100,
    price_per_hour: 1.5,
    imageId: 'parking-lot-1'
  },
  {
    id: '4',
    name: 'Airport Long Term B',
    location: '101 Airport Rd, Central City',
    available_slots: 5,
    total_slots: 300,
    price_per_hour: 4.0,
    imageId: 'parking-garage-3'
  },
];

export default function Home() {
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
              {parkingLots.map((lot) => {
                const img = getImage(lot.imageId);
                return (
                  <Card key={lot.id} className="flex flex-col overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 shadow-lg hover:shadow-xl">
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
                        <Badge variant={lot.available_slots > 10 ? 'secondary' : 'destructive'}>
                          {lot.available_slots > 0 ? `${lot.available_slots} slots available` : 'Full'}
                        </Badge>
                        <p className="font-semibold text-lg text-foreground">${lot.price_per_hour.toFixed(2)}<span className="text-xs font-normal text-muted-foreground">/hr</span></p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" disabled={lot.available_slots === 0} asChild>
                        <Link href="#">
                            <Zap className="w-4 h-4 mr-2" />
                            Book Now
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
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
