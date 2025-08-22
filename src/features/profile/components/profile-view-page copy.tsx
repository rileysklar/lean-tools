'use client';

import { UserProfile } from '@clerk/nextjs';
import { useUser, useOrganization, useAuth } from '@clerk/nextjs';

export default function ProfileViewPage() {
  const { user } = useUser();
  const { organization, isLoaded } = useOrganization();
  const { has, isLoaded: authLoaded } = useAuth();
  
  return (
    <div className='flex w-full flex-col p-4 space-y-6 overflow-y-auto'>
        <UserProfile />
    </div>
  );
}
