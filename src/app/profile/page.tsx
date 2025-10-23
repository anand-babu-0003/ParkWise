'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { MobileLayout } from '@/app/mobile-layout';
import MobileProfile from '@/app/mobile-profile';

export default function ProfilePage() {
  const { user, isUserLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  if (!isUserLoading && !user) {
    router.push('/login');
    return null;
  }

  return (
    <MobileLayout>
      <MobileProfile />
    </MobileLayout>
  );
}
