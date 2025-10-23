'use client';

import { Header } from '@/components/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import placeholderImages from '@/lib/placeholder-images.json';
import Link from 'next/link';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const userImage = placeholderImages.placeholderImages.find(img => img.id === 'user-profile-avatar');
  const userInitial = user?.displayName?.charAt(0) || user?.email?.charAt(0) || '';

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const renderProfileContent = () => {
    if (isUserLoading) {
      return (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <Separator />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      );
    }

    if (!user) {
      return (
        <Card className="text-center p-8">
          <CardTitle>You are not logged in</CardTitle>
          <CardDescription className="mt-2">Please log in to view your profile.</CardDescription>
          <Button asChild className="mt-6">
            <Link href="/login">Login</Link>
          </Button>
        </Card>
      )
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              {user.photoURL ? <AvatarImage src={user.photoURL} alt="User Avatar" /> : userImage && <AvatarImage src={userImage.imageUrl} alt="User Avatar" />}
              <AvatarFallback>{userInitial.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user.displayName || "User"}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue={user.displayName || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={user.email || ''} disabled />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="********" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="New Password" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
              <Button variant="outline">Discard Changes</Button>
              <Button>Save Changes</Button>
          </div>

          <Separator />

           <div>
            <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="secondary" asChild>
                    <Link href="/bookings">View My Bookings</Link>
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4"/>
                  Logout
                </Button>
            </div>
           </div>
        </CardContent>
      </Card>
    );
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-8 font-headline">
            My Profile
          </h1>
          {renderProfileContent()}
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ParkWise. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
