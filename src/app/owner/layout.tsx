'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useAuth();
  const router = useRouter();
  const [isOwnerRegistered, setIsOwnerRegistered] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOwnerRegistration = async () => {
      if (user && user.role === 'owner') {
        try {
          const response = await fetch(`/api/owner/profile?userId=${user.id}`);
          // If response is ok (200), owner is registered
          // If response is 404, owner is not registered yet
          setIsOwnerRegistered(response.ok);
        } catch (error) {
          console.error('Error checking owner registration:', error);
          // In case of network error, assume not registered to be safe
          setIsOwnerRegistered(false);
        }
      }
    };

    if (!isUserLoading && user && user.role === 'owner') {
      checkOwnerRegistration();
    } else if (!isUserLoading && (!user || (user.role !== 'owner' && user.role !== 'admin'))) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    // Only redirect if we're on a page other than the registration page itself
    if (isOwnerRegistered === false && 
        typeof window !== 'undefined' && 
        !window.location.pathname.includes('/owner/register')) {
      router.push('/owner/register');
    }
  }, [isOwnerRegistered, router]);

  if (isUserLoading || (user && user.role === 'owner' && isOwnerRegistered === null)) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
    return null;
  }

  // Allow admin users to access owner pages for management purposes
  if (user.role === 'admin') {
    return <>{children}</>;
  }

  // If owner is not registered and we're not on the registration page, don't render children
  if (isOwnerRegistered === false && 
      typeof window !== 'undefined' && 
      !window.location.pathname.includes('/owner/register')) {
    return null;
  }

  return <>{children}</>;
}