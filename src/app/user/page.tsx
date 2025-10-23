import { redirect } from 'next/navigation';

export default function UserPage() {
  // Redirect to the dashboard by default
  redirect('/user/dashboard');
}