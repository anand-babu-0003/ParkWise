import Link from 'next/link';
import { ParkingSquare, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <ParkingSquare className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">ParkWise</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Find Parking
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">
              <User className="h-4 w-4 mr-2" />
              Login
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/dashboard">
               <Shield className="h-4 w-4 mr-2" />
              Admin Panel
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
