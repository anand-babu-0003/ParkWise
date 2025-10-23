'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileLayout } from './mobile-layout';
import MobileHome from './mobile-home';

export default function Home() {
  const { user, isUserLoading } = useAuth();
  const router = useRouter();
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const response = await fetch('/api/setup/status');
        const data = await response.json();
        
        if (!data.isSetupComplete) {
          router.push('/setup');
          return;
        }
      } catch (error) {
        console.error('Setup status check failed:', error);
      } finally {
        setIsCheckingSetup(false);
      }
    };

    if (!isUserLoading) {
      if (!user) {
        // Check if setup is needed
        checkSetupStatus();
      } else {
        // Redirect based on user role
        switch (user.role) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'owner':
            router.push('/owner/dashboard');
            break;
          case 'user':
            // For regular users, stay on the home page
            setIsCheckingSetup(false);
            break;
          default:
            setIsCheckingSetup(false);
        }
      }
    }
  }, [user, isUserLoading, router]);

  // Handle redirect for unauthenticated users
  useEffect(() => {
    if (!isCheckingSetup && !isUserLoading && !user) {
      router.push('/login');
    }
  }, [isCheckingSetup, isUserLoading, user, router]);

  // Show loading state while checking
  if (isCheckingSetup || isUserLoading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Loading...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // For authenticated users (especially regular users), show the mobile home page
  // Admins and owners should have been redirected by now
  return (
    <MobileLayout>
      <MobileHome />
    </MobileLayout>
  );
}