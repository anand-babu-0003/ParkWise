'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function MobileTestRoles() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold font-headline">Role Testing</h1>
        <p className="text-muted-foreground">Verify that all roles work properly</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle>Current User Info</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Role:</span>
                  <span className="capitalize">{user.role}</span>
                </div>
              </div>
            ) : (
              <p>You are not logged in</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Role-Based Navigation</CardTitle>
            <CardDescription>Access role-specific features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant={user?.role === 'user' ? 'default' : 'outline'} className="w-full">
              <Link href="/">Regular User View</Link>
            </Button>
            
            {user?.role === 'admin' ? (
              <Button asChild className="w-full">
                <Link href="/admin/dashboard">Admin Dashboard</Link>
              </Button>
            ) : (
              <Button variant="outline" disabled className="w-full">
                Admin Dashboard (Admin Only)
              </Button>
            )}
            
            {user?.role === 'owner' ? (
              <Button asChild className="w-full">
                <Link href="/owner/dashboard">Owner Dashboard</Link>
              </Button>
            ) : (
              <Button variant="outline" disabled className="w-full">
                Owner Dashboard (Owner Only)
              </Button>
            )}
          </CardContent>
        </Card>
        
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Role Registration</CardTitle>
            <CardDescription>Register for different roles</CardDescription>
          </CardHeader>
          <CardContent>
            {!user ? (
              <Button asChild className="w-full">
                <Link href="/register">Register New User</Link>
              </Button>
            ) : user.role === 'user' ? (
              <Button asChild className="w-full">
                <Link href="/owner/register">Register as Owner</Link>
              </Button>
            ) : (
              <p className="text-muted-foreground">No additional registration options available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}