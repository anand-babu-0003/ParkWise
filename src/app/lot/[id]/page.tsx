'use client';

import { useState, useEffect } from 'react';
import { MobileLayout } from '@/app/mobile-layout';
import MobileLotDetails from '@/app/mobile-lot-details';

export default function ParkingLotDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [lotId, setLotId] = useState<string | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setLotId(unwrappedParams.id);
    };
    
    unwrapParams();
  }, [params]);

  if (!lotId) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <MobileLotDetails lotId={lotId} />
    </MobileLayout>
  );
}