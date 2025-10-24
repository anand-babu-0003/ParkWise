'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Car, 
  MapPin, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  Clock,
  QrCode,
  Download,
  Navigation
} from 'lucide-react';
import { PermissionService } from '@/lib/permissions';
import { useToast } from '@/hooks/use-toast';

type ParkingLot = {
  id: string;
  name: string;
  location: string;
  locationCoords?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  availableSlots: number;
  totalSlots: number;
  pricePerHour: number;
  imageId: string;
  operatingHours: string;
  ownerId: string;
};

export default function MobileOwnerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lots, setLots] = useState<ParkingLot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwnerRegistered, setIsOwnerRegistered] = useState<boolean | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState<{show: boolean, lot: ParkingLot | null}>({show: false, lot: null});
  const [showQRCode, setShowQRCode] = useState<{lot: ParkingLot | null, show: boolean, qrCodeData: string}>({lot: null, show: false, qrCodeData: ''});
  const [newLot, setNewLot] = useState({
    name: '',
    location: '',
    locationCoords: {
      type: 'Point' as const,
      coordinates: [0, 0] // [longitude, latitude]
    },
    availableSlots: 0,
    totalSlots: 0,
    pricePerHour: 0,
    imageId: 'default-lot-image', // Provide a default image ID
    operatingHours: '24/7', // Provide default operating hours
  });
  const [editLot, setEditLot] = useState<ParkingLot | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Check if owner has completed registration
  useEffect(() => {
    const checkOwnerRegistration = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/owner/profile?userId=${user.id}`);
        setIsOwnerRegistered(response.ok);
      } catch (error) {
        console.error('Error checking owner registration:', error);
        setIsOwnerRegistered(false);
      }
    };

    if (user) {
      checkOwnerRegistration();
    }
  }, [user]);

  // Fetch lots only if owner is registered
  useEffect(() => {
    const fetchLots = async () => {
      // Only fetch lots if user exists and is registered as owner
      if (!user || isOwnerRegistered !== true) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/owner/lots?ownerId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setLots(data);
        }
      } catch (error) {
        console.error('Error fetching lots:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLots();
  }, [user, isOwnerRegistered]);

  // Get current location for parking lot
  const getLocationForLot = async () => {
    setIsGettingLocation(true);
    
    try {
      const position = await PermissionService.getCurrentPosition();
      
      if (position) {
        setNewLot({
          ...newLot,
          locationCoords: {
            type: 'Point',
            coordinates: [position.coords.longitude, position.coords.latitude]
          }
        });
        toast({
          title: "Location captured",
          description: "Parking lot location has been set.",
        });
      } else {
        toast({
          title: "Location error",
          description: "Unable to get your location. Please enter manually.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error getting location:", error);
      toast({
        title: "Location error",
        description: "Unable to get your location. Please enter manually.",
        variant: "destructive",
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleAddLot = async () => {
    if (!user || isOwnerRegistered !== true) return;
    
    try {
      // Validate required fields
      if (!newLot.name || !newLot.location) {
        console.error('Name and location are required');
        return;
      }
      
      const response = await fetch('/api/owner/lots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          ownerId: user.id,
          lotData: newLot,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setLots([...lots, data]);
        setShowAddForm(false);
        setNewLot({
          name: '',
          location: '',
          locationCoords: {
            type: 'Point',
            coordinates: [0, 0]
          },
          availableSlots: 0,
          totalSlots: 0,
          pricePerHour: 0,
          imageId: 'default-lot-image',
          operatingHours: '24/7',
        });
      } else {
        const errorText = await response.text();
        console.error('Failed to add lot:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error adding lot:', error);
    }
  };

  const handleDeleteLot = async (lotId: string) => {
    if (!user || isOwnerRegistered !== true) return;
    
    try {
      const response = await fetch(`/api/owner/lots/${lotId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          ownerId: user.id,
        }),
      });
      
      if (response.ok) {
        setLots(lots.filter(lot => lot.id !== lotId));
      } else {
        console.error('Failed to delete lot:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Error deleting lot:', error);
    }
  };

  const handleShowQRCode = async (lot: ParkingLot) => {
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://smartparker.space';
      const lotUrl = `${baseUrl}/lot/${lot.id}`;
      
      const response = await fetch(`/api/qr?data=${encodeURIComponent(lotUrl)}`);
      if (response.ok) {
        const data = await response.json();
        setShowQRCode({lot, show: true, qrCodeData: data.qrCode});
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = () => {
    if (showQRCode.qrCodeData) {
      const a = document.createElement('a');
      a.href = showQRCode.qrCodeData;
      a.download = `${showQRCode.lot?.name}-qrcode.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Function to get current device location
  const getCurrentLocation = async () => {
    try {
      const position = await PermissionService.getCurrentPosition();
      
      if (position) {
        setNewLot({
          ...newLot,
          locationCoords: {
            type: 'Point' as const,
            coordinates: [position.coords.longitude, position.coords.latitude] // [longitude, latitude]
          }
        });
        toast({
          title: "Location captured",
          description: "Parking lot location has been set.",
        });
      } else {
        toast({
          title: "Location error",
          description: "Unable to get your location. Please enter manually.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      toast({
        title: "Location error",
        description: "Unable to get your location. Please enter manually.",
        variant: "destructive",
      });
    }
  };

  const handleEditLot = (lot: ParkingLot) => {
    // Ensure locationCoords is properly initialized
    const lotWithCoords = {
      ...lot,
      locationCoords: lot.locationCoords || {
        type: 'Point',
        coordinates: [0, 0]
      }
    };
    setEditLot(lotWithCoords);
    setShowEditForm({show: true, lot: lotWithCoords});
  };

  const handleUpdateLot = async () => {
    if (!user || isOwnerRegistered !== true || !editLot) return;
    
    try {
      // Validate required fields
      if (!editLot.name || !editLot.location) {
        console.error('Name and location are required');
        return;
      }
      
      const response = await fetch(`/api/owner/lots/${editLot.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          ownerId: user.id,
          lotData: editLot,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setLots(lots.map(lot => lot.id === data.id ? data : lot));
        setShowEditForm({show: false, lot: null});
        setEditLot(null);
      } else {
        const errorText = await response.text();
        console.error('Failed to update lot:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error updating lot:', error);
    }
  };

  // If we're still checking registration status, show loading
  if (isOwnerRegistered === null && user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If owner is not registered, show a message
  if (isOwnerRegistered === false) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-foreground">Owner Dashboard</h1>
          </div>
        </header>
        
        <main className="flex-1 p-4 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Registration</CardTitle>
              <CardDescription>
                You need to complete your owner registration before managing parking lots.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Please complete your business registration to access all owner features.
              </p>
              <Button onClick={() => window.location.href = '/owner/register'}>
                Complete Registration
              </Button>
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
          <h1 className="text-xl font-bold text-foreground">Owner Dashboard</h1>
          <Button size="sm" onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lot
          </Button>
        </div>
      </header>
      
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight mb-1">Welcome back, {user?.name}</h2>
          <p className="text-muted-foreground text-sm">
            Manage your parking lots
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Total Lots</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-5 w-1/2" />
              ) : (
                <div className="text-lg font-bold">{lots.length}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Total Slots</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-5 w-1/2" />
              ) : (
                <div className="text-lg font-bold">
                  {lots.reduce((acc, lot) => acc + lot.totalSlots, 0)}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Avg. Occupancy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-5 w-1/2" />
              ) : (
                <div className="text-lg font-bold">
                  {lots.length > 0 
                    ? `${Math.round(lots.reduce((acc, lot) => 
                        acc + ((lot.totalSlots - lot.availableSlots) / lot.totalSlots) * 100, 0) / lots.length)}%`
                    : '0%'}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">Avg. Price</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-5 w-1/2" />
              ) : (
                <div className="text-lg font-bold">
                  {lots.length > 0 
                    ? `₹${(lots.reduce((acc, lot) => acc + lot.pricePerHour, 0) / lots.length).toFixed(2)}`
                    : '₹0.00'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Lot Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Parking Lot</CardTitle>
              <CardDescription>Enter lot details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Lot Name</Label>
                  <Input
                    id="name"
                    value={newLot.name}
                    onChange={(e) => setNewLot({...newLot, name: e.target.value})}
                    placeholder="Downtown Parking"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newLot.location}
                    onChange={(e) => setNewLot({...newLot, location: e.target.value})}
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={newLot.locationCoords.coordinates[1] || ''}
                      onChange={(e) => setNewLot({
                        ...newLot, 
                        locationCoords: {
                          ...newLot.locationCoords,
                          coordinates: [newLot.locationCoords.coordinates[0], parseFloat(e.target.value) || 0]
                        }
                      })}
                      placeholder="40.7128"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={newLot.locationCoords.coordinates[0] || ''}
                      onChange={(e) => setNewLot({
                        ...newLot, 
                        locationCoords: {
                          ...newLot.locationCoords,
                          coordinates: [parseFloat(e.target.value) || 0, newLot.locationCoords.coordinates[1]]
                        }
                      })}
                      placeholder="-74.0060"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="button" variant="outline" size="sm" onClick={getCurrentLocation}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Use Current Location
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="totalSlots">Total Slots</Label>
                    <Input
                      id="totalSlots"
                      type="number"
                      value={newLot.totalSlots || ''}
                      onChange={(e) => setNewLot({...newLot, totalSlots: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="availableSlots">Available Slots</Label>
                    <Input
                      id="availableSlots"
                      type="number"
                      value={newLot.availableSlots || ''}
                      onChange={(e) => setNewLot({...newLot, availableSlots: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="pricePerHour">Price per Hour (₹)</Label>
                  <Input
                    id="pricePerHour"
                    type="number"
                    step="0.01"
                    value={newLot.pricePerHour || ''}
                    onChange={(e) => setNewLot({...newLot, pricePerHour: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="operatingHours">Operating Hours</Label>
                  <Input
                    id="operatingHours"
                    value={newLot.operatingHours}
                    onChange={(e) => setNewLot({...newLot, operatingHours: e.target.value})}
                    placeholder="24/7"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddLot}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lot
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Lot Form */}
        {showEditForm.show && editLot && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Edit Parking Lot</CardTitle>
              <CardDescription>Update lot details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="edit-name">Lot Name</Label>
                  <Input
                    id="edit-name"
                    value={editLot.name}
                    onChange={(e) => setEditLot(editLot ? {...editLot, name: e.target.value} : null)}
                    placeholder="Downtown Parking"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={editLot.location}
                    onChange={(e) => setEditLot(editLot ? {...editLot, location: e.target.value} : null)}
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="edit-latitude">Latitude</Label>
                    <Input
                      id="edit-latitude"
                      type="number"
                      step="any"
                      value={editLot.locationCoords?.coordinates?.[1] ?? ''}
                      onChange={(e) => setEditLot(editLot ? {
                        ...editLot, 
                        locationCoords: {
                          type: 'Point',
                          coordinates: [
                            editLot.locationCoords?.coordinates?.[0] ?? 0, 
                            parseFloat(e.target.value) || 0
                          ]
                        }
                      } : null)}
                      placeholder="40.7128"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-longitude">Longitude</Label>
                    <Input
                      id="edit-longitude"
                      type="number"
                      step="any"
                      value={editLot.locationCoords?.coordinates?.[0] ?? ''}
                      onChange={(e) => setEditLot(editLot ? {
                        ...editLot, 
                        locationCoords: {
                          type: 'Point',
                          coordinates: [
                            parseFloat(e.target.value) || 0, 
                            editLot.locationCoords?.coordinates?.[1] ?? 0
                          ]
                        }
                      } : null)}
                      placeholder="-74.0060"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      if (!navigator.geolocation) {
                        console.error('Geolocation is not supported by this browser.');
                        return;
                      }

                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const { latitude, longitude } = position.coords;
                          setEditLot(editLot ? {
                            ...editLot,
                            locationCoords: {
                              type: 'Point',
                              coordinates: [longitude, latitude]
                            }
                          } : null);
                          console.log('Location updated:', latitude, longitude);
                        },
                        (error) => {
                          console.error('Error getting location:', error.message);
                        },
                        {
                          enableHighAccuracy: true,
                          timeout: 10000,
                          maximumAge: 60000
                        }
                      );
                    }}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Use Current Location
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="edit-totalSlots">Total Slots</Label>
                    <Input
                      id="edit-totalSlots"
                      type="number"
                      value={editLot.totalSlots || ''}
                      onChange={(e) => setEditLot(editLot ? {...editLot, totalSlots: parseInt(e.target.value) || 0} : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-availableSlots">Available Slots</Label>
                    <Input
                      id="edit-availableSlots"
                      type="number"
                      value={editLot.availableSlots || ''}
                      onChange={(e) => setEditLot(editLot ? {...editLot, availableSlots: parseInt(e.target.value) || 0} : null)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-pricePerHour">Price per Hour (₹)</Label>
                  <Input
                    id="edit-pricePerHour"
                    type="number"
                    step="0.01"
                    value={editLot.pricePerHour || ''}
                    onChange={(e) => setEditLot(editLot ? {...editLot, pricePerHour: parseFloat(e.target.value) || 0} : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-operatingHours">Operating Hours</Label>
                  <Input
                    id="edit-operatingHours"
                    value={editLot.operatingHours}
                    onChange={(e) => setEditLot(editLot ? {...editLot, operatingHours: e.target.value} : null)}
                    placeholder="24/7"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowEditForm({show: false, lot: null})}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleUpdateLot}>
                  <Edit className="mr-2 h-4 w-4" />
                  Update Lot
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* QR Code Modal */}
        {showQRCode.show && showQRCode.lot && showQRCode.qrCodeData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code for {showQRCode.lot.name}
                </CardTitle>
                <CardDescription>
                  Scan this QR code to access the parking lot page
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="p-4 bg-white rounded-lg mb-4">
                  <img 
                    src={showQRCode.qrCodeData} 
                    alt={`QR Code for ${showQRCode.lot.name}`}
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Lot: {showQRCode.lot.name}
                </p>
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1" onClick={() => setShowQRCode({lot: null, show: false, qrCodeData: ''})}>
                    Close
                  </Button>
                  <Button className="flex-1" onClick={downloadQRCode}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Parking Lots List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Parking Lots</h2>
            <Badge variant="secondary">{lots.length} lots</Badge>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-1" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex justify-between pt-1">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : lots.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Car className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-semibold mb-1">No parking lots yet</h3>
                <p className="text-muted-foreground mb-3 text-center text-sm">
                  Add your first parking lot to get started
                </p>
                <Button size="sm" onClick={() => setShowAddForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Parking Lot
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {lots.map((lot) => (
                <Card key={lot.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{lot.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                          <MapPin className="h-3 w-3" />
                          {lot.location}
                        </CardDescription>
                      </div>
                      <Badge variant={lot.availableSlots > 10 ? 'secondary' : 'destructive'} className="text-xs">
                        {lot.availableSlots} / {lot.totalSlots}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow pb-2">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-sm">Price:</span>
                        <span className="font-medium text-sm">₹{lot.pricePerHour.toFixed(2)}/hr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-sm">Hours:</span>
                        <span className="font-medium text-sm">{lot.operatingHours}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-sm">Occupancy:</span>
                        <span className="font-medium text-sm">
                          {lot.totalSlots > 0 
                            ? `${Math.round(((lot.totalSlots - lot.availableSlots) / lot.totalSlots) * 100)}%`
                            : '0%'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent className="pt-0">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleShowQRCode(lot)}>
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditLot(lot)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteLot(lot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}