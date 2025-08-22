'use client';

import { UserProfile } from '@clerk/nextjs';
import { useUser, useOrganization, useAuth } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ProfileViewPage() {
  const { user } = useUser();
  const { organization, isLoaded } = useOrganization();
  const { has, isLoaded: authLoaded } = useAuth();

  // Debug logging to see what Clerk provides
  console.log('Profile Page - User:', user);
  console.log('Profile Page - Organization:', organization);
  console.log('Profile Page - Is Loaded:', isLoaded);
  console.log('Profile Page - Auth Loaded:', authLoaded);
  console.log('Profile Page - Has Admin Permission:', has?.({ permission: 'org:admin' }));

  return (
    <div className='flex w-full flex-col p-4 space-y-6 overflow-y-auto'>
        <UserProfile />
    </div>
  );
}
