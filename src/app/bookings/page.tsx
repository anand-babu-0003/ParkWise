'use client';

import { MobileLayout } from '@/app/mobile-layout';
import MobileBookingsList from '@/app/mobile-bookings-list';

export default function MyBookingsPage() {
  return (
    <MobileLayout>
      <MobileBookingsList />
    </MobileLayout>
  );
}
