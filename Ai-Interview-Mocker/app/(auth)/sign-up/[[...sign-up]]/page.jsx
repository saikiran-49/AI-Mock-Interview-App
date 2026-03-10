'use client';

import { useAuth, SignIn } from '@clerk/nextjs';

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    // Redirect to the sign-in page with a redirect URL
    return <SignIn redirectUrl="/dashboard" />;
  }

  return (
    <div>
      <h1>Welcome to your Dashboard, {user.firstName}!</h1>
      {/* Your dashboard content here */}
    </div>
  );
}
