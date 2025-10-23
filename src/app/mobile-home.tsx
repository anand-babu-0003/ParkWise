'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Zap, ParkingSquare, Search, Filter, Navigation, QrCode } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import placeholderImages from '@/lib/placeholder-images.json';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Define the type for a parking lot
type ParkingLot = {
  id: string;
  name: string;
  location: string;
  availableSlots: number;
  totalSlots: number;
  pricePerHour: number;
  imageId: string;
  locationCoords?: {
    latitude: number;
    longitude: number;
  };
};

export default function MobileHome() {
  const [parkingLots, setParkingLots] = useState<ParkingLot[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLots, setFilteredLots] = useState<ParkingLot[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();

  // Get user's current location
  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsGettingLocation(false);
        toast({
          title: "Location found",
          description: "Showing parking lots near you.",
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsGettingLocation(false);
        toast({
          title: "Location error",
          description: "Unable to get your location. Showing all parking lots.",
          variant: "destructive",
        });
      }
    );
  };

  // Fetch parking lots
  useEffect(() => {
    const fetchParkingLots = async () => {
      try {
        setIsLoading(true);
        let url = '/api/parking-lots';
        
        // Add location parameter if available
        if (userLocation) {
          url += `?lat=${userLocation.lat}&lng=${userLocation.lng}`;
        }
        
        // Add search parameter if provided
        if (searchTerm) {
          url += userLocation ? `&search=${encodeURIComponent(searchTerm)}` : `?search=${encodeURIComponent(searchTerm)}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setParkingLots(data);
      } catch (error) {
        console.error("Error fetching parking lots:", error);
        toast({
          title: "Error",
          description: "Failed to load parking lots. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchParkingLots();
  }, [searchTerm, userLocation]);

  // Filter parking lots based on search term
  useEffect(() => {
    if (parkingLots) {
      const filtered = parkingLots.filter(lot => 
        lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLots(filtered);
    }
  }, [parkingLots, searchTerm]);

  const getImage = (id: string) => placeholderImages.placeholderImages.find(img => img.id === id);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-8 bg-card border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-foreground mb-3 font-headline">
            Find Parking Nearby
          </h1>
          <p className="text-muted-foreground mb-6">
            Real-time availability and easy booking
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by location or name..."
              className="pl-10 pr-16 py-5 text-base rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              onClick={getLocation}
              disabled={isGettingLocation}
            >
              {isGettingLocation ? (
                <div className="animate-spin h-4 w-4 rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></div>
              ) : (
                <Navigation className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* QR Scanner Button */}
          <div className="mb-4">
            <Button asChild variant="outline" className="w-full max-w-xs mx-auto">
              <Link href="/user/qr-scanner">
                <QrCode className="mr-2 h-4 w-4" />
                Scan QR Code
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-2">
            {userLocation 
              ? `Showing lots near ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` 
              : 'Enable location to find nearby parking'}
          </p>
        </div>
      </section>

      {/* Parking Lots Section */}
      <section className="flex-1 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-headline">Available Lots</h2>
            <Badge variant="secondary">
              {filteredLots.length || 0} lots
            </Badge>
          </div>
          
          <div className="space-y-5">
            {isLoading && Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="flex">
                <Skeleton className="h-24 w-24 rounded-l-lg" />
                <div className="flex-1 p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </Card>
            ))}

            {!isLoading && filteredLots && filteredLots.map((lot) => {
              const img = getImage(lot.imageId);
              return (
                <Card key={lot.id} className="flex overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-24 w-24 flex-shrink-0">
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
                        <ParkingSquare className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg line-clamp-1">{lot.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-xs pt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{lot.location}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex-grow">
                      <div className="flex justify-between items-center">
                        <Badge variant={lot.availableSlots > 5 ? 'secondary' : 'destructive'} className="text-xs">
                          {lot.availableSlots > 0 ? `${lot.availableSlots} slots` : 'Full'}
                        </Badge>
                        <p className="font-bold text-foreground">₹{lot.pricePerHour.toFixed(2)}<span className="text-xs font-normal text-muted-foreground">/hr</span></p>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full text-sm py-5" disabled={lot.availableSlots === 0} asChild>
                        <Link href={`/lot/${lot.id}`}>
                          <Zap className="w-4 h-4 mr-2" />
                          Book Now
                        </Link>
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              );
            })}

            {!isLoading && (!filteredLots || filteredLots.length === 0) && (
              <div className="text-center py-12">
                <ParkingSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Parking Lots Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'Try a different search term' : 'Check back later for available parking locations'}
                </p>
                {searchTerm && (
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}