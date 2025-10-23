
import { Header } from '@/components/header';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Zap, Clock, Car } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import placeholderImages from '@/lib/placeholder-images.json';
import Link from 'next/link';

const parkingLot = {
  id: '1',
  name: 'Downtown City Garage',
  location: '123 Main St, Metropolis',
  available_slots: 15,
  total_slots: 150,
  price_per_hour: 3.5,
  imageId: 'parking-garage-1',
  operating_hours: '24/7'
};

export default function ParkingLotDetailsPage({ params }: { params: { id: string } }) {
  const img = placeholderImages.placeholderImages.find(img => img.id === parkingLot.imageId);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative h-96 w-full rounded-lg overflow-hidden">
            {img && <Image src={img.imageUrl} alt={img.description} fill className="object-cover" data-ai-hint={img.imageHint} />}
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
                  <p className="font-bold text-2xl text-primary">${parkingLot.price_per_hour.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/hr</span></p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        <span>{parkingLot.total_slots} total slots</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{parkingLot.operating_hours}</span>
                    </div>
                </div>
                <div>
                  <Badge variant={parkingLot.available_slots > 10 ? 'secondary' : 'destructive'} className="text-base">
                    {parkingLot.available_slots > 0 ? `${parkingLot.available_slots} slots available` : 'Full'}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full text-lg py-6" disabled={parkingLot.available_slots === 0} asChild>
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
