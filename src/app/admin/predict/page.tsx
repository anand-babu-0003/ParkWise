'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BrainCircuit, 
  Calendar, 
  MapPin,
  TrendingUp
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DemandPredictionPage() {
  const [selectedLot, setSelectedLot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  // Mock parking lot data
  const parkingLots = [
    { id: '1', name: 'City Center Parking' },
    { id: '2', name: 'Mall Parking' },
    { id: '3', name: 'Airport Parking' },
    { id: '4', name: 'Stadium Parking' },
    { id: '5', name: 'Downtown Parking' },
  ];

  // Mock prediction data
  const predictionData = [
    { time: '06:00', demand: 15 },
    { time: '07:00', demand: 45 },
    { time: '08:00', demand: 80 },
    { time: '09:00', demand: 65 },
    { time: '10:00', demand: 40 },
    { time: '11:00', demand: 30 },
    { time: '12:00', demand: 35 },
    { time: '13:00', demand: 45 },
    { time: '14:00', demand: 50 },
    { time: '15:00', demand: 60 },
    { time: '16:00', demand: 75 },
    { time: '17:00', demand: 90 },
    { time: '18:00', demand: 85 },
    { time: '19:00', demand: 70 },
    { time: '20:00', demand: 50 },
    { time: '21:00', demand: 30 },
    { time: '22:00', demand: 15 },
  ];

  const handlePredict = () => {
    console.log('Predict demand for:', { selectedLot, selectedDate });
    // Implement prediction logic
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Demand Prediction</h1>
        <p className="text-gray-600">Predict parking demand using AI algorithms</p>
      </div>

      {/* Prediction Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5" />
            Prediction Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parking-lot">Parking Lot</Label>
              <Select value={selectedLot} onValueChange={setSelectedLot}>
                <SelectTrigger id="parking-lot">
                  <SelectValue placeholder="Select a parking lot" />
                </SelectTrigger>
                <SelectContent>
                  {parkingLots.map((lot) => (
                    <SelectItem key={lot.id} value={lot.id}>
                      {lot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                className="w-full"
                onClick={handlePredict}
                disabled={!selectedLot || !selectedDate}
              >
                <BrainCircuit className="mr-2 h-4 w-4" />
                Predict Demand
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Prediction Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">Parking Lot</div>
                <div className="font-medium">City Center Parking</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">Date</div>
                <div className="font-medium">2023-05-20</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">Peak Demand Time</div>
                <div className="font-medium">17:00 (90%)</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Demand Visualization */}
          <div className="h-80">
            <h3 className="text-lg font-medium mb-4">Hourly Demand Forecast</h3>
            <div className="flex items-end h-64 gap-2 mt-4 border-b pb-4">
              {predictionData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="text-xs text-gray-500 mb-1">{item.time}</div>
                  <div 
                    className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                    style={{ height: `${item.demand}%` }}
                  />
                  <div className="text-xs text-gray-500 mt-1">{item.demand}%</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Peak Hours</h3>
              <p className="text-sm text-gray-600">
                The highest demand is expected between 16:00-18:00 with peak occupancy of 90%. 
                Consider increasing staffing during these hours and implementing dynamic pricing.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Low Demand Periods</h3>
              <p className="text-sm text-gray-600">
                The lowest demand is expected between 06:00-08:00 and 21:00-22:00 with occupancy below 20%. 
                This might be a good time for maintenance activities or offering promotional rates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}