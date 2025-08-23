'use client';

import {
  OrganizationProfile,
  useOrganization,
  useOrganizationList
} from '@clerk/nextjs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Building2, AlertCircle, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useEffect } from 'react';
import { useLoadingState } from '@/hooks/use-loading-state';
import { LoadingSpinner } from '@/components/ui/loading-states';

export default function OrganizationPage() {
  const { organization, isLoaded } = useOrganization();
  const {
    userMemberships,
    setActive,
    isLoaded: orgListLoaded
  } = useOrganizationList({
    userMemberships: true
  });
  const { isLoading, startLoading, stopLoading } = useLoadingState();

  // Control body overflow on mount
  useEffect(() => {
    document.body.classList.add('overflow-auto');
    return () => {
      document.body.classList.remove('overflow-auto');
    };
  }, []);

  // Handle organization switching with loading state
  const handleOrganizationSwitch = async (orgId: string) => {
    if (!setActive) return;

    startLoading();
    try {
      await setActive({ organization: orgId });
    } finally {
      stopLoading();
    }
  };

  return (
    <ProtectedRoute requiredPermission='organization'>
      {/* Show loading state while Clerk is loading */}
      {!isLoaded || !orgListLoaded ? (
        <div className='flex w-full flex-col space-y-6 overflow-y-auto p-4'>
          <div className='flex h-64 items-center justify-center'>
            <div className='flex items-center justify-center text-center'>
              <LoadingSpinner size='lg' className='mb-4' />
              <p className='text-muted-foreground'>Loading organization...</p>
            </div>
          </div>
        </div>
      ) : !organization ? (
        // If no organization is active, show organization selection
        <div className='flex w-full flex-col space-y-6 overflow-y-auto p-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <AlertCircle className='h-5 w-5 text-amber-500' />
                No Organization Active
              </CardTitle>
              <CardDescription>
                Please select an organization to continue or create a new one.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {userMemberships.data && userMemberships.data.length > 0 ? (
                <div className='space-y-2'>
                  <p className='text-sm font-medium'>Your Organizations:</p>
                  {userMemberships.data.map((membership) => (
                    <div
                      key={membership.id}
                      className='hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors'
                    >
                      <div className='flex items-center gap-3'>
                        {membership.organization.imageUrl ? (
                          <Image
                            src={membership.organization.imageUrl}
                            alt={membership.organization.name}
                            width={32}
                            height={32}
                            className='h-8 w-8 rounded-lg object-cover'
                          />
                        ) : (
                          <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg'>
                            <Building2 className='text-primary h-4 w-4' />
                          </div>
                        )}
                        <div>
                          <p className='font-medium'>
                            {membership.organization.name}
                          </p>
                          <p className='text-muted-foreground text-sm capitalize'>
                            {membership.role}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() =>
                          handleOrganizationSwitch(membership.organization.id)
                        }
                        size='sm'
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <LoadingSpinner size='sm' className='mr-2' />
                            Selecting...
                          </>
                        ) : (
                          'Select'
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='py-8 text-center'>
                  <Building2 className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                  <p className='text-muted-foreground mb-4'>
                    You&apos;re not a member of any organizations yet.
                  </p>
                  <Button asChild>
                    <Link href='/dashboard/organization/create'>
                      <Plus className='mr-2 h-4 w-4' />
                      Create Organization
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        // Organization is active, show the profile
        <div className='flex w-full flex-col space-y-6 overflow-y-auto p-4'>
          <OrganizationProfile />
          <Card className='max-w-[880px]'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  {organization.imageUrl ? (
                    <Image
                      src={organization.imageUrl}
                      alt={organization.name}
                      width={48}
                      height={48}
                      className='h-12 w-12 rounded-lg object-cover'
                    />
                  ) : (
                    <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg'>
                      <Building2 className='text-primary h-6 w-6' />
                    </div>
                  )}
                  <div>
                    <CardTitle className='text-xl'>
                      {organization.name}
                    </CardTitle>
                    <CardDescription>
                      Organization ID: {organization.id}
                    </CardDescription>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-muted-foreground text-sm'>Active</span>
                  <Check className='h-4 w-4 text-green-500' />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}
    </ProtectedRoute>
  );
}
