'use client';

import { useState } from 'react';
import { ParkingSquare, MapPin, BookMarked, User, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import placeholderImages from '@/lib/placeholder-images.json';

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const userImage = placeholderImages.placeholderImages.find(img => img.id === 'user-profile-avatar');
  const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0) || '?';

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <ParkingSquare className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">SmartParkr</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            {isUserLoading ? (
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium hidden sm:block">
                  {user.name?.split(' ')[0] || 'User'}
                </span>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-medium text-primary">
                    {userInitial.toUpperCase()}
                  </span>
                </div>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" variant="default">
                  Login
                </Button>
              </Link>
            )}
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4 border-b">
                    <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
                      <ParkingSquare className="h-8 w-8 text-primary" />
                      <span className="text-xl font-bold text-foreground">SmartParkr</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                  
                  <nav className="flex-1 py-6">
                    <ul className="space-y-4">
                      <li>
                        <Link 
                          href="/" 
                          className="flex items-center gap-3 text-lg font-medium p-3 rounded-lg hover:bg-muted transition-colors"
                          onClick={closeMenu}
                        >
                          <MapPin className="h-5 w-5" />
                          Find Parking
                        </Link>
                      </li>
                      {user && (
                        <>
                          <li>
                            <Link 
                              href="/bookings" 
                              className="flex items-center gap-3 text-lg font-medium p-3 rounded-lg hover:bg-muted transition-colors"
                              onClick={closeMenu}
                            >
                              <BookMarked className="h-5 w-5" />
                              My Bookings
                            </Link>
                          </li>
                          {user.role === 'user' && (
                            <li>
                              <Link 
                                href="/user/dashboard" 
                                className="flex items-center gap-3 text-lg font-medium p-3 rounded-lg hover:bg-muted transition-colors"
                                onClick={closeMenu}
                              >
                                <User className="h-5 w-5" />
                                My Dashboard
                              </Link>
                            </li>
                          )}
                          <li>
                            <Link 
                              href="/profile" 
                              className="flex items-center gap-3 text-lg font-medium p-3 rounded-lg hover:bg-muted transition-colors"
                              onClick={closeMenu}
                            >
                              <User className="h-5 w-5" />
                              Profile
                            </Link>
                          </li>
                          {user.role === 'admin' && (
                            <li>
                              <Link 
                                href="/admin/dashboard" 
                                className="flex items-center gap-3 text-lg font-medium p-3 rounded-lg hover:bg-muted transition-colors"
                                onClick={closeMenu}
                              >
                                <span className="h-5 w-5 flex items-center justify-center">🔒</span>
                                Admin Panel
                              </Link>
                            </li>
                          )}
                          {user.role === 'owner' && (
                            <li>
                              <Link 
                                href="/owner/dashboard" 
                                className="flex items-center gap-3 text-lg font-medium p-3 rounded-lg hover:bg-muted transition-colors"
                                onClick={closeMenu}
                              >
                                <span className="h-5 w-5 flex items-center justify-center">🏢</span>
                                Owner Dashboard
                              </Link>
                            </li>
                          )}
                        </>
                      )}
                    </ul>
                  </nav>
                  
                  <div className="py-6 border-t">
                    {user ? (
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => {
                          handleLogout();
                          closeMenu();
                        }}
                      >
                        Logout
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Button asChild>
                          <Link href="/login" onClick={closeMenu}>
                            Login
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="/register" onClick={closeMenu}>
                            Sign Up
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="py-6 border-t bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SmartParkr. All rights reserved.
        </div>
      </footer>
    </div>
  );
}