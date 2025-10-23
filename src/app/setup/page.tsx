
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ParkingSquare, Loader2, ShieldCheck } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

export default function SetupPage() {
    const bgImage = placeholderImages.placeholderImages.find(img => img.id === 'login-background');
    const auth = useAuth();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          fullName: '',
          email: '',
          password: '',
        },
      });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            
            await updateProfile(userCredential.user, {
                displayName: values.fullName
            });

            if (firestore) {
              const userRef = doc(firestore, 'users', userCredential.user.uid);
              const userData = {
                id: userCredential.user.uid,
                name: values.fullName,
                email: values.email,
                role: 'admin', // Set role to admin
                createdAt: new Date().toISOString(),
              };
               setDocumentNonBlocking(userRef, userData, { merge: true });
            }

            toast({ title: "Admin Account Created", description: "Welcome to ParkWise!" });
            router.push('/admin/dashboard');
        } catch (error: any) {
            console.error("Admin Registration Error:", error);
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: error.message || "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
       <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
             <Link href="/" className="flex items-center gap-2 justify-center mb-4">
              <ParkingSquare className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">ParkWise</span>
            </Link>
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                <ShieldCheck className="w-8 h-8 text-accent" />
                Admin Setup
            </h1>
            <p className="text-balance text-muted-foreground">
              Create the first administrator account for ParkWise.
            </p>
          </div>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <FormControl>
                    <Input id="full-name" placeholder="Admin User" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <FormControl>
                            <Input id="password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Admin Account
            </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {bgImage && (
            <Image
                src={bgImage.imageUrl}
                alt={bgImage.description}
                data-ai-hint={bgImage.imageHint}
                fill
                className="object-cover dark:brightness-[0.3]"
            />
        )}
      </div>
    </div>
  );
}
