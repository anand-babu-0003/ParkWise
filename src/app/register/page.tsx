'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ParkingSquare, Loader2 } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';


const formSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

export default function RegisterPage() {
    const bgImage = placeholderImages.placeholderImages.find(img => img.id === 'login-background');
    const auth = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    
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
            toast({ title: "Account Created", description: "Welcome to ParkWise!" });
            router.push('/admin/dashboard');
        } catch (error: any) {
            console.error("Registration Error:", error);
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: error.message || "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        const provider = new GoogleAuthProvider();
        try {
          await signInWithPopup(auth, provider);
          toast({ title: "Sign Up Successful", description: "Welcome!" });
          router.push('/admin/dashboard');
        } catch (error: any) {
          console.error("Google Sign Up Error:", error);
          toast({
            variant: "destructive",
            title: "Google Sign Up Failed",
            description: error.message || "Could not sign up with Google. Please try again.",
          });
        } finally {
          setIsGoogleLoading(false);
        }
    }


  return (
    <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
       <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
             <Link href="/" className="flex items-center gap-2 justify-center mb-4">
              <ParkingSquare className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">ParkWise</span>
            </Link>
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-balance text-muted-foreground">
              Create an account to start booking parking spots.
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
                    <Input id="full-name" placeholder="Max Robinson" {...field} />
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
                      placeholder="m@example.com"
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
            <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create an account
            </Button>
            </form>
          </Form>
           <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading}>
              {isGoogleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign up with Google
            </Button>
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
