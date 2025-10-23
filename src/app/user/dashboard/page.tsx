'use client';

import { MobileLayout } from '@/app/mobile-layout';
import MobileUserDashboard from '@/app/mobile-user-dashboard';

export default function UserDashboardPage() {
  return (
    <MobileLayout>
      <MobileUserDashboard />
    </MobileLayout>
  );
}