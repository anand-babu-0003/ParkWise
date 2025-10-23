'use client';

import { MobileLayout } from '@/app/mobile-layout';
import MobileOwnerDashboard from '@/app/mobile-owner-dashboard';

export default function OwnerDashboardPage() {
  return (
    <MobileLayout>
      <MobileOwnerDashboard />
    </MobileLayout>
  );
}