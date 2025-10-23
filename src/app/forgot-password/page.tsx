
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ParkingSquare } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';

import { MobileLayout } from '@/app/mobile-layout';
import MobileForgotPassword from '@/app/mobile-forgot-password';

export default function ForgotPasswordPage() {
  return (
    <MobileLayout>
      <MobileForgotPassword />
    </MobileLayout>
  );
}
