'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import placeholderImages from '@/lib/placeholder-images.json';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, User, Lock, CreditCard } from 'lucide-react';

export default function MobileProfile() {
  const { user, isUserLoading, logout } = useAuth();
  const router = useRouter();

  const userImage = placeholderImages.placeholderImages.find(img => img.id === 'user-profile-avatar');
  const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0) || '';

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const renderProfileContent = () => {
    if (isUserLoading) {
      return (
        <div className="p-4 space-y-6">
          <Card>
            <CardHeader className="items-center">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-6 w-32 mt-2" />
              <Skeleton className="h-4 w-48 mt-1" />
            </CardHeader>
          </Card>
          
          <Card>
            <CardContent className="space-y-4 p-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      );
    }

    if (!user) {
      return (
        <Card className="text-center p-8 mx-4 mt-8">
          <CardTitle>You are not logged in</CardTitle>
          <CardDescription className="mt-2">Please log in to view your profile.</CardDescription>
          <Button asChild className="mt-6 w-full">
            <Link href="/login">Login</Link>
          </Button>
        </Card>
      )
    }

    return (
      <div className="p-4 space-y-6">
        {/* User Info Card */}
        <Card>
          <CardHeader className="items-center">
            <Avatar className="h-24 w-24">
              {userImage && <AvatarImage src={userImage.imageUrl} alt="User Avatar" />}
              <AvatarFallback className="text-2xl">{userInitial.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <CardTitle className="text-xl">{user.name || "User"}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <CardDescription className="capitalize mt-1">{user.role}</CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Options */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/bookings">
              <User className="mr-2 h-4 w-4" />
              My Bookings
            </Link>
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <CreditCard className="mr-2 h-4 w-4" />
            Payment Methods
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </Button>
        </div>

        {/* Account Actions */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <Button variant="secondary" className="w-full" asChild>
              <Link href="/bookings">View My Bookings</Link>
            </Button>
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold font-headline">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {renderProfileContent()}
      </div>
    </div>
  );
}