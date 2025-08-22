'use client';

import { OrganizationProfile, useOrganization, useOrganizationList } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Building2, AlertCircle, Check } from 'lucide-react';
import Link from 'next/link';

export default function OrganizationPage() {
  const { organization, isLoaded } = useOrganization();
  const { userMemberships, setActive, isLoaded: orgListLoaded } = useOrganizationList({
    userMemberships: true,
  });

  // Show loading state while Clerk is loading
  if (!isLoaded || !orgListLoaded) {
    return (
      <div className="flex w-full flex-col p-4 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading organization...</p>
          </div>
        </div>
      </div>
    );
  }

  // If no organization is active, show organization selection
  if (!organization) {
    return (
      <div className="flex w-full flex-col p-4 space-y-6 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              No Organization Active
            </CardTitle>
            <CardDescription>
              Please select an organization to continue or create a new one.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userMemberships.data && userMemberships.data.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Your Organizations:</p>
                {userMemberships.data.map((membership) => (
                  <div 
                    key={membership.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {membership.organization.imageUrl ? (
                        <img 
                          src={membership.organization.imageUrl} 
                          alt={membership.organization.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{membership.organization.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{membership.role}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setActive({ organization: membership.organization.id })}
                      size="sm"
                    >
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">You&apos;re not a member of any organizations yet.</p>
                <Button asChild>
                  <Link href="/dashboard/organization/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Organization
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Organization is active, show the profile
  return (
    <div className="flex w-full flex-col p-4 space-y-6 overflow-y-auto">
      {/* Organization Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {organization.imageUrl ? (
                <img 
                  src={organization.imageUrl} 
                  alt={organization.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <CardTitle className="text-xl">{organization.name}</CardTitle>
                <CardDescription>
                  Organization ID: {organization.id}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active</span>
              <Check className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Organization Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
          <CardDescription>
            Manage your organization&apos;s profile, members, and settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrganizationProfile />
        </CardContent>
      </Card>
    </div>
  );
}
