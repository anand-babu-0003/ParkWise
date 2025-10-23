'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Zap, Clock, Calendar, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useDoc } from '@/lib/mongodb';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ParkingLot = {
  id: string;
  name: string;
  location: string;
  pricePerHour: number;
  imageId: string;
  operatingHours: string;
};

export default function MobileBook({ lotId }: { lotId: string }) {
  const { data: parkingLot, isLoading, error } = useDoc<ParkingLot>(`/api/parking-lots/${lotId}`);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('09:00');
  const [duration, setDuration] = useState(1);
  const [step, setStep] = useState(1); // 1: Select time, 2: Payment, 3: Confirmation

  const totalCost = parkingLot ? parkingLot.pricePerHour * duration : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen p-4">
        <Skeleton className="h-8 w-3/4 mb-6" />
        <Skeleton className="h-24 w-full mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error || !parkingLot) {
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

  const handleConfirmBooking = () => {
    // In a real app, this would make an API call to create the booking
    setStep(3);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold font-headline">Book Parking</h1>
        <p className="text-muted-foreground">{parkingLot.name}</p>
      </div>

      {/* Progress Steps */}
      <div className="p-4 border-b">
        <div className="flex justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted"></div>
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= num ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                {step > num ? <CheckCircle className="w-5 h-5" /> : num}
              </div>
              <span className="text-xs mt-1 text-muted-foreground">
                {num === 1 ? 'Time' : num === 2 ? 'Payment' : 'Confirm'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content based on step */}
      <div className="flex-1 p-4 overflow-y-auto">
        {step === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Select Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Lot:</span>
                    <span className="font-medium">{parkingLot.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{bookingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{bookingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-lg text-primary">₹{totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    <span>Credit Card</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                    <span className="text-2xl">📱</span>
                    <span>Mobile Pay</span>
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium block mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium block mb-2">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Lot:</span>
                    <span className="font-medium">{parkingLot.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{bookingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{bookingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-lg text-primary">₹{totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-6">
              Your parking spot at {parkingLot.name} is reserved.
            </p>
            
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Lot:</span>
                  <span className="font-medium">{parkingLot.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{bookingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{bookingTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-medium">Total Paid:</span>
                  <span className="font-bold text-lg text-primary">₹{totalCost.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-8 w-full space-y-3">
              <Button className="w-full py-6" asChild>
                <Link href="/bookings">View My Bookings</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">Find More Parking</Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {step < 3 && (
        <div className="p-4 border-t bg-background">
          <div className="grid grid-cols-2 gap-3">
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)}
              >
                Back
              </Button>
            )}
            <Button 
              className="col-span-2" 
              onClick={() => step === 2 ? handleConfirmBooking() : setStep(step + 1)}
              disabled={step === 1 && (!bookingDate || !bookingTime)}
            >
              {step === 2 ? 'Confirm & Pay' : 'Continue'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}