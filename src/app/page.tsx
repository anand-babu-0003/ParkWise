'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileLayout } from './mobile-layout';

export default function Home() {
  const { user, isUserLoading } = useAuth();
  const router = useRouter();
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);
  const [setupChecked, setSetupChecked] = useState(false);

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
        setSetupChecked(true);
      }
    };

    if (!setupChecked) {
      checkSetupStatus();
    }
  }, [router, setupChecked]);

  useEffect(() => {
    // Don't do anything until setup check is complete
    if (isCheckingSetup) {
      return;
    }

    // Don't do anything while user data is loading
    if (isUserLoading) {
      return;
    }

    // If no user is logged in, redirect to login page
    if (!user) {
      router.push('/login');
      return;
    }

    // If user is logged in, redirect based on their role
    switch (user.role) {
      case 'admin':
        router.push('/admin/dashboard');
        break;
      case 'owner':
        router.push('/owner/dashboard');
        break;
      case 'user':
        router.push('/user');
        break;
      default:
        router.push('/login');
    }
  }, [user, isUserLoading, router, isCheckingSetup]);

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

  // This should never be reached due to redirects, but just in case
  return (
    <MobileLayout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mt-4 text-lg">Redirecting...</p>
        </div>
      </div>
    </MobileLayout>
  );
}