'use client';

import MobileRegister from '../mobile-register';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileLayout } from '../mobile-layout';

export default function RegisterPage() {
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

    checkSetupStatus();
  }, [router]);

  if (isCheckingSetup) {
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

  return (
    <MobileLayout>
      <MobileRegister />
    </MobileLayout>
  );
}