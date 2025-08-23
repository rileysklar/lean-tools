import { useOrganization, useUser } from '@clerk/nextjs';
import { useMemo, useState, useEffect } from 'react';
import {
  UserRole,
  canAccessAttainment,
  canManageAttainment,
  hasPermission
} from '@/lib/auth/permissions';

// Custom error class for role determination errors
class RoleDeterminationError extends Error {
  constructor(
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'RoleDeterminationError';
  }
}

export function useUserRole() {
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { user, isLoaded: userLoaded } = useUser();
  const [userRole, setUserRole] = useState<UserRole>('member');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Determine user role based on Clerk organization membership
  useEffect(() => {
    const determineUserRole = async () => {
      if (!orgLoaded || !userLoaded) return;

      try {
        if (!organization || !user) {
          setUserRole('member');
          setIsLoaded(true);
          return;
        }

        // Get the user's role in the current organization
        // Use the organization's publicMetadata or check the user's organization membership
        let role = 'member';

        // Try to get role from organization metadata or user's organization membership
        if (organization.publicMetadata?.userRole) {
          role = organization.publicMetadata.userRole as string;
        } else if (user.organizationMemberships) {
          // Find the current organization membership
          const membership = user.organizationMemberships.find(
            (m) => m.organization.id === organization.id
          );
          if (membership) {
            role = membership.role;
          }
        }

        let mappedRole: UserRole = 'member';

        // Map Clerk roles to our UserRole type
        // Clerk uses different role names than what we expect
        switch (role) {
          case 'admin':
          case 'Admin':
          case 'ADMIN':
            mappedRole = 'admin';
            break;
          case 'basic_member':
          case 'Basic Member':
          case 'basic_member':
            mappedRole = 'member';
            break;
          case 'basic_admin':
          case 'Basic Admin':
          case 'basic_admin':
            mappedRole = 'manager';
            break;
          case 'member':
          case 'Member':
          case 'MEMBER':
            mappedRole = 'member';
            break;
          default:
            // If we don't recognize the role, check if it contains 'admin' or 'Admin'
            if (role && typeof role === 'string') {
              if (role.toLowerCase().includes('admin')) {
                mappedRole = 'admin';
              } else if (
                role.toLowerCase().includes('manager') ||
                role.toLowerCase().includes('basic_admin')
              ) {
                mappedRole = 'manager';
              } else {
                mappedRole = 'member';
              }
            } else {
              mappedRole = 'member';
            }
        }

        setUserRole(mappedRole);
        setError(null);
      } catch (error) {
        const roleError = new RoleDeterminationError(
          'Failed to determine user role from Clerk organization membership',
          error
        );
        setError(roleError);
        // Fallback to member role on error
        setUserRole('member');
      } finally {
        setIsLoaded(true);
      }
    };

    determineUserRole();
  }, [organization, user, orgLoaded, userLoaded]);

  // Memoized permission checks
  const permissions = useMemo(
    () => ({
      canAccessAttainment: canAccessAttainment(userRole),
      canManageAttainment: canManageAttainment(userRole),
      canAccessOrganization: hasPermission(userRole, 'organization', 'read'),
      canManageOrganization: hasPermission(userRole, 'organization', 'manage'),
      canAccessUsers: hasPermission(userRole, 'users', 'read'),
      canManageUsers: hasPermission(userRole, 'users', 'manage'),
      canAccessReports: hasPermission(userRole, 'reports', 'read'),
      canManageReports: hasPermission(userRole, 'reports', 'manage'),
      canAccessSettings: hasPermission(userRole, 'settings', 'read'),
      canManageSettings: hasPermission(userRole, 'settings', 'manage')
    }),
    [userRole]
  );

  // Check if user has access to a specific resource and action
  const hasAccess = useMemo(
    () => ({
      attainment: {
        read: permissions.canAccessAttainment,
        write: permissions.canManageAttainment,
        manage: permissions.canManageAttainment
      },
      organization: {
        read: permissions.canAccessOrganization,
        write: permissions.canManageOrganization,
        manage: permissions.canManageOrganization
      },
      users: {
        read: permissions.canAccessUsers,
        write: permissions.canManageUsers,
        manage: permissions.canManageUsers
      },
      reports: {
        read: permissions.canAccessReports,
        write: permissions.canManageReports,
        manage: permissions.canManageReports
      },
      settings: {
        read: permissions.canAccessSettings,
        write: permissions.canManageSettings,
        manage: permissions.canManageSettings
      }
    }),
    [permissions]
  );

  return {
    userRole,
    isLoaded,
    error,
    organization,
    user,
    // Permission checks
    ...permissions,
    // Resource access checks
    hasAccess,
    // Helper function to check any permission
    checkPermission: (resource: string, action: string) =>
      hasPermission(userRole, resource, action)
  };
}
