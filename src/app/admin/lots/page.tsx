'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Eye
} from 'lucide-react';
import { useCollection } from '@/lib/mongodb';

interface ParkingLot {
  id: string;
  name: string;
  location: string;
  totalSlots: number;
  availableSlots: number;
  pricePerHour: number;
  createdAt: string;
}

export default function ParkingLotsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: parkingLots, isLoading } = useCollection<ParkingLot>('/api/parking-lots');

  const filteredLots = parkingLots?.filter(lot => 
    lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEditLot = (lotId: string) => {
    console.log('Edit lot:', lotId);
    // Implement edit functionality
  };

  const handleDeleteLot = (lotId: string) => {
    console.log('Delete lot:', lotId);
    // Implement delete functionality
  };

  const handleViewLot = (lotId: string) => {
    console.log('View lot:', lotId);
    // Implement view functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parking Lots</h1>
          <p className="text-gray-600">Manage all parking lots in the system</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Parking Lot
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search parking lots by name or location..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Parking Lots Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            All Parking Lots
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-3 w-48 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Parking Lot</th>
                      <th className="text-left py-3 px-4 font-medium">Location</th>
                      <th className="text-left py-3 px-4 font-medium">Slots</th>
                      <th className="text-left py-3 px-4 font-medium">Price/Hour</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Created</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLots.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">
                          No parking lots found matching your search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredLots.map((lot) => (
                        <tr key={lot.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{lot.name}</div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{lot.location}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{lot.availableSlots}</span>
                              <span className="text-gray-400">/</span>
                              <span>{lot.totalSlots}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium">₹{lot.pricePerHour.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {lot.createdAt ? new Date(lot.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewLot(lot.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditLot(lot.id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteLot(lot.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}