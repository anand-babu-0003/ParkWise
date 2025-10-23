import { redirect } from 'next/navigation';

export default function OwnerPage() {
  // Redirect to the dashboard by default
  redirect('/owner/dashboard');
}