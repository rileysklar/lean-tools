import { useOrganization, useUser } from '@clerk/nextjs';
import { useCallback, useState, useEffect } from 'react';

interface Organization {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export function useClerkOrganization() {
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { user, isLoaded: userLoaded } = useUser();
  const [current, setCurrent] = useState<Organization | null>(null);
  const [available, setAvailable] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Update current organization when Clerk data changes
  useEffect(() => {
    if (!orgLoaded || !userLoaded) return;

    try {
      if (organization) {
        setCurrent({
          id: organization.id,
          name: organization.name,
          imageUrl: organization.imageUrl
        });
      } else {
        // User is not in an organization, create personal workspace
        setCurrent({
          id: 'personal',
          name: 'Personal Workspace',
          imageUrl: undefined
        });
      }

      // Get available organizations from user memberships
      if (user?.organizationMemberships) {
        const orgs: Organization[] = user.organizationMemberships.map(
          (membership) => ({
            id: membership.organization.id,
            name: membership.organization.name,
            imageUrl: membership.organization.imageUrl || undefined
          })
        );

        // Add personal workspace if user is not in any organization
        if (orgs.length === 0) {
          orgs.push({
            id: 'personal',
            name: 'Personal Workspace',
            imageUrl: undefined
          });
        }

        setAvailable(orgs);
      } else {
        // Fallback to personal workspace
        setAvailable([
          {
            id: 'personal',
            name: 'Personal Workspace',
            imageUrl: undefined
          }
        ]);
      }

      setError(null);
    } catch (err) {
      const orgError = new Error('Failed to load organization data');
      setError(orgError);

      // Fallback to personal workspace
      setCurrent({
        id: 'personal',
        name: 'Personal Workspace',
        imageUrl: undefined
      });
      setAvailable([
        {
          id: 'personal',
          name: 'Personal Workspace',
          imageUrl: undefined
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [organization, user, orgLoaded, userLoaded]);

  const switchOrganization = useCallback(
    async (orgId: string) => {
      try {
        if (orgId === 'personal') {
          // Switch to personal workspace
          // In Clerk, this means leaving the current organization
          // You might need to implement this based on your Clerk setup
          setCurrent({
            id: 'personal',
            name: 'Personal Workspace',
            imageUrl: undefined
          });
        } else {
          // Find the organization in available list
          const targetOrg = available.find((org) => org.id === orgId);
          if (targetOrg) {
            setCurrent(targetOrg);
          }
        }
      } catch (err) {
        const switchError = new Error('Failed to switch organization');
        setError(switchError);
      }
    },
    [available]
  );

  return {
    current,
    available,
    isLoading,
    error,
    switchOrganization
  };
}
