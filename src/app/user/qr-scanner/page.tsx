'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Camera, QrCode, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Webcam from 'react-webcam';
import { PermissionService } from '@/lib/permissions';

export default function QRScannerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [scanning, setScanning] = useState(true);
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Check camera permissions on mount
  useEffect(() => {
    const checkCameraPermission = async () => {
      const hasPermission = await PermissionService.requestCameraPermissions();
      setHasCameraPermission(hasPermission);
      
      if (!hasPermission) {
        toast({
          title: "Camera Permission Required",
          description: "Please allow camera access to scan QR codes.",
          variant: "destructive",
        });
      }
    };
    
    checkCameraPermission();
  }, []);

  const capture = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (scanning && hasCameraPermission) {
      capture.current = setInterval(() => {
        detectQRCode();
      }, 500);
    }

    return () => {
      if (capture.current) {
        clearInterval(capture.current);
      }
    };
  }, [scanning, hasCameraPermission]);

  const detectQRCode = () => {
    if (webcamRef.current) {
      const video = webcamRef.current.video;
      if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
        // Check if video has valid dimensions
        if (video.videoWidth <= 0 || video.videoHeight <= 0) {
          console.warn('Video has invalid dimensions:', video.videoWidth, video.videoHeight);
          return;
        }
        
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          if (canvas.width <= 0 || canvas.height <= 0) {
            console.warn('Canvas has invalid dimensions:', canvas.width, canvas.height);
            return;
          }
          
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Import jsQR dynamically
            import('jsqr').then((jsQR) => {
              const code = jsQR.default(imageData.data, imageData.width, imageData.height);
              if (code) {
                handleScan(code.data);
              }
            });
          }
        } catch (error) {
          console.error('Error processing video frame:', error);
        }
      }
    }
  };

  const handleScan = (data: string) => {
    if (data && !scannedUrl) {
      setScanning(false);
      setScannedUrl(data);
      
      // Clear the interval
      if (capture.current) {
        clearInterval(capture.current);
        capture.current = null;
      }
      
      // Validate if it's a parking lot URL
      if (data.includes('/lot/')) {
        toast({
          title: "QR Code Scanned",
          description: "Parking lot found! Redirecting...",
        });
      } else {
        toast({
          title: "QR Code Scanned",
          description: "This doesn't appear to be a parking lot QR code.",
          variant: "destructive",
        });
      }
    }
  };

  const handleError = (err: any) => {
    console.error('QR Scanner Error:', err);
    toast({
      title: "Scanner Error",
      description: "Failed to access camera. Please check permissions.",
      variant: "destructive",
    });
  };

  const switchCamera = () => {
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  };

  const resetScanner = () => {
    setScannedUrl(null);
    setScanning(true);
  };

  const handleBookNow = async () => {
    if (!scannedUrl) return;
    
    setLoading(true);
    try {
      // Extract lot ID from URL
      const url = new URL(scannedUrl);
      const lotId = url.pathname.split('/').pop();
      
      if (lotId) {
        // Redirect to the lot page for booking
        router.push(`/lot/${lotId}`);
      } else {
        throw new Error('Invalid QR code');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid QR code. Please try scanning again.",
        variant: "destructive",
      });
      resetScanner();
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (hasCameraPermission === false) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-foreground">Scan QR Code</h1>
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        <main className="flex-1 p-4 overflow-y-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Camera Permission Required
              </CardTitle>
              <CardDescription>
                Camera access is needed to scan QR codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="bg-red-100 p-3 rounded-full mb-4">
                  <Camera className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Camera Access Denied</h3>
                <p className="text-muted-foreground mb-4">
                  Please enable camera permissions in your device settings to scan QR codes.
                </p>
                <Button onClick={resetScanner}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-foreground">Scan QR Code</h1>
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      <main className="flex-1 p-4 overflow-y-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>
              Point your camera at a SmartParkr QR code to book a parking spot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square w-full max-w-md mx-auto bg-muted rounded-lg overflow-hidden">
              {scanning ? (
                <>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode }}
                    className="w-full h-full object-cover"
                    onUserMediaError={handleError}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-white rounded-lg w-64 h-64 animate-pulse"></div>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                    <p className="text-sm bg-black/50 inline-block px-3 py-1 rounded">
                      Position QR code in frame
                    </p>
                  </div>
                </>
              ) : scannedUrl ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <div className="bg-green-100 p-3 rounded-full mb-4">
                    <QrCode className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">QR Code Scanned!</h3>
                  <p className="text-muted-foreground mb-4">
                    {scannedUrl.includes('/lot/') 
                      ? "Ready to book your parking spot" 
                      : "This doesn't appear to be a parking lot QR code"}
                  </p>
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" className="flex-1" onClick={resetScanner}>
                      Scan Again
                    </Button>
                    <Button 
                      className="flex-1" 
                      onClick={handleBookNow}
                      disabled={!scannedUrl.includes('/lot/') || loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Book Now
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
            </div>
            
            <div className="mt-4 flex justify-center">
              <Button variant="outline" onClick={switchCamera}>
                <Camera className="mr-2 h-4 w-4" />
                Switch Camera
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              1. Point your camera at a SmartParkr QR code displayed at a parking location
            </p>
            <p className="text-sm text-muted-foreground">
              2. The app will automatically detect and scan the QR code
            </p>
            <p className="text-sm text-muted-foreground">
              3. Review the parking lot information and book your spot
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}