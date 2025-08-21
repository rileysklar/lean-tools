import { useOrganization, useUser } from '@clerk/nextjs';
import { useMemo } from 'react';

export interface OrganizationData {
  id: string;
  name: string;
  imageUrl?: string | null;
  plan?: string;
  role?: string;
}

export function useClerkOrganization() {
  const { organization, isLoaded } = useOrganization();
  const { user } = useUser();

  const organizationData = useMemo(() => {
    if (!isLoaded) {
      return {
        current: undefined,
        available: [],
        isLoading: true,
        isPersonal: false
      };
    }

    if (!organization) {
      // User is not in an organization - personal workspace
      const personalOrg = {
        id: 'personal',
        name: user?.firstName ? `${user.firstName}'s Workspace` : 'Personal Workspace',
        imageUrl: user?.imageUrl,
        plan: 'Personal',
        role: 'Owner'
      };
      
      return {
        current: personalOrg,
        available: [personalOrg],
        isLoading: false,
        isPersonal: true
      };
    }

    // User is in an organization
    const orgData = {
      id: organization.id,
      name: organization.name || 'Unnamed Organization',
      imageUrl: organization.imageUrl,
      plan: 'Organization', // Default plan for organizations
      role: 'Member' // Default role
    };
    
    return {
      current: orgData,
      available: [orgData],
      isLoading: false,
      isPersonal: false
    };
  }, [organization, isLoaded, user]);

  const switchOrganization = async (orgId: string) => {
    if (orgId === 'personal') {
      // Switch to personal workspace
      // This would typically involve Clerk's organization switching
      console.log('Switching to personal workspace');
    } else {
      // Switch to specific organization
      console.log('Switching to organization:', orgId);
    }
  };

  return {
    ...organizationData,
    switchOrganization
  };
}
