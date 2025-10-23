
import { Header } from '@/components/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import placeholderImages from '@/lib/placeholder-images.json';
import Link from 'next/link';

export default function ProfilePage() {
  const userImage = placeholderImages.placeholderImages.find(img => img.id === 'user-profile-avatar');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-8 font-headline">
            My Profile
          </h1>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  {userImage && <AvatarImage src={userImage.imageUrl} alt="User Avatar" />}
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">Max Robinson</h2>
                  <p className="text-muted-foreground">max@example.com</p>
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
                    <Input id="fullName" defaultValue="Max Robinson" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="max@example.com" disabled />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
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
                    <Button variant="destructive">Logout</Button>
                </div>
               </div>


            </CardContent>
          </Card>
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
