'use client';

import { UserProfile } from '@clerk/nextjs';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function ProfileViewPage() {
  return (
    <ProtectedRoute requiredPermission='profile'>
      <div className='flex w-full flex-col space-y-6 overflow-y-auto p-4'>
        <UserProfile />
      </div>
    </ProtectedRoute>
  );
}
