'use client';

import Link from 'next/link';
import { ParkingSquare, Shield, User, BookMarked, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import placeholderImages from '@/lib/placeholder-images.json';
import { useAuth } from '@/contexts/AuthContext';

import { useRouter } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

export function Header() {
    const { user, isUserLoading, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const userImage = placeholderImages.placeholderImages.find(img => img.id === 'user-profile-avatar');
    const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0) || '?';

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <ParkingSquare className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">SmartParkr</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Find Parking
          </Link>
          <Link
            href="/bookings"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            My Bookings
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {isUserLoading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                     {userImage && <AvatarImage src={userImage.imageUrl} alt="User Avatar" />}
                    <AvatarFallback>{userInitial.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                        <User className="mr-2" />
                        <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookings">
                        <BookMarked className="mr-2" />
                        <span>My Bookings</span>
                    </Link>
                  </DropdownMenuItem>
                   {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">
                          <Shield className="mr-2" />
                          <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === 'owner' && (
                    <DropdownMenuItem asChild>
                      <Link href="/owner/dashboard">
                          <Shield className="mr-2" />
                          <span>Owner Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
                <Button variant="ghost" asChild>
                    <Link href="/login">
                    <User className="h-4 w-4 mr-2" />
                    Login
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/register">
                    Sign Up
                    </Link>
                </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
