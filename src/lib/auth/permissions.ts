export type UserRole = 'admin' | 'manager' | 'member';

export interface Permission {
  resource: string;
  actions: string[];
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { resource: 'attainment', actions: ['read', 'write', 'delete', 'manage'] },
    {
      resource: 'organization',
      actions: ['read', 'write', 'delete', 'manage']
    },
    { resource: 'users', actions: ['read', 'write', 'delete', 'manage'] },
    { resource: 'reports', actions: ['read', 'write', 'delete', 'manage'] },
    { resource: 'settings', actions: ['read', 'write', 'delete', 'manage'] },
    { resource: 'profile', actions: ['read', 'write'] }
  ],
  manager: [
    { resource: 'attainment', actions: ['read', 'write'] },
    { resource: 'organization', actions: ['read'] },
    { resource: 'users', actions: ['read'] },
    { resource: 'reports', actions: ['read', 'write'] },
    { resource: 'settings', actions: ['read'] },
    { resource: 'profile', actions: ['read', 'write'] }
  ],
  member: [
    { resource: 'attainment', actions: ['read'] },
    { resource: 'organization', actions: ['read'] },
    { resource: 'reports', actions: ['read'] },
    { resource: 'profile', actions: ['read', 'write'] }
  ]
};

export function hasPermission(
  userRole: UserRole,
  resource: string,
  action: string
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return false;

  const resourcePermission = permissions.find((p) => p.resource === resource);
  if (!resourcePermission) return false;

  return resourcePermission.actions.includes(action);
}

export function canAccessAttainment(userRole: UserRole): boolean {
  return hasPermission(userRole, 'attainment', 'read');
}

export function canManageAttainment(userRole: UserRole): boolean {
  return hasPermission(userRole, 'attainment', 'manage');
}

export function canAccessOrganization(userRole: UserRole): boolean {
  return hasPermission(userRole, 'organization', 'read');
}

export function canManageOrganization(userRole: UserRole): boolean {
  return hasPermission(userRole, 'organization', 'manage');
}

export function canAccessUsers(userRole: UserRole): boolean {
  return hasPermission(userRole, 'users', 'read');
}

export function canManageUsers(userRole: UserRole): boolean {
  return hasPermission(userRole, 'users', 'manage');
}

export function canAccessReports(userRole: UserRole): boolean {
  return hasPermission(userRole, 'reports', 'read');
}

export function canManageReports(userRole: UserRole): boolean {
  return hasPermission(userRole, 'reports', 'manage');
}

export function canAccessSettings(userRole: UserRole): boolean {
  return hasPermission(userRole, 'settings', 'read');
}

export function canManageSettings(userRole: UserRole): boolean {
  return hasPermission(userRole, 'settings', 'manage');
}

export function canAccessProfile(userRole: UserRole): boolean {
  return hasPermission(userRole, 'profile', 'read');
}

export function canManageProfile(userRole: UserRole): boolean {
  return hasPermission(userRole, 'profile', 'write');
}

// Get all permissions for a specific role
export function getRolePermissions(userRole: UserRole): Permission[] {
  return ROLE_PERMISSIONS[userRole] || [];
}

// Check if a role can perform any action on a resource
export function canAccessResource(
  userRole: UserRole,
  resource: string
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return false;

  return permissions.some((p) => p.resource === resource);
}

// Get all accessible resources for a role
export function getAccessibleResources(userRole: UserRole): string[] {
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return [];

  return permissions.map((p) => p.resource);
}

// Get all actions a role can perform on a specific resource
export function getResourceActions(
  userRole: UserRole,
  resource: string
): string[] {
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return [];

  const resourcePermission = permissions.find((p) => p.resource === resource);
  return resourcePermission ? resourcePermission.actions : [];
}

export function getAccessibleNavItems(userRole: UserRole) {
  const accessibleItems = [];

  // Account section - always accessible
  accessibleItems.push({
    title: 'Account',
    url: '#',
    icon: 'userPen',
    isActive: false,
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['p', 'p']
      }
    ]
  });

  // Organization - check permissions
  if (canAccessOrganization(userRole)) {
    accessibleItems[0].items.push({
      title: 'Org',
      url: '/dashboard/organization',
      icon: 'user2',
      shortcut: ['o', 'o']
    });
  }

  // Attainment section - check permissions
  if (canAccessAttainment(userRole)) {
    accessibleItems.push({
      title: 'Attainment',
      url: '/dashboard/attainment',
      icon: 'map',
      shortcut: ['a', 'a'],
      isActive: true,
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard/attainment',
          shortcut: ['a', 'd']
        }
      ]
    });
  }

  // Reports section - check permissions
  if (canAccessReports(userRole)) {
    accessibleItems.push({
      title: 'Reports',
      url: '/dashboard/reports',
      icon: 'barChart3',
      shortcut: ['r', 'r'],
      items: [
        {
          title: 'Efficiency Reports',
          url: '/dashboard/reports/efficiency',
          shortcut: ['r', 'e']
        },
        {
          title: 'Downtime Analysis',
          url: '/dashboard/reports/downtime',
          shortcut: ['r', 'd']
        }
      ]
    });
  }

  // Settings section - check permissions
  if (canAccessSettings(userRole)) {
    accessibleItems.push({
      title: 'Settings',
      url: '/dashboard/settings',
      icon: 'settings',
      shortcut: ['s', 's'],
      items: [
        {
          title: 'General Settings',
          url: '/dashboard/settings/general',
          shortcut: ['s', 'g']
        },
        {
          title: 'User Management',
          url: '/dashboard/settings/users',
          shortcut: ['s', 'u']
        }
      ]
    });
  }

  return accessibleItems;
}
